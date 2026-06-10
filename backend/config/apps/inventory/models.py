import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    Abstract base class providing self-updating fields 
    and transaction tracking logs across the platform state.
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


class Marketplace(TimeStampedModel):
    title = models.CharField(_("Marketplace Title"), max_length=200, unique=True, db_index=True)
    country = models.ForeignKey(
        Country, 
        on_delete=models.PROTECT, 
        related_name='marketplaces',
        help_text=_("Operational country boundary for pricing and regional logistics configurations.")
    )
    base_url = models.URLField(_("Base URL"), unique=True)
    direct_search_url = models.URLField(_("Direct Search URL"), unique=True, null=True, blank=True)
    categorised_search_url = models.URLField(_("Categorized Search URL"), unique=True, null=True, blank=True)
    brand_based_search_url = models.URLField(_("Brand Search URL"), unique=True, null=True, blank=True)
    
    # Scraper extraction structure blueprint mapping rules
    product_structure = models.JSONField(_("Product Structure Configuration"), default=dict, blank=True)

    class Meta:
        verbose_name = _("Marketplace")
        verbose_name_plural = _("Marketplaces")
        ordering = ['title']

    def __str__(self):
        return f"{self.title} ({self.country.name})"
    
    
    
    
    
    
    
    
    
class Currency(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Currency Name"), max_length=200, unique=True)
    symbol = models.CharField(_("Currency Symbol"), max_length=20)
    code = models.CharField(_("ISO Currency Code"), max_length=10, unique=True, db_index=True, default="KES")
    
    country = models.ForeignKey(
        Country, 
        on_delete=models.PROTECT, 
        related_name='currencies',
        help_text=_("The primary economic region utilizing this currency asset.")
    )
    
    is_allowed = models.BooleanField(_("Is Allowed / Active"), default=False, db_index=True)
    is_base_currency = models.BooleanField(
        _("Is Base Currency"), 
        default=False, 
        db_index=True,
        help_text=_("System anchor currency used for calculating global conversion rate metrics.")
    )
    
    class Meta:
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")
        ordering = ['code']

    def __str__(self):
        return f"{self.code} ({self.symbol})"

    @property
    def get_currency_value_based_on_base_currency(self):
        """
        Calculates exchange conversion factor relative to the system's active base currency.
        Returns a float/Decimal multiplier if currency is allowed, otherwise None.
        """
        if not self.is_allowed:
            return None
        if self.is_base_currency:
            return 1.00
            
        # TODO: Hook your ExchangeRate matrix/pipeline lookup here:
        # return ExchangeRate.get_rate(source=self.code, target=base_currency.code)
        return None

    def clean(self):
        """
        Model validation logic to prevent data mutations from corrupting currency hierarchies.
        """
        from django.core.exceptions import ValidationError
        
        # Enforce that only a single model instance is designated as the master baseline anchor
        if self.is_base_currency and not self.is_allowed:
            raise ValidationError(_("The system anchor baseline currency must be flagged as active/allowed."))
        
        
        
        
    

class Category(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Category Name"), max_length=255, unique=True, db_index=True)
    related_categories = models.ManyToManyField(
        'self', 
        blank=True, 
        symmetrical=True,
        help_text=_("Categories commonly associated or recommended with this item matrix.")
    )

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

    class Meta:
        verbose_name = _("Brand")
        verbose_name_plural = _("Brands")
        ordering = ['name']

    def __str__(self):
        return self.name



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

    class Meta:
        verbose_name = _("Color")
        verbose_name_plural = _("Colors")
        ordering = ['name']

    def __str__(self):
        return self.name



class Size(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Size Value"), max_length=50, unique=True, db_index=True)

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



class Tag(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(_("Tag String"), max_length=50, unique=True, db_index=True)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    sku = models.CharField(_("SKU Reference ID"), max_length=100, unique=True, db_index=True)
    title = models.CharField(_("Product Title"), max_length=255, db_index=True)
    description = models.TextField(_("Product Description"), blank=True)
    
    # Marketplace structural reference tracking origin
    marketplace = models.ForeignKey(
        Marketplace,
        on_delete=models.PROTECT,
        related_name='products',
        null=True,
        help_text=_("The marketplace where this item record was parsed and extracted from.")
    )
   
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT, 
        related_name='products'
    )
    
    brand = models.ForeignKey(
        Brand, 
        on_delete=models.PROTECT, 
        related_name='products', 
        null=True, 
        blank=True
    )
    
    price = models.DecimalField(
        _("Current Price"),
        max_digits=12,
        decimal_places=2, 
        validators=[MinValueValidator(0.00)]
    )
    inventory_count = models.PositiveIntegerField(_("Stock Inventory Count"), null=True, blank=True)
    is_active = models.BooleanField(_("Is Active / Visible"), default=True, db_index=True)
    
    colors = models.ManyToManyField(Color, blank=True, related_name='products')
    sizes = models.ManyToManyField(Size, blank=True, related_name='products')
    shapes = models.ManyToManyField(Shape, blank=True, related_name='products')
    tags = models.ManyToManyField(Tag, blank=True, related_name='products')

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['marketplace', 'is_active']),
        ]

    def __str__(self):
        return f"[{self.sku}] {self.title}"