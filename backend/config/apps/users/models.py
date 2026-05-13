

from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date

import uuid





import uuid
from datetime import date

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone


class User(AbstractUser):

    # ---------------------------------------------------------
    # CORE IDENTITY
    # ---------------------------------------------------------

    unique_uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        db_index=True
    )


    email = models.EmailField(
        unique=True,
        db_index=True
    )




    # ---------------------------------------------------------
    # PROFILE
    # ---------------------------------------------------------

    first_name = models.CharField(
        max_length=150,
        blank=True
    )

    last_name = models.CharField(
        max_length=150,
        blank=True
    )

    profile_image = models.ImageField(
        upload_to="users/profile_images/",
        blank=True,
        null=True
    )


    profile_image_url = models.URLField(
        null=True, blank=True
    )


    bio = models.TextField(
        max_length=500,
        blank=True,
        null=True
    )




    # ---------------------------------------------------------
    # LOCATION
    # ---------------------------------------------------------

    continent = models.CharField(
        max_length=100,
        blank=True,
        null=True,       
    )


    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_index=True
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
        null=True,
        db_index=True
    )

    timezone_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )




    # ---------------------------------------------------------
    # PERSONAL
    # ---------------------------------------------------------

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer Not To Say"),
    )

    gender = models.CharField(
        max_length=30,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )




    # ---------------------------------------------------------
    # ACCOUNT TYPE / ROLES
    # ---------------------------------------------------------

    is_customer = models.BooleanField(
        default=True
    )

    is_merchant = models.BooleanField(
        default=False,
        db_index=True
    )

    is_merchant_verified = models.BooleanField(
        default=False,
        db_index=True
    )

    is_banned = models.BooleanField(
        default=False
    )

    is_suspended = models.BooleanField(
        default=False
    )

    is_blocked = models.BooleanField(
        default= False
    )





    # ---------------------------------------------------------
    # VERIFICATION
    # ---------------------------------------------------------

    is_email_verified = models.BooleanField(
        default=False
    )


    is_phone_verified = models.BooleanField(
        default=False
    )







    # ---------------------------------------------------------
    # AI / PERSONALIZATION
    # ---------------------------------------------------------

    onboarding_completed = models.BooleanField(
        default=False
    )

    preferred_language = models.CharField(
        max_length=20,
        default="en"
    )

    last_prompt_at = models.DateTimeField(
        blank=True,
        null=True
    )






    # ---------------------------------------------------------
    # SECURITY
    # ---------------------------------------------------------

    last_ip_address = models.GenericIPAddressField(
        blank=True,
        null=True
    )

    failed_login_attempts = models.PositiveIntegerField(
        default=0
    )

    last_password_change = models.DateTimeField(
        blank=True,
        null=True
    )


    is_current_login_verified = models.BooleanField(
        default= False
    )




    # ---------------------------------------------------------
    # TIMESTAMPS
    # ---------------------------------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    deleted_at = models.DateTimeField(
        blank=True,
        null=True
    )






    # ---------------------------------------------------------
    # META
    # ---------------------------------------------------------

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["phone"]),
            models.Index(fields=["email"]),
            models.Index(fields=["is_merchant"]),
            models.Index(fields=["country"]),
            models.Index(fields=["city"]),
            models.Index(fields=["created_at"]),
        ]







    # ---------------------------------------------------------
    # PROPERTIES
    # ---------------------------------------------------------

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



    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()



    # ---------------------------------------------------------
    # METHODS
    # ---------------------------------------------------------

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=[
            "deleted_at",
            "is_active"
        ])


    def restore_account(self):
        self.deleted_at = None
        self.is_active = True
        self.save(update_fields=[
            "deleted_at",
            "is_active"
        ])

    def __str__(self):
        return f"{self.phone}"








class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    
    def __str__(self):
        return f"{self.user.username} Profile"    
    