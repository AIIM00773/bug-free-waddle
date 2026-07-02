




import uuid
import os
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class TimeStampedModel(models.Model):
    """
    Abstract base class providing self-updating timestamp fields
    for robust transaction auditing and platform state tracking.
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True








class Country(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Country Name"), max_length=200, unique=True)
    zip_code = models.CharField(_("ZIP / Postal Code"), max_length=50, unique=True, db_index=True)
    is_setup_for_operation = models.BooleanField(_("Is Operational"), default=True, db_index=True)

    class Meta:
        verbose_name = _("Country")
        verbose_name_plural = _("Countries")
        ordering = ['name']

    def __str__(self):
        return self.name








class Category(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Category Name"), max_length=255, unique=True, db_index=True)
    related_categories = models.ManyToManyField(
        'self', 
        blank=True, 
        symmetrical=True,
        help_text=_("Categories commonly associated or recommended with this item matrix.")
    )
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['name']

    def __str__(self):
        return self.name







class Brand(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Brand Name"), max_length=255, unique=True, db_index=True)
    categories = models.ManyToManyField(Category, blank=True, related_name='brands')
    related_brands = models.ManyToManyField('self', blank=True, symmetrical=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = _("Brand")
        verbose_name_plural = _("Brands")
        ordering = ['name']

    def __str__(self):
        return self.name







# type similarity as frontend ...
class Currency(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Currency Name"), max_length=200, unique=True)
    symbol = models.CharField(_("Currency Symbol"), max_length=20, null=True, blank=True)
    code = models.CharField(_("ISO Currency Code"), max_length=10, unique=True, db_index=True, default="KES")
    country = models.ForeignKey( Country,  on_delete=models.PROTECT,  related_name='currencies',help_text=_("The primary economic region utilizing this currency asset.") )
    is_allowed = models.BooleanField(_("Is Allowed / Active"), default=False, db_index=True)
    is_base_currency = models.BooleanField(_("Is Base Currency"), default=False, db_index=True,help_text=_("System anchor currency used for calculating global conversion rate metrics."))
    
    class Meta:
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")
        ordering = ['code']

    def __str__(self):
        return f"{self.code} ({self.symbol})"


    def clean(self):
        """
        Model validation logic to prevent data mutations from corrupting currency hierarchies.
        """
        super().clean()
        if self.is_base_currency and not self.is_allowed:
            raise ValidationError(_("The system anchor baseline currency must be flagged as active/allowed."))







class Color(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Color Name"), max_length=100, unique=True, db_index=True)
    hex_code = models.CharField(
        _("HEX Code"), 
        max_length=7, 
        blank=True, 
        null=True, 
        help_text=_("e.g., #FFFFFF or #000000")
    )
    
    description = models.TextField(null=True , blank=True)

    class Meta:
        verbose_name = _("Color")
        verbose_name_plural = _("Colors")
        ordering = ['name']

    def __str__(self):
        return self.name








class Size(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Size Value"), max_length=50, unique=True, db_index=True)
    unit_symbol = models.CharField(max_length=20, unique=True)

    class Meta:
        verbose_name = _("Size")
        verbose_name_plural = _("Sizes")
        ordering = ['name']

    def __str__(self):
        return self.name








class Shape(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Shape Value"), max_length=100, unique=True, db_index=True)

    class Meta:
        verbose_name = _("Shape")
        verbose_name_plural = _("Shapes")
        ordering = ['name']

    def __str__(self):
        return self.name




class Weight(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    unit_name = models.CharField(_("weight unit name  String"), max_length=50, unique=True, db_index=True)
    symbol =  models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.symbol



class Tag(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Tag String"), max_length=50, unique=True, db_index=True)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ['name']

    def __str__(self):
        return self.name






class MerchantShopCategory(TimeStampedModel):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.title
    
  
    
    
    
    