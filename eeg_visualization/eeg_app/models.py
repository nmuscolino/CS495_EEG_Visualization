from django.db import models

# Create your models here.
class Scan(models.Model):
    scan_name = models.CharField(max_length=50)
    upload_date = models.DateTimeField(auto_now_add=True)
    scan_json = models.JSONField()

    def __str__(self):
        return self.scan_name
