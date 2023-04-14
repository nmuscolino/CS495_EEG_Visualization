from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    scan_name = models.CharField(max_length=50)
    upload_date = models.DateTimeField(auto_now_add=True)
    scan_json = models.JSONField()

    def __str__(self):
        return self.scan_name
