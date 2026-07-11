


# IMPORTS:: ===============================================================================
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
    vendorCode = models.CharField(max_length=200, null=True, blank=True)
    vendorOwner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='merchant_profile', db_column='vendor_owner_id')
    
    # 
    shopName = models.CharField(max_length=255, db_index=True)
    shopDescription = models.TextField(null=True, blank=True)
    accountEmail = models.EmailField(help_text="Administrative business email for financial and billing workflows.")
    accountPhone = models.CharField(max_length=20, null=True, blank=True, help_text="Customer-facing support number")

    
    #
    shopLogoPlaceHolder = models.URLField(default="", null=True, blank=True)
    shopBannerPlaceHolder = models.URLField(default="" , null=True, blank=True)
    
    shopLogo = models.ImageField(upload_to="Merchants/ShopLogos/", null=True, blank=True)
    shopBanner = models.ImageField(upload_to="Merchants/ShopBanners/", null=True, blank=True)
    
    is_accepting_orders = models.BooleanField(default=True, help_text="Store vacation mode or temporary pause")
    shopCategory = models.CharField(max_length=200,null=True, blank=True)
    shopCategoryPersist = models.CharField(max_length=100, null=True, blank=True)


    #
    bussinessRegisted = models.BooleanField(default=False)
    taxPin = models.CharField(max_length=50, null=True, blank=True, help_text="e.g., KRA PIN for tax compliance")
    businessRegistrationNumber = models.CharField(max_length=100, null=True, blank=True)
    legalDocument = models.FileField (upload_to="Merchants/BusinessVerificationDocuments/", null=True, blank=True)
    

    #
    commissionCutPercent = models.DecimalField(max_digits=5, decimal_places=3, default=3.505,validators=[MinValueValidator(0.00), MaxValueValidator(100.00)])
    totalActiveListings = models.PositiveIntegerField(default=0)
    isCommissionFree = models.BooleanField(default=False)
    

    #
    verificationStatus = models.CharField( max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending_review', db_index=True)
    verified  = models.BooleanField(default=False)
    payoutMethod = models.CharField(max_length=25, choices=PAYOUT_METHOD_CHOICES, default='M-Pesa')
    
    
    # PAYOUT ROUTES :: 
   
    # Bank    
    bankAccountNumber = models.CharField(max_length= 200, null=True , blank=True)
    bankName = models.CharField(max_length=200, null=True, blank=True)
    
    # paybill 
    payBillNumber = models.CharField(max_length=200, null=True, blank=True)
    accountNumber = models.CharField(max_length=200, null=True, blank=True)
    
    # sendmoney 
    sendMoneyPhone = models.CharField(max_length = 13, null=True, blank=True, help_text="Bussiness Phone number for financial ")


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












# BIZ BRANCHES

class MerchantStoreBranch(models.Model):
    """
    Handles physical or regional distribution hubs for a merchant.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,primary_key=True,  db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='branches')
    branchCode = models.CharField(max_length=200, null=True, blank=True)
    branchId = models.UUIDField(default= uuid.uuid4)
    
    # verifications By Admins 
    branchVerified = models.BooleanField(default=False)
    branchInspected = models.BooleanField(default=False)
    branchBlocked = models.BooleanField(default=False)
    
    
    # identity
    branchName = models.CharField(max_length=150)
    branchDescription = models.TextField(null=True)
    branchCategory = models.CharField(max_length=100, null=True,blank=True)
    
    # Contacts
    branchPhone = models.CharField(max_length=15, null=True, blank=True)
    branchEmail = models.EmailField(null=True, blank=True)
    branchPostalCode = models.TextField(null=True)
    
    
    # Location 
    country = models.CharField(max_length=200,default="Kenya")
    county = models.CharField(max_length=100, null=True, blank=True)
    cityTown = models.CharField(max_length=100, null=True, blank=True)
    physicalAddress = models.TextField(help_text="Detailed location info, e.g., Thika Road Mall, 2nd Floor")
    buildingName = models.TextField(null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True,  validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],help_text="For last-mile delivery API routing")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True,validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)])
    
    
    
    # Logistics
    isActive = models.BooleanField(default=True)
    isPrimary = models.BooleanField(default=False, help_text="Main fulfillment center for default routing")
    isOnline = models.BooleanField(default=True)
    isStocked = models.BooleanField(default=True)
    isAcceptingOrders = models.BooleanField(default=True)
    
    opens = models.TimeField( null=True , blank=True)
    closes = models.TimeField (null=True, blank=True)
    operatingHours = models.CharField(max_length=100, null=True, blank=True, help_text="e.g., 'Mon-Sat: 8AM-6PM'")
    
    # management 
    managerName = models.CharField(max_length=200, null=True,blank=True)
    managerPhone = models.CharField(max_length=15 , null=True,blank=True)
    managerEmail = models.EmailField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'soko_merchant_branch'
        verbose_name_plural = "Merchant Store Branches"

    def __str__(self):
        return f"{self.merchant.shopName} - {self.branchName}"

    def save(self, *args, **kwargs):
        if self.isPrimary:
            MerchantStoreBranch.objects.filter(merchant=self.merchant, isPrimary=True).exclude(pk=self.pk).update(isPrimary=False)
        super().save(*args, **kwargs)






class BranchSpecificInventory(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, db_index=True)
    parrentBranch = models.ForeignKey(MerchantStoreBranch , on_delete=models.PROTECT, related_name="branch_inventory")
    inventoryID = models.UUIDField(default=uuid.uuid4)
    inventoryTitle = models.CharField(max_length=200, null=True, blank=True)
    inventoryDescription = models.TextField()
    inventoryLocked = models.BooleanField(default=False)
    totalProducts = models.PositiveIntegerField(default=0)
    totalInventoryValue = models.PositiveIntegerField(default=0)
    lowStockItems = models.PositiveIntegerField(default=0)
    outOfStockItems = models.PositiveIntegerField(default=0)
    
    
    @property
    def total_products_in_inventory(self):
        pass


    def __str_(self):
        return ("Hello world ")






class MerchantProductCatalogSupplier (models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True,  primary_key=True, db_index=True)
    name = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=200, null=True)
    
    description  = models.TextField()

    def __str__(self):
        return self.name 
    




# 2 PRODUCT CATALOG & QUANTITATIVE INVENTORY
class MerchantProductCatalog(models.Model):
    """
    The base merchant-owned inventory catalog.
    """
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, unique=True, db_index=True)
    productDef = models.CharField (max_length=200, null=True,blank=True)
    productCode = models.CharField(max_length=200, null=True, blank=True)
    parrentInventory = models.ForeignKey(BranchSpecificInventory, on_delete=models.PROTECT, related_name="product_in_inventory")
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name="products", null=True)

    productsSuplier = models.ForeignKey(MerchantProductCatalogSupplier, on_delete=models.CASCADE, null=True, related_name="suplier")
    
    
    # 
    title = models.CharField(max_length=255, db_index=True)
    sku = models.CharField(max_length=100, blank=True, null=True, help_text="Merchant's Stock Keeping Unit identifier")
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=200, null=True , blank=True)
    brand =  models.CharField(max_length=200, null=True , blank=True)
    color =  models.CharField(max_length=200, null=True , blank=True)
    size =  models.CharField(max_length=200, null=True , blank=True)
    shape =  models.CharField(max_length=200, null=True , blank=True)
    length = models.FloatField(null=True, blank=True)
    width = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    volume = models.FloatField(null=True, blank=True)
    weightKg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Crucial for calculating shipping rates")
    isPhysical = models.BooleanField(default=True, help_text="False for digital downloads/services")
    
    # validity
    isNew =  models.BooleanField(default=True)
    isUsable = models.BooleanField(default=True)
    
    isRefurbished =  models.BooleanField(default=False)
    isSecondHand =  models.BooleanField(default=False)
    isDamaged =  models.BooleanField(default=False)
    
    
    # made in 
    manufacturer = models.CharField(max_length=300, null=True, blank=True)
    madeIn = models.CharField(max_length=200, null=True, blank=True)
    locallyMade = models.BooleanField(default=False)
    

    #
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True, help_text="URL friendly title")
    searchTerms = models.JSONField(default=list,  blank=True,null=True )
    tags = models.JSONField(default=list,  blank=True,null=True )


    #
    originalPrice = models.DecimalField(max_digits=10, decimal_places=2,  validators=[MinValueValidator(0.00)])
    recentPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, validators=[MinValueValidator(0.00)])
    dealPrice = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)], help_text="Active selling price")
    priceChangeRecords = models.JSONField(default=list , null=True,blank=True, help_text="record of all prices this product has had" )
    priceCompetitionRecords = models.JSONField(default=list, null=True, blank=True, help_text="position in pricing and the defference from the most selling merchant")
    isTaxExempt = models.BooleanField(default=False)
 
    
    
    

    # Visuals
    placeHolderimageUrl = models.URLField(max_length=300, default="", null=True,blank=True)
    primaryImage = models.ImageField(upload_to="Catalog/PrimaryImages/" , null=True)
    
    # secondary
    seconaryImage_one = models.ImageField(upload_to="Catalog/SeconaryImages/" , null=True)
    seconaryImage_two = models.ImageField(upload_to="Catalog/SeconaryImages/" , null=True)
    seconaryImage_three = models.ImageField(upload_to="Catalog/SeconaryImages/" , null=True)
    seconaryImage_four = models.ImageField(upload_to="Catalog/SeconaryImages/" , null=True)
        
    # metrics 
    isAvailable = models.BooleanField(default=True, db_index=True)
    clickCount = models.PositiveIntegerField(default=0, help_text="Tracks user engagement")
    minimumStockThreshold = models.BigIntegerField(default=4)
    stockQuantity = models.BigIntegerField(default=0)
    reservedQuantity = models.IntegerField(default=0) 
    shelfLocationSnapshot = models.TextField(null=True, blank=True)
    
    # Timestamps 
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
        return f"{self.title} ({self.parrentInventory.parrentBranch.merchant.vendorOwner.first_name}'s  Inventory Item)"

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
    orderID  = models.CharField(max_length=100, unique=True, null=True, help_text="Global order reference ID for cross-merchant tracking")
    orderCode = models.CharField(max_length=200, unique=True, null=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.PROTECT, related_name='incoming_orders')
    fulfillmentBranch = models.ForeignKey(MerchantStoreBranch, on_delete=models.PROTECT, related_name='branch_fulfillment_orders', help_text="The specific storefront or regional distribution hub fulfilling this order.")

    # Fulfillment Tracking
    status = models.CharField(max_length=30, choices=FULFILLMENT_STATUS_CHOICES, default='AWAITING_ALLOCATION', db_index=True)
    waybillType = models.CharField(max_length=300, null=True, blank=True)
    waybillNumber = models.CharField(max_length=100, null=True, blank=True, db_index=True, help_text="Tracking code for the logistics dispatch runner (e.g., Sendy, Fargo, Boda rider).")
    waybillPhone = models.CharField(max_length=100, null=True, blank=True) #transpoter phone
    waybillEmail = models.CharField(max_length=100, null=True, blank=True) #trnspoter  email
    waybillName = models.CharField(max_length=100, null=True, blank=True) #trnspoter  Name
    
    
    
    
    # Priorities
    isUrgent = models.BooleanField(default=False, help_text="Bypass standard batch queues (e.g., fresh foods, medical essentials)")
    isDue  = models.BooleanField(default=False, help_text="Due")
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
    shippingPhone = models.CharField(max_length=20 , null=True, blank=True)
    shippingCounty = models.CharField(max_length=100 , null=True, blank=True)
    shippingTown = models.CharField(max_length=100 , null=True, blank=True)
    shippingCity = models.CharField(max_length=100 , null=True, blank=True)
    shippingStreet = models.TextField(null=True)
    shippingBuildingName = models.TextField(null=True)
    nearestIdentifier = models.TextField(null=True)
    shippingPhysicalAddress = models.TextField(help_text="Detailed drop-off coordinates or building/estate details.")

    # Auditing Dates
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
    

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
    merchantOrder = models.ForeignKey(MerchantOrder, on_delete=models.PROTECT, related_name='manifest_items', db_column='merchant_order_item')
    product = models.ForeignKey(MerchantProductCatalog, on_delete=models.PROTECT, related_name='historical_merchant_sales')
    
    # Frozen Product Manifest Information
    productTitle = models.CharField(max_length=255)
    productSku = models.CharField(max_length=100, blank=True, null=True, help_text="Vendor inventory SKU for picker verification")
    productDescription = models.TextField(null=True)
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
 
 
 
class MerchnatsNotifications (models.Model):
    unique_id = models.UUIDField  (default = uuid.uuid4 , primary_key =True, unique=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='merchant_notifications', null=True)

    message = models.TextField()
    resolved = models.BooleanField(default=True)
    urlPath = models.URLField(null=True)
    
    def __str__(self):
        return  f"{self.message} :: {self.urlPath} . "
        
    
    
    
class MerchantReviews(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True, db_index=True)
    merchant = models.ForeignKey(InternalMerchantProfile, on_delete=models.CASCADE, related_name='merchant_reviews')
    reviewer_name = models.CharField(max_length=255)
    reviewer_email = models.EmailField()
    reviewer_phone = models.CharField(max_length=20, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    

    class Meta:
        db_table = 'soko_merchant_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review for {self.merchant.shopName} by {self.reviewer_name} | Rating: {self.rating}"
        
        
        
        
        
        
        
        
        
        
        
        
        
        
