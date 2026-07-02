import uuid
from django.db import models
from ..taxonomies.models  import Country, Currency



class Marketplace(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    title = models.CharField(max_length=100, unique=True, db_index=True)
    sku = models.CharField(max_length=100, unique=True)
    base_url = models.URLField(unique=True)
    base_search_url = models.URLField()
    categorised_search_url = models.URLField(blank=True, null=True)
    
    # Relationships
    region_boundary = models.ManyToManyField(Country, blank=True)
    currency = models.ManyToManyField(Currency, blank=True )
    
    # Integration Details
    index_output = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.URLField(null=True, blank=True)
    
    # Status Flags
    is_active = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    is_running = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.sku})"