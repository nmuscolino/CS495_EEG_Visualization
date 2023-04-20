from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)     # The user who uploaded the scan
    scan_name = models.CharField(max_length=50)                             # The name provided by the user on upload
    upload_date = models.DateTimeField(auto_now_add=True)                   # The date the scan was uploaded
    scan_json = models.JSONField()                                          # The electrode coordinates stored in JSON format

    def __str__(self):
        return self.scan_name
