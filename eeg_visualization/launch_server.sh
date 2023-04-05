#!/bin/bash
sudo apt-get update
sudo apt-get install ffmpeg libsm6 libxext6  -y
sudo apt-get install python3.10 -y
sudo apt-get install python3-pip -y
sudo apt-get install gunicorn -y
sudo apt-get install nginx -y

python3 -m pip install --no-cache-dir --upgrade pip
python3 -m pip install --no-cache-dir --upgrade open3d
python3 -m pip install --no-cache-dir --upgrade Django
python3 -m pip install --no-cache-dir --upgrade scikit-learn

sudo cp gunicorn.service /etc/systemd/system/gunicorn.service
sudo cp gunicorn.socket /etc/systemd/system/gunicorn.socket
sudo cp site.conf /etc/nginx/sites-available/eeg_visualization
sudo cp nginx.conf /etc/nginx/nginx.conf

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic

sudo systemctl start nginx
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
sudo ln -s /etc/nginx/sites-available/eeg_visualization /etc/nginx/sites-enabled
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'



