from flask_security import Security,SQLAlchemyUserDatastore
from extensions import db
from models import Users,Role

user_datastore=SQLAlchemyUserDatastore(db,Users,Role)
sec=Security()