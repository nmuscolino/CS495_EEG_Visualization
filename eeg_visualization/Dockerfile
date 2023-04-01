FROM ubuntu

RUN useradd -ms /bin/bash john

WORKDIR /home/john/eeg_visualization

RUN mkdir /home/john/logs && \
    mkdir /home/john/VirtualEnvironments

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y && \
    apt-get install python3.10 -y && \
    apt-get install python3-pip -y && \
    apt-get install apache2 libapache2-mod-wsgi-py3 -y
    
RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir --upgrade virtualenv

RUN cd /home/john/VirtualEnvironments && \
    virtualenv venv -p python3 && \
    . venv/bin/activate && \
    python3 -m pip install --no-cache-dir --upgrade open3d && \
    python3 -m pip install --no-cache-dir --upgrade Django && \
    python3 -m pip install --no-cache-dir --upgrade scikit-learn

RUN cd /home/john/eeg_visualization

COPY . .

RUN . /home/john/VirtualEnvironments/venv/bin/activate

RUN python3 manage.py makemigrations && \
    python3 manage.py migrate && \
    python3 manage.py collectstatic

RUN mv eeg_visualization.conf /etc/apache2/sites-available/000-default.conf

RUN a2ensite 000-default.conf && \
    chmod 755 /home/john
    
RUN service apache2 restart

CMD ["apache2ctl", "-D", "FOREGROUND"]
    
   







