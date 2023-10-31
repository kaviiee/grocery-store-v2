from flask import Flask
from flask_restful import Resource, Api
from models import Users
from routes import routes
from api import *
from extensions import migrate, db, cache#, login_manager
#from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from security import user_datastore,sec
from flask_cors import CORS
import workers

#api=None
#app=None
def create_app():
    #global api
    #global app
    app = Flask(__name__)
    app.static_url_path = '/static'
    #app.secret_key = "KEY"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grocery_store_version2.db'
    app.config['SECRET_KEY']='asecretkey'
    app.config['WTF_CSRF_ENABLED']=False
    app.config['SECURITY_PASSWORD_HASH']='bcrypt'
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER']="Authentication-Token"
    app.config['SECURITY_PASSWORD_SALT']='salt'
    app.config['CACHE_TYPE']="RedisCache"

    db.init_app(app)
    api = Api(app)
    celery=None
    migrate.init_app(app, db)
    cache.init_app(app)
    # Configure Celery
    celery=workers.celery
    CORS(app)
    #sec.init_app(app,user_datastore)
    
    #login_manager.login_view = 'routes.login'  # Set the login view function name
    #login_manager.init_app(app)
    # Load the user object from the database
    #@login_manager.user_loader
    #def load_user(user_id):
     #   return Users.query.get(int(user_id))
    celery.conf.update(
        broker_url = "redis://localhost:6379/1",
        result_backend = "redis://localhost:6379/2",
        timezone = 'Asia/Kolkata'
    )
    celery.Task = workers.ContextTask
    app.register_blueprint(routes)
    api.add_resource(UserAPI, "/user", "/user/<int:id>")
    api.add_resource(CategoriesAPI, "/categories/<int:id>", "/categories")
    api.add_resource(EditCategoryAPI, "/edit_cat/<int:id>")
    api.add_resource(ProductsAPI, "/all_products", "/all_products/<int:id>")
    api.add_resource(EditProductAPI, "/edit_product/<int:id>")
    api.add_resource(CartAPI, "/cart/<int:id>")
    api.add_resource(CheckoutAPI, "/check/<int:id>")
    api.add_resource(ExportApi,"/export/<int:id>")
    
    return app, api,celery

app, api, celery =create_app()
#db.create_all()

if __name__ == "__main__":
    #app, api = create_app()
    sec.init_app(app, user_datastore)
    #print("inside main")
    with app.app_context():
        db.create_all()
    app.run(debug=True)