from django.contrib.auth.models import AbstractUser
from django.db import models
import time
def avatar_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    timestamp = int(time.time())
    return f"avatars/{instance.pk}_{instance.first_name}_{instance.last_name}_{instance.username}_{timestamp}.{ext}"

class CustomUser(AbstractUser):
    is_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)