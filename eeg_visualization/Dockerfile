FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y && \
    python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir --upgrade open3d && \
    python3 -m pip install --no-cache-dir --upgrade Django && \
    python3 -m pip install --no-cache-dir --upgrade scikit-learn

COPY . .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
