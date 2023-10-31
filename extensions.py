#from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache 
db = SQLAlchemy()
migrate = Migrate()
#login_manager = LoginManager()
cache = Cache()