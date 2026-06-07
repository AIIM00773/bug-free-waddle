import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    Abstract base class to provide self-updating 'created_at' 
    and 'updated_at' fields for production audit trails.
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True




class Category(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    name = models.CharField(_("Category Name"), max_length=255, unique=True, db_index=True)
    related_categories = models.ManyToManyField(
        'self', 
        blank=True, 
        symmetrical=True,
        help_text=_("Categories commonly associated or recommended with this one.")
    )

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['name']

    def __str__(self):
        return self.name





class Brand(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    name = models.CharField(_("Brand Name"), max_length=255, db_index=True)
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
    name = models.CharField(max_length=100, unique=True, db_index=True)
    hex_code = models.CharField(max_length=7, blank=True, null=True, help_text="#FFFFFF")
    class Meta:
        ordering = ['name']
    def __str__(self):
        return self.name




class Size(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)
    class Meta:
        ordering = ['name']
    def __str__(self):
        return self.name



class Shape(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    class Meta:
        ordering = ['name']
    def __str__(self):
        return self.name




class Tag(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name





class Product(TimeStampedModel):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    sku = models.CharField(_("SKU"), max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
   
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
    
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1.00)])
    inventory_count = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    # Many-to-Many attributes for product variations
    colors = models.ManyToManyField(Color, blank=True, related_name='products')
    sizes = models.ManyToManyField(Size, blank=True, related_name='products')
    shapes = models.ManyToManyField(Shape, blank=True, related_name='products')
    tags = models.ManyToManyField(Tag, blank=True, related_name='products')

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sku} - {self.title}"