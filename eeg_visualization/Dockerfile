FROM ubuntu

RUN useradd -ms /bin/sh john

WORKDIR /home/john/eeg_visualization

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN apt-get install python3.10 -y
RUN apt-get install python3-pip -y
RUN apt-get install gunicorn -y
RUN apt-get install nginx -y

RUN python3 -m pip install --no-cache-dir --upgrade pip
RUN python3 -m pip install --no-cache-dir --upgrade open3d
RUN python3 -m pip install --no-cache-dir --upgrade Django
RUN python3 -m pip install --no-cache-dir --upgrade scikit-learn

COPY . .

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
RUN python3 manage.py collectstatic

RUN mv gunicorn.socket /etc/systemd/system/gunicorn.socket
RUN mv gunicorn.service /etc/systemd/system/gunicorn.service
RUN mv eeg_visualization.conf /etc/nginx/sites-available/eeg_visualization

RUN service gunicorn.socket start
RUN service gunicorn.socket enable
RUN service gunicorn start
RUN service nginx start
RUN ufw allow 'Nginx Full'

CMD tail -f /dev/null


   







