
from flask_security import UserMixin, RoleMixin
from datetime import datetime
from extensions import db

class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, unique=True, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    active=db.Column(db.Boolean())
    email=db.Column(db.String(),unique=True,nullable=False)
    visited=db.Column(db.Boolean, default=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier=db.Column(db.String(255),unique=True,nullable=True)
    role = db.Column(db.String, default="user", nullable=False)
    roles = db.relationship('Role',secondary='roles_users',backref=db.backref('users'))
    
class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer(),primary_key=True)
    name=db.Column(db.String(50),unique=True,nullable=False)
    desc=db.Column(db.String(100)) 

roles_users=db.Table('roles_users',
                        db.Column('user_id',db.Integer(),db.ForeignKey('users.id')),
                        db.Column('role_id',db.Integer(),db.ForeignKey('role.id'))) 

class Categories(db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, unique=True, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    img_url = db.Column(db.String, nullable=True)

class Products(db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, unique=True, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    manufacture_date = db.Column(db.DateTime, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    rate_per_unit=db.Column(db.Float, nullable=False)
    unit=db.Column(db.String, nullable=False, default="Rs/kg")
    available_quantity=db.Column(db.Integer, nullable=False)
    category_id=db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    categories=db.relationship("Categories", backref='products', primaryjoin='Products.category_id == Categories.id')

class Carts(db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String, nullable=False)
    users = db.relationship("Users", backref=db.backref("carts", lazy=True), primaryjoin='Carts.user_id == Users.id')

class Cart_items(db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, unique=True, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False, default=0)
    carts = db.relationship("Carts", backref=db.backref("cart_items", lazy=True), primaryjoin='Cart_items.cart_id == Carts.id')
    products = db.relationship("Products", backref=db.backref("cart_items", lazy=True), primaryjoin='Cart_items.product_id == Products.id')

class Transactions(db.Model):
    id = db.Column(db.Integer, nullable=False, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False, default=0)
    users=db.relationship("Users", backref=db.backref('transactions', lazy=True), primaryjoin='Transactions.user_id == Users.id')
