

from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date

import uuid





class User(AbstractUser):

    username = None

    email = models.EmailField(
        unique=True,
        blank=False,
        null=False
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


    # Location
    continent = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )


    country_code = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )


    state = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )


    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )



    # Personal
    gender = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    # Merchant
    is_merchant = models.BooleanField(
        default=False
    )

    is_merchant_verified = models.BooleanField(
        default=False
    )

    USERNAME_FIELD = "phone"

    REQUIRED_FIELDS = []



    @property
    def age(self):

        if not self.date_of_birth:
            return None

        today = date.today()

        return (
            today.year
            - self.date_of_birth.year
            - (
                (today.month, today.day)
                <
                (
                    self.date_of_birth.month,
                    self.date_of_birth.day
                )
            )
        )

    def __str__(self):
        return self.phone
    





class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.phone} Profile"    
    