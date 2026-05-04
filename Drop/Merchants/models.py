import uuid
from django.conf import settings
from django.db import models
from django.utils.text import slugify

# --- MERCHANT IDENTITY ---


class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    zipcode = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class County(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Subcounty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Street(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name



class Merchant(models.Model):
    """
    Represents the business entity for a user.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='merchant_profile'
    )
    merchant_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Shop Identity
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    profile_pic = models.ImageField(upload_to='merchants/profiles/', blank=True, null=True)
    bio = models.TextField(blank=True)

    
    # Contact (Structured for )
    phone = models.CharField(max_length=13, unique=True)
    email = models.CharField(max_length=100, unique=True)
    address = models.JSONField(default=dict, null=True, blank=True)




    # Vendor Location (headquarters and shop location)
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='merchants'
    )
    county = models.ForeignKey(
        County,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='county_merchants'
    )
    subcounty = models.ForeignKey(
        Subcounty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subcounty_merchants'
    )
    street = models.ForeignKey(
        Street,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='street_merchants'
    )
    coordinates = models.CharField(max_length=20, null=True, blank=True)



    # Status Flags
    is_active = models.BooleanField(default=False)    
    is_verified = models.BooleanField(default=False) 
    in_holiday_mode = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.user.username})"





# --- MERCHANT CONTROLS ---

class MerchantConfig(models.Model):
    """
    Global controls for how this merchant's products behave across the platform.
    """
    merchant = models.OneToOneField(
        Merchant, 
        on_delete=models.CASCADE, 
        related_name='config'
    )
    
    # Admin Controls
    admin_suspended = models.BooleanField(default=False)
    suspension_reason = models.TextField(blank=True)
    
    # Merchant Controls
    vacation_mode = models.BooleanField(default=False)

    @property
    def can_sell(self) -> bool:
        """
        The master gate for 'Drop AI' or the frontend to determine 
        if products should be shoppable.
        """
        return (
            self.merchant.is_active and 
            not self.admin_suspended and 
            not self.vacation_mode
        )

    def __str__(self):
        return f"Config for {self.merchant.title}"