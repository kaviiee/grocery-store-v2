from flask import Blueprint, render_template, redirect, url_for, request, flash
from models import db, Users, Categories, Products, Carts, Cart_items, Transactions
from sqlalchemy import exists
from datetime import datetime
from sqlalchemy.orm import joinedload
#from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
#from extensions import login_manager
from flask import Flask, request, jsonify

routes = Blueprint('routes', __name__)

#@login_manager.user_loader
#def load_user(user_id):
 #   return Users.query.get(int(user_id))

@routes.route('/')
def test():
    return render_template("index.html")

#@routes.route('/favicon.ico')
#def favicon():
#    return '', 204


""""
@routes.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()  # Assuming the request data is in JSON format
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Invalid credentials'}), 400

        user = Users.query.filter_by(username=username).first()

        if user and user.password==password:
            login_user(user)
            return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            """