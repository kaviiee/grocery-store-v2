#from flask import current_app as app
from celery import Celery,shared_task
# from .security import user_datastore, sec

celery = Celery("Application jobs")
class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        from app import app
        with app.app_context():  
            return self.run(*args, **kwargs)