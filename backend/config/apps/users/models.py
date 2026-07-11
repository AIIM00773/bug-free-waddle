import uuid
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
# from apps.Merchants.models  import InternalMerchantProfile , MerchantProductCatalog
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.utils.translation import gettext_lazy as _




class User(AbstractUser):
    # ---------------------------------------------------------
    # CORE IDENTITY
    # ---------------------------------------------------------
    
    unique_id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        unique=True,
        editable=False,
        db_index=True
    )
    
    email = models.EmailField(
        unique=True,
        db_index=True
    )
    
    phone = models.CharField(
        max_length=15,
        null=True,
        blank=True
    )

    # ---------------------------------------------------------
    # LOCATION / METRICS
    # ---------------------------------------------------------
    continent = models.CharField(
        max_length=100,
        blank=True,
        null=True        
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
    # ACCOUNT TYPE / STATUS ROLES
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
        default=False
    )

    # ---------------------------------------------------------
    # VERIFICATION LIFECYCLES
    # ---------------------------------------------------------
    is_email_verified = models.BooleanField(
        default=False
    )
    is_phone_verified = models.BooleanField(
        default=False
    )

    # ---------------------------------------------------------
    # ONBOARDING & PERSONALIZATION
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
    # SECURITY & COMPLIANCE BOUNDS
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
        default=False
    )
    deleted_at = models.DateTimeField(
        blank=True,
        null=True
    )
    
    mfa_required = models.BooleanField(default=False)


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

    @property
    def age(self):
        if not self.date_of_birth:
            return None
        today = date.today()
        return (
            today.year
            - self.date_of_birth.year
            - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=["deleted_at", "is_active"])

    def restore_account(self):
        self.deleted_at = None
        self.is_active = True
        self.save(update_fields=["deleted_at", "is_active"])

    def __str__(self):
        return self.email if self.email else self.username





# ========================================================================================
#Addresses
# ========================================================================================

class UserAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="addresses")
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "User Address"
        verbose_name_plural = "User Addresses"

    def __str__(self):
        return f"Address {self.unique_id} for {self.user.username}"


# ==============================================================================================
# CARTS
# ==============================================================================================

class CartGroup(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="cart_group")
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    enabled = models.BooleanField(default=True)
    protected = models.BooleanField(default=False)
    password = models.CharField(max_length=128, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @property
    def total_items(self):
        # Optimized aggregation example:
        # return sum(subcart.total_items for subcart in self.sub_carts.all())
        pass

    @property
    def total_cost_before_tax_and_shipping(self):
        pass

    @property
    def total_shipping_cost(self):
        pass

    @property
    def total_cost_after_tax_and_shipping(self):
        pass





class SubCart(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    cart_group = models.ForeignKey(CartGroup, on_delete=models.PROTECT, related_name="sub_carts")
    merchant = models.ForeignKey("Merchants.InternalMerchantProfile", on_delete=models.PROTECT, related_name="sub_carts_related_merchant")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cart_group', 'merchant')

    @property
    def total_number_of_items(self):
        pass

    @property
    def total_cost_before_tax(self):
        pass

    @property
    def total_cost_before_shipping(self):
        pass

    @property
    def total_shipping_cost(self):
        pass

    @property
    def total_cost_after_shipping_and_tax(self):
        pass






class SubCartItem(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    sub_cart = models.ForeignKey(SubCart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("Merchants.MerchantInventoryProduct", on_delete=models.PROTECT, related_name="cart_items")
    
    # Financial snapshot data - using DecimalField for precise money handling
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    product_title = models.CharField(max_length=255, null=True, blank=True)
    product_description = models.TextField(null=True, blank=True)
    
    count = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('sub_cart', 'product')

    def __str__(self):
        return f"{self.count}x {self.product_title or 'Unknown Product'}"









# ==============================================================================================
# ORDERS
# ==============================================================================================

ORDER_STATUSES = (
    ("WAITING_FOR_PAYMENT", "Waiting for Payment to process"),
    ("QUEUED", "Order Queued for Processing"),
    ("PROCESSING", "Order Being Processed"),
    ("IN_SHIPMENT", "Order in shipment"),
    ("DELAYED_IN_SHIPMENT", "Order Delaying in shipment"),
    ("DELIVERED", "Order Delivered"),
)


class UserOrderGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="order_groups")
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    status = models.CharField(max_length=30, choices=ORDER_STATUSES, default="WAITING_FOR_PAYMENT")
    order_delivered = models.BooleanField(default=False)
    order_delivery_confirmed = models.BooleanField(default=False)
    order_disputed = models.BooleanField(default=False)
    order_cancelled = models.BooleanField(default=False)
    
    tracking_id = models.UUIDField(default=uuid.uuid4, unique=True)
    delivery_address = models.ForeignKey(UserAddress, on_delete=models.PROTECT, related_name="orders")

    @property
    def total_order_items(self):
        pass

    @property
    def total_order_cost(self):
        pass

    @property
    def order_status_and_shipment_updates(self):
        pass



class UserSubOrder(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    order_group = models.ForeignKey(UserOrderGroup, on_delete=models.PROTECT, related_name="sub_orders")
    merchant = models.ForeignKey("Merchants.InternalMerchantProfile", on_delete=models.PROTECT, related_name="sub_orders_rlated_merchant")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    order_is_urgent = models.BooleanField(default=False) 
    express_delivery = models.BooleanField(default=False)

    @property
    def total_number_of_items(self):
        pass

    @property
    def total_cost_before_shipping(self):
        pass

    @property
    def total_shipping_cost(self):
        pass

    @property
    def total_cost_after_shipping_and_tax(self):
        pass





class UserSubOrderItem(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    sub_order = models.ForeignKey(UserSubOrder, on_delete=models.PROTECT, related_name="items")
    product = models.ForeignKey("Merchants.MerchantInventoryProduct", on_delete=models.PROTECT, related_name="order_items")
    
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    product_title = models.CharField(max_length=255, null=True, blank=True)
    product_description = models.TextField(null=True, blank=True)
    
    count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.count}x {self.product_title or 'Unknown Product'}"
    
    
    
    
    
    
    
# ========================================================================================================
# USER SEARCHES AND SYSTEM COMUNICATION 
# =========================================================================================================

class UserSearches(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="search_profile"
    )
    
    unique_id = models.UUIDField(
        default=uuid.uuid4, 
        unique=True, 
        editable=False
    )
    
    # STATE & CONTROLS
    eligible = models.BooleanField(
        default=True,
        help_text="Global flag determining if the user can execute search requests."
    )
    is_on_free_tier = models.BooleanField(
        default=True,
        help_text="True if on complimentary search credits; False if upgraded to premium limits."
    )
    free_tier_search_limit = models.PositiveIntegerField(
        default=20,
        help_text="The total maximum free searches granted by default."
    )
    current_tier_use = models.PositiveIntegerField(
        default=0,
        help_text="Tracks active search computations performed in the current billing cycle."
    )
    
    # TIMESTAMPS
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "User Search Profile"
        verbose_name_plural = "User Search Profiles"

    # METHODS & LOGIC
    def update_tier_use(self, increment_by=1):
        """
        Increments search utilization counters and automatically triggers an eligibility sanity recheck.
        """
        if self.eligible:
            self.current_tier_use += increment_by
            self.save(update_fields=["current_tier_use"])
            self.update_eligibility()


    def update_tier(self, upgrade_to_premium=True):
        """
        Toggles account tracking configuration between free allotments and premium unlimited statuses.
        """
        self.is_on_free_tier = not upgrade_to_premium
        if upgrade_to_premium:
            self.eligible = True
        self.save(update_fields=["is_on_free_tier", "eligible"])


    def update_eligibility(self):
        """
        Enforces quantitative system restrictions. If a free user exceeds their allowance, 
        their capability to issue additional search requests drops to False.
        """
        if self.is_on_free_tier and self.current_tier_use >= self.free_tier_search_limit:
            if self.eligible:  
                self.eligible = False
                self.save(update_fields=["eligible"])
        else:
            if not self.eligible:
                self.eligible = True
                self.save(update_fields=["eligible"])
                
                

    def reset_usage_cycle(self):
        """
        Resets metrics on a subscription renewal cycle or monthly rollover.
        """
        self.current_tier_use = 0
        self.eligible = True
        self.save(update_fields=["current_tier_use", "eligible"])
        

    def __str__(self):
        tier = "Free Tier" if self.is_on_free_tier else "Premium Tier"
        return f"{self.user.username} - {tier} ({self.current_tier_use}/{self.free_tier_search_limit if self.is_on_free_tier else '∞'})"




class UserConversation(models.Model):
    parent = models.ForeignKey(
        UserSearches, 
        on_delete=models.CASCADE, 
        related_name="conversations"
    )
    
    title = models.CharField(
        max_length=255, 
        default="New Search Loop"
    )
    
    unique_id = models.UUIDField(
        default=uuid.uuid4, 
        unique=True, 
        editable=False
    )
    
    pinned = models.BooleanField(default= False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Chat {self.id} - {self.parent.user.username} ({self.title})"
    
    
    
    


class UserConversationHistoryItem(models.Model):
    conversation = models.ForeignKey(
        UserConversation, 
        on_delete=models.CASCADE,  
        related_name="conversation_history"
    )
    
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user_query = models.JSONField()
    ai_system_response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        
    def __str__(self):
        return f"Msg {self.id} in Chat {self.conversation_id}"







# ========================================================================================================
# USER REVIEWS AND ALERTS 
# =========================================================================================================


class UserReview(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="review_profile")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.first_name if self.user.first_name else self.user.username} - Reviews Profile"


class UserReviewItem(models.Model):
    parent = models.ForeignKey(UserReview, on_delete=models.CASCADE, related_name="reviews")
    target_item = models.ForeignKey("Merchants.MerchantInventoryProduct", on_delete=models.CASCADE, related_name="product_reviews")
    
    review_text = models.TextField()
    rating = models.PositiveIntegerField(
        default=5, 
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review By {self.parent.user.username} on {self.target_item.title[:20]}..."





class UserAlert(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="alert_profile")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} Alerts System"





class UserAlertItem(models.Model):
    ALERT_TYPE_CHOICES = (
        ("price_drop", "Price Drop Watch"),
        ("stock_status", "Back In Stock"),
        ("promo_code", "Flash Promotional Code"),
        ("system", "System Notifications"),
        ("security", "Security Alerts"),
    )

    parent = models.ForeignKey(UserAlert, on_delete=models.CASCADE, related_name="alerts")
    product = models.ForeignKey("Merchants.MerchantInventoryProduct", on_delete=models.CASCADE, related_name="tracked_alerts", null=True, blank=True)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPE_CHOICES, default="price_drop")
    target_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Target budget match value in KSh")
    is_triggered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_alert_type_display()} for {self.parent.user.username}"





# ========================================================================================================
# USER PAYMENT, WALLETS AND LEDGERS 
# =========================================================================================================

class UserPaymentOption(models.Model):
    PAYMENT_TYPE_CHOICES = (
        ("mpesa", "M-Pesa Express"),
        ("bank", "Bank-Transfer"), 
        ("card", "Debit/Credit Card"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payment_options")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default="mpesa")
    is_default = models.BooleanField(default=False)
    
    # M-Pesa Data Fields
    mpesa_phone_number = models.CharField(max_length=15, blank=True, null=True, help_text="Format: 07XXXXXXXX or 254XXXXXXXX")
    
    # Bank tranfer fileds 
    bank_name = models.CharField(max_length=200, null=True , blank=True)
    bank_account_number = models.CharField(max_length=100, null=True, blank=True)
    
    
    # Card Mask Data Fields (Never store raw CVV or Full numbers!)
    card_brand = models.CharField(max_length=20, blank=True, null=True, help_text="Visa, Mastercard, etc.")
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    card_expiry_mask = models.CharField(max_length=7, blank=True, null=True, help_text="MM/YYYY")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.get_payment_type_display()} (***{self.card_last_four if self.card_last_four else self.mpesa_phone_number[-4:]}) - {self.user.username}"








# ========================================================================================================
# USER SHIPPING  ADDRESSES
# =========================================================================================================

class UserShippingAddress(models.Model):
    ADDRESS_TAG_CHOICES = (
        ("home", "Home / Residence"),
        ("office", "Office / Workplace"),
        ("pickup", "Pickup Station Hub"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shipping_addresses")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    address_tag = models.CharField(max_length=20, choices=ADDRESS_TAG_CHOICES, default="home")
    is_primary = models.BooleanField(default=False)
    
    full_name = models.CharField(max_length=255, help_text="Recipient Name")
    phone_number = models.CharField(max_length=15, help_text="Contact number for courier deliveries")
    
    building_or_estate = models.CharField(max_length=255, help_text="e.g., Greenwood Apartments, Block B / Delta Corner")
    street_or_road = models.CharField(max_length=255, help_text="e.g., Kilimanjaro Avenue / Waiyaki Way")
    area_or_estate = models.CharField(max_length=100, help_text="e.g., Kilimani / Westlands")
    city = models.CharField(max_length=100, default="Nairobi")
    country = models.CharField(max_length=100, default="Kenya")
    
    delivery_instructions = models.TextField(blank=True, null=True, help_text="e.g., Leave with reception, call upon arrival.")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Shipping Address"
        verbose_name_plural = "User Shipping Addresses"
        ordering = ["-is_primary", "-created_at"]

    def __str__(self):
        return f"{self.get_address_tag_display()} - {self.building_or_estate} ({self.user.username})"
    
    
    
    







# ========================================================================================================
# USER LOGS AND ACCOUNT ACTIONS 
# =========================================================================================================
class UserActivityLog(models.Model):
    """
    An immutable audit log tracking all operational, authentication, and financial 
    actions taken by or triggered for a user profile.
    """
    CATEGORY_CHOICES = (
        ('auth', 'Authentication & Security'),
        ('profile', 'Profile & Settings Modification'),
        ('branch', 'Branch Distribution Operations'),
        ('catalog', 'Inventory & Catalog Updates'),
        ('order', 'Order & Fulfillment Triggers'),
        ('payin', 'Financials & Ledger Settlements'),
        ('system', 'System Automation / Background Alert'),
    )

    SEVERITY_CHOICES = (
        ('info', 'Informational'),
        ('warning', 'Warning Notice'),
        ('critical', 'Critical Security/Financial'),
    )

    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='activity_logs',help_text="The user  tied to this record.")
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,blank=True,related_name='user_initiated_actions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, db_index=True)
    severity = models.CharField(max_length=15, choices=SEVERITY_CHOICES, default='info', db_index=True)
    action_event = models.CharField(max_length=255, help_text="e.g., 'user_login', 'user_signup' ")
    description = models.TextField(help_text="Human-readable detail statement summarizing exactly what transpired.")
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    user_agent = models.CharField(max_length=500, null=True, blank=True, help_text="Browser/device fingerprint data")    
    location_snapshot = models.CharField(max_length=255, null=True, blank=True, help_text="Approximate or pinpoint geo-metadata at the moment of entry, e.g., 'Juja, Kiambu'")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, editable=False)
    
    class Meta:
        db_table = 'soko_user_activity_log'
        ordering = ['-created_at']
        verbose_name = 'User Activity Log'
        verbose_name_plural = 'User Activity Logs'

    def __str__(self):
        return f"{self.user.full_name} | {self.action_event} | {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

    def save(self, *args, **kwargs):
        if self.pk:
            raise PermissionDenied(_("User log records are strictly immutable and cannot be updated once stored."))
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise PermissionDenied(_("User log records are permanent and cannot be deleted from this platform."))
        
        
        
        
        
        
        
        
        
        
        
        
        
        
