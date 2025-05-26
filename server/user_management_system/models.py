from django.contrib.auth.models import AbstractUser
from django.db import models
import time
from django.utils.text import slugify
import os

def avatar_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    timestamp = int(time.time())
    return f"avatars/{instance.pk}_{instance.username}_{timestamp}.{ext}"

class CustomUser(AbstractUser):
    username = models.CharField(max_length=32, unique=True)
    is_verified = models.BooleanField(default=False)
    pending_email = models.EmailField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)


    def save(self, *args, **kwargs):
        # Save first to get a primary key (if new user)
        super().save(*args, **kwargs)

        if self.avatar:
            ext = self.avatar.name.split('.')[-1]
            timestamp = int(time.time())
            new_filename = f"{self.pk}_{slugify(self.username)}_{timestamp}.{ext}"
            new_path = os.path.join('avatars', new_filename)

            # Only rename if different from current name
            if self.avatar.name != new_path:
                # Full filesystem paths
                full_old_path = self.avatar.path
                full_new_path = os.path.join(self.avatar.storage.location, new_path)

                # Rename file on filesystem
                os.rename(full_old_path, full_new_path)

                # Update the avatar field to new name and save again (avoid recursion by updating directly)
                self.avatar.name = new_path
                super().save(update_fields=['avatar'])