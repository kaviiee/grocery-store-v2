#1.start redis server 
#open in a wsl terminal
sudo service redis-server start
redis-cli

#2.start the celery worker
python -m celery -A app.celery worker --pool=solo -l info
#celery -A app.celery worker -l info

#2.Start the celery beat
python -m celery -A app.celery beat --max-interval 1 -l info

#4.start mailhog server
wt MailHog_windows_amd64.exe

#5.Run app.py file