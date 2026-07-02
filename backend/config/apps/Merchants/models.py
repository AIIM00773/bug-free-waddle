

import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from ..taxonomies.models import Category, Brand , Color, Size, Shape,Tag,MerchantShopCategory
from django.core.exceptions import PermissionDenied



# 1 MERCHANT PROFILE & LOGISTICS NODES

class InternalMerchantProfile(models.Model):
    """
    Stores storefront parameters, payout configs, and transaction cut allocations.
    Links directly to the base authentication User model via a OneToOne relationship.
    """
    
    
    VERIFICATION_STATUS_CHOICES = (
        ('verified', 'Verified Active'),
        ('pending_review', 'Pending Review'),
        ('suspended', 'Suspended Hold'),
    )

    PAYOUT_METHOD_CHOICES = (
        ('M-Pesa', 'M-Pesa'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Card Settlement', 'Card Settlement'),
    )

    # IDENTITY & RELATIONSHIPS
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True,  db_index=True)
    vendorOwner = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='merchant_profile', db_column='vendor_owner_id'
    )
    
    # 
    shopName = models.CharField(max_length=255, db_index=True)
    shopDescription = models.TextField(null=True, blank=True)
    accountEmail = models.EmailField(help_text="Administrative business email for financial and billing workflows.")
    
    
    #
    shop_logo_url = models.URLField(max_length=500, null=True, blank=True)
    shop_banner_url = models.URLField(max_length=500, null=True, blank=True)
    is_accepting_orders = models.BooleanField(default=True, help_text="Store vacation mode or temporary pause")
    shopCategory = models.ManyToManyField(MerchantShopCategory)
    shopCategoryPersist = models.CharField(max_length=100, null=True, blank=True)


    #
    bussinessRegisted = models.BooleanField(default=False)
    taxPin = models.CharField(max_length=50, null=True, blank=True, help_text="e.g., KRA PIN for tax compliance")
    businessRegistrationNumber = models.CharField(max_length=100, null=True, blank=True)
    support_phone = models.CharField(max_length=20, null=True, blank=True, help_text="Customer-facing support number")
    legalDocument = models.FileField (upload_to="merchant_legal_media/", null=True, blank=True)

    #
    commissionCutPercent = models.DecimalField(max_digits=5, decimal_places=3, default=3.505,validators=[MinValueValidator(0.00), MaxValueValidator(100.00)])
    totalActiveListings = models.PositiveIntegerField(default=0)
    isCommissionFree = models.BooleanField(default=False)
    

    #
    verificationStatus = models.CharField( max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending_review', db_index=True)
    verified  = models.BooleanField(default=False)
    payoutMethod = models.CharField(max_length=25, choices=PAYOUT_METHOD_CHOICES, default='M-Pesa')
   
    # Bank Transfer payour     
    bankAccountNumber = models.CharField(max_length= 200, null=True , blank=True)
    bankName = models.CharField(max_length=200, null=True, blank=True)
    
    # paybill payout 
    payBillNumber = models.CharField(max_length=200, null=True, blank=True)
    accountNumber = models.CharField(max_length=200, null=True, blank=True)
    
    # sendmoney - mpesa payout
    accountPhone = models.CharField(max_length = 13, help_text="Bussiness Phone number for financial ")


    # METADATA TIMESTAMPS
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'soko_internal_merchant_profile'
        ordering = ['-createdAt']
        verbose_name = 'Internal Merchant Profile'
        verbose_name_plural = 'Internal Merchant Profiles'

    def __str__(self):
        return f"{self.shopName} | {self.accountEmail}"

    def clean(self):
        super().clean()
        if self.taxPin:
            self.taxPin = self.taxPin.strip().upper()
            if len(self.taxPin) != 11:
                raise ValidationError({'tax_pin': _("A valid KRA PIN must be exactly 11 characters long.")})





class MerchantStoreBranch(models.Model):
    """
    Handles physical or regional distribution hubs for a merchant.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,primary_key=True,  db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='branches')
    
    branchName = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    
    # Location routing
    county = models.CharField(max_length=100, default="Kiambu")
    cityTown = models.CharField(max_length=100, default="Juja")
    physicalAddress = models.TextField(help_text="Detailed location info, e.g., Thika Road Mall, 2nd Floor")
    
    # Geolocation & Logistics
    isPrimary = models.BooleanField(default=False, help_text="Main fulfillment center for default routing")
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True, 
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],
        help_text="For last-mile delivery API routing"
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)]
    )
    
    opens = models.TimeField( null=True , blank=True)
    closes = models.TimeField (null=True, blank=True)
    operatingHours = models.CharField(max_length=100, null=True, blank=True, help_text="e.g., 'Mon-Sat: 8AM-6PM'")
    
    isActive = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'soko_merchant_branch'
        verbose_name_plural = "Merchant Store Branches"

    def __str__(self):
        return f"{self.merchant.shopName} - {self.branchName}"

    def save(self, *args, **kwargs):
        if self.isPrimary:
            MerchantStoreBranch.objects.filter(merchant=self.merchant, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)






# 2 PRODUCT CATALOG & QUANTITATIVE INVENTORY

class MerchantProductCatalog(models.Model):
    """
    The base merchant-owned inventory catalog.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, unique=True, db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='products')
    
    # 
    title = models.CharField(max_length=255, db_index=True)
    sku = models.CharField(max_length=100, blank=True, null=True, help_text="Merchant's Stock Keeping Unit identifier")
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, null=True , blank=True , on_delete=models.PROTECT)
    brand =  models.ForeignKey(Brand, null=True , blank=True, on_delete=models.PROTECT)
    categoryPersist = models.CharField(max_length=100, null=True, blank=True)
    
    color =  models.ForeignKey(Color, null=True , blank=True,  on_delete=models.PROTECT)
    size =  models.ForeignKey(Size, null=True , blank=True,  on_delete=models.PROTECT)
    shape =  models.ForeignKey(Shape, null=True , blank=True,  on_delete=models.PROTECT)
    isRefubished =  models.BooleanField(default=False)
    isNew =  models.BooleanField(default=True)
  
    
    #
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True, help_text="URL friendly title")
    searchTags = models.ManyToManyField(Tag,  blank=True )
    userAddedsearchTags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma separated keywords")

    
    #
    originalPrice = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    dealPrice = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)], help_text="Active selling price")
    priceChangeRecord = models.JSONField(default=list , null=True,blank=True, help_text="record of all prices this product has had" )
    priceComPetitonRecord = models.JSONField(default=list, null=True, blank=True, help_text="position in pricing and the defference from the most selling merchant")
    
    
    
    
    #
    weightKg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Crucial for calculating shipping rates")
    isPhysical = models.BooleanField(default=True, help_text="False for digital downloads/services")
    isTaxExempt = models.BooleanField(default=False)
    
    # Visual and Dynamic States
    primaryIimageUrl = models.URLField(max_length=500)
    secondaryImages = models.JSONField(default=list, blank=True, help_text="Array of supplemental image strings")
    
    isAvailable = models.BooleanField(default=True, db_index=True)
    clickCount = models.PositiveIntegerField(default=0, help_text="Tracks user engagement")
    minimumStockThreshhold = models.BigIntegerField(default=4)
    stockQuantity = models.BigIntegerField(default=0)
    stockAuantity = models.BigIntegerField(default=0)

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    @property
    def discount_percentage(self):
        if self.originalPrice > self.dealPrice:
            discount = ((self.originalPrice - self.dealPrice) / self.originalPrice) * 100
            return round(discount, 1)
        return 0.0


    class Meta:
        db_table = 'soko_merchant_product_catalog'
        ordering = ['-createdAt']

    def __str__(self):
        return f"{self.title} ({self.merchant.shopName})"

    def clean(self):
        super().clean()
        if self.dealPrice > self.originalPrice:
            raise ValidationError({
                'dealPrice': _("The active active selling price (deal price) cannot be higher than the original retail price.")
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.slug or slugify(self.title) not in self.slug:
            base_slug = slugify(self.title)
            self.slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
        
        if self.userAddedsearchTags:
            self.userAddedsearchTags = ",".join([tag.strip().lower() for tag in self.userAddedsearchTags.split(",") if tag.strip()])
            
        super().save(*args, **kwargs)




class MerchantInventoryStock(models.Model):
    """
    Tracks inventory availability on a per-branch basis.
    """
    product = models.ForeignKey(MerchantProductCatalog, on_delete=models.CASCADE, related_name='stock_allocations')
    branch = models.ForeignKey(MerchantStoreBranch, on_delete=models.CASCADE, related_name='stocks')
    
    quantityInStock = models.PositiveIntegerField(default=0)
    lowStockThreshold = models.PositiveIntegerField(default=5)
    
    # 
    reservedQuantity = models.PositiveIntegerField(default=0, help_text="Stock currently locked in active orders but not yet shipped")
    shelfLocation = models.CharField(max_length=50, null=True, blank=True, help_text="Warehouse bin/shelf identifier (e.g., Aisle 4, Bin B)")
    lastRestocked = models.DateTimeField(auto_now=True)

    @property
    def availableToSell(self):
        """The TRUE stock available to new customers."""
        return max(0, self.quantityInStock - self.reservedQuantity)

    class Meta:
        db_table = 'soko_merchant_inventory_stock'
        unique_together = ('product', 'branch')

    def __str__(self):
        return f"{self.product.title} at {self.branch.branchName}: {self.availableToSell} available"

    def clean(self):
        super().clean()
        if self.reservedQuantity > self.quantityInStock:
            raise ValidationError({
                'reserved_quantity': _("Reserved stock allocation cannot exceed physical warehouse stock.")
            })





# 3 TRANSACTIONS, COURIERS, & FULFILLMENT EXECUTION

class MerchantOrder(models.Model):
    """
    The core transaction document for a specific vendor.
    Contains ONLY data relevant to this merchant's operations, fulfillment, and payouts.
    """
    FULFILLMENT_STATUS_CHOICES = (
        ('AWAITING_ALLOCATION', 'Awaiting System Processing'),
        ('PREPARING', 'Picking & Packing Items'),
        ('READY_FOR_PICKUP', 'Package Ready at Branch Hub'),
        ('DISPATCHED', 'Handed over to Carrier/Rider'),
        ('DELIVERED', 'Successfully Delivered to Customer'),
        ('CANCELLED', 'Order Cancelled'),
        ('DISPUTED', 'Disputed / Hold on Payout'),
        ('REFUNDED', 'Returned & Refunded'),
    )

    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,  primary_key=True, db_index=True)
    order_id  = models.CharField(max_length=100, unique=True, help_text="Global order reference ID for cross-merchant tracking")
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.PROTECT, related_name='incoming_orders')
    fulfillmentBranch = models.ForeignKey(MerchantStoreBranch, on_delete=models.PROTECT, related_name='branch_fulfillment_orders', help_text="The specific storefront or regional distribution hub fulfilling this order.")

    # Fulfillment Tracking
    status = models.CharField(max_length=30, choices=FULFILLMENT_STATUS_CHOICES, default='AWAITING_ALLOCATION', db_index=True)
    waybillNumber = models.CharField(max_length=100, null=True, blank=True, db_index=True, help_text="Tracking code for the logistics dispatch runner (e.g., Sendy, Fargo, Boda rider).")
    
    # Internal Operational Priorities
    isUrgent = models.BooleanField(default=False, help_text="Bypass standard batch queues (e.g., fresh foods, medical essentials)")
    requiresColdChain = models.BooleanField(default=False, help_text="Requires refrigerated dispatch routing")

    # Pure Merchant Financial Snapshots
    currency = models.CharField(max_length=100, default="KES")
    grossSalesAmount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Total revenue generated from items sold")
    shippingAllocation = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Shipping fee portion paid out to the vendor if self-fulfilled")
    taxAllocation = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Vatable amount collected for this merchant branch")
    
    # Platform Take-Rate Cut Calculations (Frozen at point of sale)
    commissionPercentageApplied = models.DecimalField(max_digits=5, decimal_places=3, help_text="Snapshot of the platform take rate applied.")
    platformFeeDeducted = models.DecimalField(max_digits=12, decimal_places=2, help_text="Platform commission fee deducted from gross sales.")
    netVendorPayout = models.DecimalField(max_digits=12, decimal_places=2, db_index=True, help_text="The final net earnings added to the merchant's withdrawable ledger balance.")
    
    # Customer Details Isolated for Delivery
    shippingCustomerName = models.CharField(max_length=255, help_text="Name printed on the packing slip")
    shippingPhone = models.CharField(max_length=20)
    shippingCounty = models.CharField(max_length=100)
    shippingTown = models.CharField(max_length=100)
    shippingPhysicalAddress = models.TextField(help_text="Detailed drop-off coordinates or building/estate details.")

    # Auditing Dates
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    

    class Meta:
        db_table = 'soko_merchant_order'
        ordering = ['-createdAt']
        verbose_name = 'Merchant Order Execution'
        verbose_name_plural = 'Merchant Order Executions'

    def __str__(self):
        return f"Order {self.unique_id} | Store: {self.merchant.shopName} | Payout: {self.netVendorPayout} {self.currency}"

    def clean(self):
        super().clean()
        if self.status == 'DISPATCHED' and not self.waybillNumber:
            raise ValidationError({'waybill_number': _("A waybill tracking reference number must be supplied before assigning an order to dispatched status.")})




class MerchantOrderItem(models.Model):
    """
    An immutable line-item snapshot specifying the exact products the merchant's 
    warehouse staff need to fulfill from their inventory stock.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True,  db_index=True)
    merchantOrder = models.ForeignKey(MerchantOrder, on_delete=models.PROTECT, related_name='manifest_items', db_column='merchant_order_id')
    product = models.ForeignKey(MerchantProductCatalog, on_delete=models.PROTECT, related_name='historical_merchant_sales')
    
    # Frozen Product Manifest Information
    productTitle = models.CharField(max_length=255)
    productSku = models.CharField(max_length=100, blank=True, null=True, help_text="Vendor inventory SKU for picker verification")
    shelfLocationSnapshot = models.CharField(max_length=50, null=True, blank=True, help_text="Where the picker can locate the item inside the branch hub")
    
    # Pricing Metrics
    unitPriceAtSale = models.DecimalField(max_digits=10, decimal_places=2)
    quantityOrdered = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        db_table = 'soko_merchant_order_item'
        verbose_name = 'Merchant Order Manifest Item'
        verbose_name_plural = 'Merchant Order Manifest Items'

    def __str__(self):
        return f"{self.quantityOrdered}x {self.productTitle} (SKU: {self.productSku})"



# ================================================================================================================
# 4. BALANCES & DISBURSEMENT AUDIT TRAILS
# ================================================================================================================

class MpesaSendMoneyMerchnatPayoutDestination(models.Model):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    merchnat = models.OneToOneField(InternalMerchantProfile, on_delete=models.CASCADE, related_name="merchant_mpesa_payout_route")
    title = models.CharField(max_length=200, default="M-Pesa Send Money")
    phoneNumber = models.CharField(max_length=15, null=True)
    isActive = models.BooleanField(default=True)
    
    def __str__(self):
        return ("payout Route")
    
    
class MpesaPaybillMerchnatPayoutDestination(models.Model):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    merchnat = models.OneToOneField(InternalMerchantProfile, on_delete=models.CASCADE, related_name="merchant_mpesa_paybill_payout_route")
    title = models.CharField(max_length=200, default="M-pesa Paybill")
    paybillNumber = models.CharField(max_length=15, null=True)
    accountNumber = models.CharField(max_length=15, null=True)
    
    isActive = models.BooleanField(default=True)
    
    def __str__(self):
        return (" payout Route")
    
    
    
class MpesaTillMerchnatPayoutDestination(models.Model):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    merchnat = models.OneToOneField(InternalMerchantProfile, on_delete=models.CASCADE, related_name="merchant_mpesa_till_payout_route")
    title = models.CharField(max_length=200, default="M-Pesa Till ")
    tillNumber = models.CharField(max_length=15, null=True)
    isActive = models.BooleanField(default=True)
    
    def __str__(self):
        return (" payout Route")
    
    
    
class BankTransfarMerchnatPayoutDestination(models.Model):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    merchnat = models.OneToOneField(InternalMerchantProfile, on_delete=models.CASCADE, related_name="merchant_bank_transfar_payout_route")
    title = models.CharField(max_length=200, default="Bank Transfar")
    accountNumber= models.CharField(max_length=15, null=True)
    isActive = models.BooleanField(default=True)
    
    def __str__(self):
        return (" payout Route")
    
    

class MerchantPayoutLedger(models.Model):
    """
    Traces payout balances due to merchants after applying platform take rates.
    """
    PAYOUT_STATUS = (
        ('pending', 'Pending Processing'),
        ('processing', 'Processing Processing'),
        ('completed', 'Completed Settled'),
        ('failed', 'Failed Reverted'),
    )
    

    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.PROTECT, related_name='payout_history')
    
    # Order Traceability
    linked_order_id = models.UUIDField(null=True, blank=True, help_text="UUID of the SubOrder that generated this payout")
    currency = models.CharField(max_length=10, default="KES")

    # Financial Matrix tracking
    gross_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Total revenue generated before cut")
    platform_cut_applied = models.DecimalField(max_digits=5, decimal_places=2, help_text="The snapshot commissionCutPercent applied")
    net_payout_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Amount sent to merchant after take rate deduction")
    
    payout_channel = models.CharField(max_length=30, default="M-Pesa")
    payout_destination = models.CharField(max_length=100, help_text="Paybill/Till Number, Phone Number, or Account Number")
    
    status = models.CharField(max_length=20, choices=PAYOUT_STATUS, default='pending', db_index=True)
    transaction_reference = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="External gateway transaction ID")
    
    # Auditing
    admin_notes = models.TextField(null=True, blank=True, help_text="Internal notes for failed/disputed payouts")

    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'soko_merchant_payout_ledger'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payout {self.unique_id} - {self.merchant.shopName} ({self.status})"

    def clean(self):
        super().clean()
        if self.status == 'failed' and not self.admin_notes:
            raise ValidationError({'admin_notes': _("You must document administrative notes stating why this payout record flagged a failed status.")})
        
        
        
        
#Daily gross sales snapshot for each merchant, used for analytics and reporting 
class GrossSalesSnapshot(models.Model):
    """
    A daily snapshot of gross sales for each merchant, used for analytics and reporting.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True, db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.PROTECT, related_name='daily_sales_snapshots')
    
    date = models.DateField(db_index=True)
    gross_sales_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Total revenue generated before any deductions")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'soko_merchant_gross_sales_snapshot'
        ordering = ['-date']
        unique_together = ('merchant', 'date')

    def __str__(self):
        return f"Gross Sales Snapshot for {self.merchant.shopName} on {self.date}: {self.gross_sales_amount}"
    
    

# ====================================================================================================================================
class MerchantActivityLog(models.Model):
    """
    An immutable audit log tracking all operational, authentication, and financial 
    actions taken by or triggered for a merchant profile.
    """
    CATEGORY_CHOICES = (
        ('auth', 'Authentication & Security'),
        ('profile', 'Profile & Settings Modification'),
        ('branch', 'Branch Distribution Operations'),
        ('catalog', 'Inventory & Catalog Updates'),
        ('order', 'Order & Fulfillment Triggers'),
        ('payout', 'Financials & Ledger Settlements'),
        ('system', 'System Automation / Background Alert'),
    )

    SEVERITY_CHOICES = (
        ('info', 'Informational'),
        ('warning', 'Warning Notice'),
        ('critical', 'Critical Security/Financial'),
    )

    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    merchant = models.ForeignKey(
        'InternalMerchantProfile', 
        on_delete=models.CASCADE, 
        related_name='activity_logs',
        help_text="The merchant profile tied to this record."
    )
    # Track the actual user initiating the action (could be an admin, the merchant owner, or system-automated)
    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='merchant_initiated_actions'
    )

    # Classification parameters
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, db_index=True)
    severity = models.CharField(max_length=15, choices=SEVERITY_CHOICES, default='info', db_index=True)
    action_event = models.CharField(
        max_length=255, 
        help_text="e.g., 'user_login', 'order_received_alert', 'order_rejected', 'branch_created'"
    )
    description = models.TextField(help_text="Human-readable detail statement summarizing exactly what transpired.")

    # Contextual Metadata & Security tracing
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    user_agent = models.CharField(max_length=500, null=True, blank=True, help_text="Browser/device fingerprint data")
    
    # Location tracking parsed at point of connection (crucial for logistics auditing)
    location_snapshot = models.CharField(
        max_length=255, 
        null=True, 
        blank=True, 
        help_text="Approximate or pinpoint geo-metadata at the moment of entry, e.g., 'Juja, Kiambu'"
    )

    # Optional references for quick trace matching
    linked_order_uuid = models.UUIDField(null=True, blank=True, db_index=True, help_text="Reference to the related MerchantOrder if applicable")
    linked_product_uuid = models.UUIDField(null=True, blank=True, db_index=True, help_text="Reference to the related MerchantProductCatalog if applicable")

    # Time recording
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, editable=False)

    class Meta:
        db_table = 'soko_merchant_activity_log'
        ordering = ['-created_at']
        verbose_name = 'Merchant Activity Log'
        verbose_name_plural = 'Merchant Activity Logs'
        # Database-level indexes to keep searches lightning fast as millions of entries build up
        indexes = [
            models.Index(fields=['merchant', 'category']),
            models.Index(fields=['merchant', 'created_at']),
        ]

    def __str__(self):
        return f"{self.merchant.shopName} | {self.action_event} | {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

    def save(self, *args, **kwargs):
        # Enforce complete Immutability: If the record already exists in the database, reject any update modifications.
        if self.pk:
            raise PermissionDenied(_("Merchant log records are strictly immutable and cannot be updated once stored."))
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Prevent manual or programmatic deletion of logs to protect the system's audit integrity.
        raise PermissionDenied(_("Merchant log records are permanent and cannot be deleted from this platform."))
        
        
        
class MerchantAlerts (models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True, db_index=True)
    Type = models.CharField(max_length=100, choices=[('system', 'System Alert'), ('order', 'Order Alert'), ('inventory', 'Inventory Alert'), ('payout', 'Payout Alert'), ('profile', 'Profile Alert')], null=True, blank=True)
    Message = models.TextField(null=True, blank=True)
    Priority = models.CharField(max_length=50, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], null=True, blank=True)
    Merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='merchant_alerts')
    Read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Alert for {self.Merchant.shopName} | Type: {self.Type} | Priority: {self.Priority} | Read: {self.Read}"
    
    
    
    
class MerchantReviews(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True, db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=255)
    reviewer_email = models.EmailField()
    reviewer_phone = models.CharField(max_length=20, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'soko_merchant_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review for {self.merchant.shopName} by {self.reviewer_name} | Rating: {self.rating}"
        
        
        
        
        
        
        
        
        
        
        
        
        
        