from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, fields, marshal_with,reqparse,abort
from flask_security import auth_required
#from flask_login import current_user
import datetime
from tasks import welcome_mail, send_email, generate_csv, download_alert 
import json
import os
from extensions import db, cache
from sqlalchemy import or_
from security import user_datastore
from models import *
from sqlalchemy.orm import joinedload
import argparse
from celery.result import AsyncResult

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise argparse.ArgumentTypeError("Invalid date format. Expected format: YYYY-MM-DD")

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument("username", type=str, required=True)
create_user_parser.add_argument("password",type=str,required=True)
create_user_parser.add_argument("email",type=str,required=True)
create_user_parser.add_argument("role",type=str,required=True)


class UserAPI(Resource):
    @cache.cached(60)
    @auth_required('token')
    #@marshal_with(output_fields)
    def get(self, id:None):#get data frlm database
       
        user=user_datastore.find_user(id=id)
        if user:
            user.visited=True
            db.session.commit()
            return {"id": user.id, "username": user.username, "password": user.password, "role": user.role}, 201

        else:
            abort(400,message="User does not exist")

    def post(self):#post or insert data into database
        args = create_user_parser.parse_args()
        username = args.get("username", None)
        password = args.get("password", None)
        email = args.get("email", None)
        role = args.get("role", None)
        if username!="":
            if password!="":
                if not Users.query.filter_by(username=username).first():
                    new_user = Users(username=username, password=password, email=email, role=role, active=True)
                    
                    db.session.add(new_user)
                    db.session.commit()
                    welcome_mail.delay(receiver_email=email,subject='Hii there!',username=username, role=role)
                    json.dumps({'success':True}), 200, {'ContentType':'application/json'}
                else:
                    abort(400,message="User already exist.")   

            else:
                abort(400,message="Creating a password is mendatory")          
        else:
            abort(400,message="Username is mendatory") 

create_category_parser = reqparse.RequestParser()
create_category_parser.add_argument("id", type=str)
create_category_parser.add_argument("name", type=str, required=True)
create_category_parser.add_argument("img_url", type=str, required=True)

class CategoriesAPI(Resource):
    @auth_required('token')
    def get(self):
        cats = Categories.query.all()
        if not cats:
            return jsonify({"message": "No categories found"}), 404

        serialized_categories = [
            {"id": cat.id, "name": cat.name, "img_url": cat.img_url}
            for cat in cats
        ]
        return jsonify(serialized_categories)
        
    @auth_required('token')
    def put(self):
        args = create_category_parser.parse_args()
        name = args.get("name", None)
        img_url = args.get("img_url", None)
        id = args.get("id", None)
        category=Categories.query.filter_by(id=id).first()
        category.name = name
        category.img_url = img_url
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
    @auth_required('token')
    def post(self):
        args = create_category_parser.parse_args()
        name = args.get("name", None)
        img_url = args.get("img_url", None)
        category = Categories(name=name, img_url=img_url)
        db.session.add(category)
        db.session.commit()
        cat = Categories.query.filter_by(name=name).first()
        if cat:
        # Convert the model instance to a dictionary
            cat_dict = {
                'id': cat.id,
                'name': cat.name,
                'img_url': cat.img_url
            # Add other attributes as needed
            }
        
            return jsonify(cat_dict)
        else:
            return jsonify({'message': 'Category not found'}), 404
            #return jsonify(cat)
        #json.dumps({'success':True}), 200, {'ContentType':'application/json'}

    @auth_required('token')
    def delete(self,id):
        cat=Categories.query.filter_by(id=id).first()
        db.session.delete(cat)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
class EditCategoryAPI(Resource):
    """Edit categories"""
    @auth_required('token')
    def get(self,id):
        category = Categories.query.filter_by(id=id).first()
        if not category:
            return jsonify({"message": "Category not found"}), 404

        return {"id": category.id, "name": category.name, "img_url": category.img_url}, 201
    
    @auth_required('token')
    def post(self,id):
        args = create_category_parser.parse_args()
        name = args.get("name", None)
        img_url = args.get("img_url", None)
        category = Categories.query.filter_by(id=id).first()
        if not category:
            return jsonify({"message": "Category not found"}), 404
        category.name=name
        category.img_url=img_url
        db.session.commit()
        return {"id": category.id, "name": category.name, "img_url": category.img_url}, 201

create_products_parser = reqparse.RequestParser()
create_products_parser.add_argument("category", type=str, required=True)
create_products_parser.add_argument("name", type=str, required=True)
create_products_parser.add_argument("manufacture_date", type=parse_date, required=True)
create_products_parser.add_argument("expiry_date", type=parse_date, required=True)
create_products_parser.add_argument("rate_per_unit", type=float, required=True)
create_products_parser.add_argument("unit", type=str, required=True)
create_products_parser.add_argument("available_quantity", type=int, required=True)

create_search_parser = reqparse.RequestParser()
create_search_parser.add_argument("field", type=str, required=True)
create_search_parser.add_argument("value", type=str, required=True)

class ProductsAPI(Resource):
    @auth_required('token')
    def put(self):
        args = create_search_parser.parse_args()
        field = args.get("field", None)
        value = args.get("value", None)
        if field and value:
            if field == "category":
                # Handle category search differently
                category = Categories.query.filter_by(name=value).first()
                products = category.products
            else:
                attribute = getattr(Products, field)
                products = Products.query.options(joinedload(Products.categories)).filter(attribute==value).all()

        #else:
            #products = Products.query.options(joinedload(Products.categories)).order_by(Products.category_id).all()
        
        else:
            products = Products.query.all() #options(joinedload(Products.categories)).order_by(Products.category_id).
        products_grouped = {}
        for product in products:
            category_name = product.categories.name
            if category_name not in products_grouped:
                products_grouped[category_name] = []
            product_dict = {
            "id": product.id,
            "name": product.name,
            "category_id": product.category_id,
            "manufacture_date": product.manufacture_date.strftime('%Y-%m-%d'),
            "expiry_date": product.expiry_date.strftime('%Y-%m-%d'),
            "rate_per_unit": product.rate_per_unit,
            "unit": product.unit,
            "available_quantity": product.available_quantity,
            "num": 1
            }
        
            products_grouped[category_name].append(product_dict)
            
        return jsonify(products_grouped)
    
    @auth_required('token')
    def post(self):
        args = create_products_parser.parse_args()
        name = args.get("name", None)
        category = args.get("category", None)
        manufacture_date = args.get("manufacture_date", None)
        expiry_date = args.get("expiry_date", None)
        rate_per_unit = args.get("rate_per_unit", None)
        unit = args.get("unit", None)
        available_quantity = args.get("available_quantity", None)
        
        category_id = Categories.query.filter_by(name=category).first().id
        
        new_product = Products(name=name, category_id=category_id, manufacture_date=manufacture_date, expiry_date=expiry_date, rate_per_unit=rate_per_unit, unit=unit, available_quantity=available_quantity)
        db.session.add(new_product)
        db.session.commit()
        return {"message":"product added"}, 200
    
    @auth_required('token')
    def delete(self,id):
        prod=Products.query.filter_by(id=id).first()
        db.session.delete(prod)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}

class EditProductAPI(Resource):
    """Edit categories"""
    @auth_required('token')
    def get(self,id):
        product = Products.query.filter_by(id=id).first()
        if not product:
            return jsonify({"message": "product not found"}), 404
        #category = Categories.query.filter_by(id=product.category_id).first().name
        return { "id": product.id,
            "name": product.name,
            "category": product.categories.name,
            "manufacture_date": product.manufacture_date.strftime('%Y-%m-%d'),
            "expiry_date": product.expiry_date.strftime('%Y-%m-%d'),
            "rate_per_unit": product.rate_per_unit,
            "unit": product.unit,
            "available_quantity": product.available_quantity}, 201
    
    @auth_required('token')
    def post(self,id):
        args = create_products_parser.parse_args()
        name = args.get("name", None)
        category = args.get("category", None)
        manufacture_date = args.get("manufacture_date", None)
        expiry_date = args.get("expiry_date", None)
        rate_per_unit = args.get("rate_per_unit", None)
        unit = args.get("unit", None)
        available_quantity = args.get("available_quantity", None)
        product = Products.query.filter_by(id=id).first()
        if not product:
            return jsonify({"message": "product not found"}), 404
        product.name=name
        product.manufacture_date = manufacture_date
        product.expiry_date = expiry_date
        product.rate_per_unit = rate_per_unit
        product.unit = unit
        product.available_quantity = available_quantity
        product.category_id = Categories.query.filter_by(name=category).first().id
        db.session.commit()
        return {"message":"success"}, 200
    
create_carts_parser = reqparse.RequestParser()
create_carts_parser.add_argument("p_id", type=int, required=True)
create_carts_parser.add_argument("user_id", type=int, required=True)
create_carts_parser.add_argument("qty", type=int, required=True)

class CartAPI(Resource):
    @auth_required('token')
    def post(self,id):
        args = create_carts_parser.parse_args()
        p_id = args.get("p_id", None)
        user_id = args.get("user_id", None)
        qty = args.get("qty", None)
        cart=Carts.query.filter_by(user_id=user_id).first()
        rate = Products.query.filter_by(id=p_id).first().rate_per_unit
        total = int(rate)*qty
        if not cart:
            new_cart=Carts(user_id=user_id, status="active")
            db.session.add(new_cart)
            db.session.commit()
        cart_id=Carts.query.filter_by(user_id=user_id).first().id
        new_cart_item=Cart_items(cart_id=cart_id, product_id=p_id, quantity=qty, total=total)
        db.session.add(new_cart_item)
        db.session.commit()
        return {"message":"success"}, 200
    
    @auth_required('token')
    def get(self,id):
        cart_id = Carts.query.filter_by(user_id=id).first().id
        items = Cart_items.query.filter_by(cart_id=cart_id).all()
        if not items:
            return {"message": "No items found"}, 404

        serialized_items = [
            {"id": item.id, "name": item.products.name, "category": item.products.categories.name, "quantity": item.quantity, "rate": item.products.rate_per_unit, "unit":item.products.unit, "manufacture_date": item.products.manufacture_date.strftime('%Y-%m-%d'), "expiry_date": item.products.expiry_date.strftime('%Y-%m-%d'), "total":item.total}
            for item in items
        ]
        return jsonify(serialized_items)
    
    @auth_required('token')
    def delete(self, id):
        item = Cart_items.query.filter_by(id=id).first()
        db.session.delete(item)
        db.session.commit()
        return {"message":"deletion successful"}
    
class CheckoutAPI(Resource):
    @auth_required('token')
    def get(self,id):
        cart_id = Carts.query.filter_by(user_id=id).first().id
        cart_items=Cart_items.query.filter_by(cart_id=cart_id).all()
        cart_total=0
        for item in cart_items:
            cart_total = cart_total+item.total
            qty = item.quantity
            prod_id = item.product_id
            prod = Products.query.filter_by(id=prod_id).first()
            prod.available_quantity = prod.available_quantity - qty
            db.session.delete(item)
        db.session.commit()
        
        new_transaction = Transactions(user_id=id, amount=cart_total)
        db.session.add(new_transaction)
        db.session.commit()
        return cart_total
    

class ExportApi(Resource):
    # @auth_required("token")
    @cache.cached(60)
    def get(self,id=None):
        user=user_datastore.find_user(id=id)
        if user:
            csv_file=generate_csv.delay(id)
            try:
                file_path=csv_file.get()
                print(file_path)
                if file_path:
                    download_alert.delay(receiver_email=user.email, file_path=file_path)
                    # return send_file(file_path)
                    # return Response(generate(file_path), mimetype='text/csv', headers={
                    #     'Content-Disposition': 'attachment; filename=tracker.csv'
                    # })
                    #with open(file_path, 'r') as csvfile:
                        #csv_contents = csvfile.read()
                    #os.remove(file_path)
                    #response = make_response(csv_contents)
                    #response.headers.set('Content-Type', 'text/csv')
                    #response.headers.set('Content-Disposition', 'attachment', filename='tracker.csv')
                    #response.headers.set('Content-Length', len(csv_contents))
                    json.dumps({'success':True}), 200, {'ContentType':'application/json'}
            except:
                return "Error is coming from export_api"    
        else:
            abort(400,message="User does not exist")