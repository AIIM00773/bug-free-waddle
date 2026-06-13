import uuid
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.inventory.models import Product 


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



# =======================USER CART 
class UserCart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart ({self.user.username})"




# =====================CART ITEM 
class CartItem(models.Model):
    cart = models.ForeignKey(
        'UserCart', 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    added_at_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        help_text="Price in KSh recorded when the item was added to cart."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ('cart', 'product')

    @property
    def total_item_cost(self):
        return self.added_at_price * self.quantity

    def save(self, *args, **kwargs):
        if not self.added_at_price and self.product_id:
            self.added_at_price = getattr(self.product, 'current_price', 0.00)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.product.title[:20]}... in Cart ({self.cart.user.username})"



class UserSearches(models.Model):
    # RELATIONSHIPS & IDENTITY
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



# USER CONVERSATION
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






class UserOrder(models.Model):
    STATUS_CHOICES = (
        ("pending_payment", "Pending Payment"),
        ("paid", "Paid / Processing"),
        ("shipped", "Shipped from Merchant"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    )
    
    
    PAYMENT_METHOD_CHOICES = (
        ("mpesa", "M-Pesa"),
        ("airtel_money", "Airtel Money"),
        ("cash_on_delivery", "Cash on Delivery"),
    )
    

    user = models.ForeignKey(
        'User', 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='orders',
        help_text="Set to NULL if account is hard-deleted so we retain financial history tracking."
    )
    
    order_number = models.CharField(
        max_length=100, 
        unique=True, 
        editable=False, 
        db_index=True
    )
    
    status = models.CharField(
        max_length=30, 
        choices=STATUS_CHOICES, 
        default="pending_payment",
        db_index=True
    )
    
    
    subtotal = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        help_text="Total price of items in KSh before auxiliary fees."
    )
    
    
    shipping_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        help_text="Calculated delivery charges based on user coordinates."
    )
    
    
    total_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        help_text="Final absolute transactional value in KSh (Subtotal + Shipping)."
    )
    
    
    payment_method = models.CharField(
        max_length=30, 
        choices=PAYMENT_METHOD_CHOICES, 
        blank=True, 
        null=True
    )
    
    is_paid = models.BooleanField(default=False, db_index=True)
    payment_reference = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        db_index=True,
        help_text="e.g., M-Pesa Transaction Code (RG67XXXXXX) or Charge ID."
    )
    paid_at = models.DateTimeField(blank=True, null=True)

    shipping_full_name = models.CharField(max_length=255)
    shipping_phone = models.CharField(max_length=50)
    shipping_country = models.CharField(max_length=100, default="Kenya")
    shipping_city = models.CharField(max_length=100)
    shipping_address_line = models.TextField(help_text="Specific details: Apartment, House No, Street name.")

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    total_shipping_weight = models.CharField(max_length=200, null=True, blank=True , help_text="shipping weight in kgs")
    total_shipping_length = models.CharField(max_length=200, null=True, blank=True, help_text="shipping length in meters")
    total_shipping_width = models.CharField(max_length=200, null=True, blank=True , help_text="shipping width in meters ")
    total_shipping_height = models.CharField(max_length=200, null=True, blank=True , help_text="shipping Height in Meters ")
    total_shipping_volume = models.CharField(max_length=200, null=True, blank=True, help_text="shipping volume in Cubic meters")
    

     

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["is_paid"]),
            models.Index(fields=["order_number"]),
            models.Index(fields=["created_at"]),
        ]

    def generate_order_number(self):
        today_str = timezone.now().strftime('%Y%m%d')
        random_suffix = str(uuid.uuid4().hex[:8]).upper()
        return f"SOKO-{today_str}-{random_suffix}"
    

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        self.total_amount = self.subtotal + self.shipping_fee
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} ({self.status})"





class UserOrderItem(models.Model):
    order = models.ForeignKey(
        UserOrder, 
        on_delete=models.CASCADE, 
        related_name='order_items'
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='order_entries'
    )
    snapshot_title = models.CharField(
        max_length=500, 
        help_text="Immutable copy of the product title at checkout."
    )
    
    snapshot_description = models.TextField(
        help_text="Immutable copy of the product description at checkout."
    )
    
    snapshot_merchant = models.CharField(
        max_length=100, 
        help_text="e.g., Jumia, Kilimall, SkyGarden"
    )
    
    snapshot_image_url = models.URLField(max_length=1000, blank=True, null=True)
    
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    price_per_unit = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        help_text="The exact amount in KSh the item cost at the moment of checkout validation."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_cost(self):
        return self.price_per_unit * self.quantity

    def save(self, *args, **kwargs):
        if self.product and not self.snapshot_title:
            self.snapshot_title = self.product.title
            self.snapshot_merchant = getattr(self.product, 'merchant', 'Unknown')
            self.snapshot_image_url = getattr(self.product, 'image_url', '')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.snapshot_title[:20]}... in {self.order.order_number}"







class UserReview(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="review_profile")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.first_name if self.user.first_name else self.user.username} - Reviews Profile"


class UserReviewItem(models.Model):
    parent = models.ForeignKey(UserReview, on_delete=models.CASCADE, related_name="reviews")
    target_item = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_reviews")
    
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
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="tracked_alerts", null=True, blank=True)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPE_CHOICES, default="price_drop")
    target_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Target budget match value in KSh")
    is_triggered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_alert_type_display()} for {self.parent.user.username}"





class UserPaymentOption(models.Model):
    PAYMENT_TYPE_CHOICES = (
        ("mpesa", "M-Pesa Express"),
        ("card", "Debit/Credit Card"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payment_options")
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default="mpesa")
    is_default = models.BooleanField(default=False)
    
    # M-Pesa Data Fields
    mpesa_phone_number = models.CharField(max_length=15, blank=True, null=True, help_text="Format: 07XXXXXXXX or 254XXXXXXXX")
    
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