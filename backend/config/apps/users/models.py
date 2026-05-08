

from django.contrib.auth.models import AbstractUser
from django.db import models

import uuid



class User(AbstractUser):

    username = None

    email = models.EmailField(
        unique=True,
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20,
        unique=True
    )

    unique_uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )


    is_merchant = models.BooleanField(default=False)

    is_merchant_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "phone"

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.phone




class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.phone} Profile"    
    