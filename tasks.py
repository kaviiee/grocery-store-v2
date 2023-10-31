from workers import celery
from celery.schedules import crontab
from flask_restful import abort
from flask_login import current_user
from jinja2 import Template
from weasyprint import HTML
import os
from datetime import datetime
from sqlalchemy import extract
from extensions import db
import smtplib
from models import *
import csv
from email.mime.text import MIMEText
from security import user_datastore
from email.mime.multipart import MIMEMultipart
from email import encoders
from email.mime.base import MIMEBase

SMTP_SERVER_HOST='localhost'
SMTP_SERVER_PORT=1025
SENDER_ADDRESS="email@kavii.com"
SENDER_PASSWORD=""

current_month = datetime.now().month
current_year = datetime.now().year
current_date = datetime.now()

def send_email(receiver_email,subject,message,attachment_files=None):
    try:
        msg=MIMEMultipart()
        msg["From"]=SENDER_ADDRESS
        msg["To"]=receiver_email
        msg['Subject']=subject
        msg.attach(MIMEText(message,"html"))

        if attachment_files:
            with open(attachment_files,"rb") as f:
                attach=MIMEBase("application","octet-stream")
                attach.set_payload(f.read())
            encoders.encode_base64(attach)
            attach.add_header(
                "Content-Disposition", f"attachment; filename={attachment_files}"
            )    
            msg.attach(attach)

        s=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
        s.login(SENDER_ADDRESS,SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()

        return True

    except Exception as e:
        print(e)

@celery.task
def welcome_mail(receiver_email, subject, username, role):
    from flask import current_app as app
    with app.app_context():
        with open("./mails/welcome.html",'r') as f:
            template = Template(f.read())
        send_email(receiver_email,subject,message=template.render(user=username, role=role))
        return "Mail sent"

@celery.task
def daily_reminder():
    from flask import current_app as app
    with app.app_context():
        users=db.session.query(Users).all()
        with open("./mails/reminder.html",'r') as f:
            template = Template(f.read())
        for user in users:
            if user.visited==True:
                print()
            else:
                send_email(user.email,subject="daily reminder",message=template.render(user=user.username))
                db.session.commit()
        return "daily reminder sent"        

@celery.task
def visited():
    from flask import current_app as app
    with app.app_context():
        users=db.session.query(Users).all()
        for user in users:
            user.visited=False
            db.session.commit()

@celery.task
def monthly_pdf_report(id):
    from flask import current_app as app
    with app.app_context():
        user=Users.query.filter_by(id=id).first()
        transactions=Transactions.query.filter(
        extract('year', Transactions.transaction_date) == current_year,
        extract('month', Transactions.transaction_date) == current_month,
        Transactions.user_id == id).all()
        if user:
            all_transactions=[]
            total=0
            for transaction in transactions:
                all_transactions.append(transaction)
                total=total+transaction.amount
        with open("./reports/monthly_report.html") as f:
            template=Template(f.read())
        res=template.render(all_transactions=all_transactions,total=total,user=user.username)  
        html=HTML(string=res)
        file_name="./monthly_reports/"+str(user.username)+"_monthly_report.pdf"
        if os.path.exists(file_name):
            os.remove(file_name)
        html.write_pdf(target=file_name)
        return file_name    

@celery.task
def monthly_report():
    from flask import current_app as app
    with app.app_context():
        users=Users.query.filter_by(role="user").all()
        f=open('./mails/report.html','r')
        template=Template(f.read())
        if users:
            for user in users:
                file_path=monthly_pdf_report(id=user.id)
                if file_path:
                    send_email(user.email,subject="Monthly Report of Grocery Store",message=template.render(username=user.username),attachment_files=file_path)
            f.close()
            return "monthly report sent"
        else:
            abort(400,message="User not found")

@celery.task
def generate_csv(id):
    from flask import current_app as app
    with app.app_context():
        user=user_datastore.find_user(id=id)
        file_path =str(user.username) + "_report.csv"
        products=Products.query.all()
    # Open CSV file and write data to it
        try:
            with open(file_path, 'w', newline='') as csvfile:
                try:
                    writer = csv.writer(csvfile)
                    header = ["S_no.","Product name", "category", "expired", "rate", "unit", "quantity remaining"]
                    writer.writerow(header)
                except Exception as e:
                    print("Error writing to CSV:", str(e))
                s_no=0
                for product in products:
                    s_no+=1
                    expired=False
                    if(current_date>=product.expiry_date):
                        expired=True
                    data=[s_no,product.name,product.categories.name, expired, product.rate_per_unit, product.unit, product.available_quantity]
                    writer.writerow(data)
        except:
            raise Exception("error")            
        return file_path

@celery.task
def download_alert(receiver_email, file_path):
    from flask import current_app as app
    with app.app_context():
        user=user_datastore.find_user(email=receiver_email)
        name=user.username
        f = open('./mails/alert.html','r')
        template = Template(f.read())
        send_email(receiver_email,subject="Download alert",message=template.render(user=user.username),attachment_files=str(name)+"_report.csv")
        os.remove(file_path)
        return "sent download alert"

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(
            hour=18,
            minute=45,
            day_of_month=15
        ),
        monthly_report.s(), name='31st of every month at 11:00 PM'
    )
    sender.add_periodic_task(
        crontab(
            hour=18,
            minute=44
        ),
        daily_reminder.s(), name="Daily reminder at 4:30 PM"
    )
    sender.add_periodic_task(
        crontab(
            hour=15,
            minute=34
        ),
        visited.s(), name="Reset visited status")