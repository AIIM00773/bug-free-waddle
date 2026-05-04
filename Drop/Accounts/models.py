


import uuid
from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator, FileExtensionValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False 



def user_profile_pic_path(instance, filename):
    """
    Generate secure file path for user profile pictures.
    """
    import os
    from django.utils import timezone

    # Create path with user ID and timestamp for security
    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    concarency_proof = uuid.uuid4
    ext = os.path.splitext(filename)[1].lower()
    safe_filename = f"profile_{instance.user.id}_{timestamp}_{concarency_proof}{ext}"

    return f'profiles/{instance.user.id}/{safe_filename}'





def validate_image_file(file):
    """
    Validate uploaded image files for security.
    """
    from django.core.files.base import ContentFile

    # Check file size (max 3MB)
    if file.size > 3 * 1024 * 1024:
        raise ValidationError('File size must be under 3MB.')

    # Check file type using magic numbers (if available)
    if MAGIC_AVAILABLE:
        file_content = file.read()
        file.seek(0)  

        mime = magic.from_buffer(file_content, mime=True)
        allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

        if mime not in allowed_mimes:
            raise ValidationError(f'File type {mime} not allowed. Only JPEG, PNG, GIF, and WebP are permitted.')
    else:
        # Fallback to file extension validation if magic is not available
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        ext = file.name.lower().split('.')[-1] if '.' in file.name else ''
        if f'.{ext}' not in allowed_extensions:
            raise ValidationError(f'File extension .{ext} not allowed. Only JPEG, PNG, GIF, and WebP are permitted.')

    # Additional security: check for embedded scripts in image metadata (only if we read the content)
    if MAGIC_AVAILABLE and (b'<script' in file_content.lower() or b'javascript:' in file_content.lower() or b'import' in file_content.lower() or b'<import' in file_content.lower()):
        raise ValidationError('File contains potentially malicious content.')





class UserProfile(models.Model):
    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("non_binary", "Non-Binary"),
        ("not_set", "Prefer not to say"),
    )

    # Use settings.AUTH_USER_MODEL for best practice
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )


    # State Identity 
    is_merchant = models.BooleanField(default=False)
    profile_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)


    # These are high-priority for the "Welcome Engine"
    display_name = models.CharField(max_length=50, blank=True, help_text="How the AI addresses you")

    user_age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES, default="not_set")
    profile_pic = models.ImageField(
        upload_to=user_profile_pic_path,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif', 'webp']), validate_image_file]
    )
    bio = models.TextField(blank=True, max_length=250)



    # --- Communication ---
    contact_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+254...'. Up to 15 digits allowed."
        )]
    )



    # Used to fetch weather and local trends
    location = models.JSONField(default=dict, null=True, blank=True)

    # Store dynamic data like 'interests' for the AI to pivot on
    metadata = models.JSONField(default=dict, blank=True, help_text="AI-extracted interests, style tags, etc.")
    shipping_addresses = models.JSONField(default=list, db_default=[])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"@{self.user.username} | {'Merchant' if self.is_merchant else 'Client'}"


    @property
    def greeting_name(self):
        return self.display_name or self.user.first_name or self.user.username


    @property
    def get_main_shipping_address(self):
        return self.shipping_addresses


    def add_new_shipping_address(self,new_address):
        self.shipping_addresses.append(new_address)
        self.save()
        return self.get_main_shipping_address()
    

    def update_shipping_address(self,address_id,new_version):
        self.shipping_addresses[address_id] = new_version
        self.save()
        return self.get_main_shipping_address()
    

    def to_dict(self):
        return {
            'profile_uuid': str(self.profile_uuid),
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'display_name': self.display_name,
            'bio': self.bio,
            'user_age': self.user_age,
            'gender': self.gender,
            'profile_pic': self.profile_pic.url if self.profile_pic else None,
            'contact_number': self.contact_number,
            'is_merchant': self.is_merchant,
            'location': self.location,
            'shipping_addresses': self.shipping_addresses,
            'metadata': self.metadata,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }



    def update_profile(self, **data):
        user_fields = ['first_name', 'last_name', 'email']
        profile_fields = [
            'display_name', 'user_age', 'gender', 'profile_pic', 'bio',
            'contact_number', 'location', 'shipping_addresses', 'metadata',
        ]

        for field in user_fields:
            if field in data:
                setattr(self.user, field, data[field])

        for field in profile_fields:
            if field in data:
                setattr(self, field, data[field])

        self.user.save()
        self.save()
        return self.to_dict()










# --- THE ENGINE MODELS ---

class UserPersona(models.Model):
    """
    This model stores the 'Vibe' of the user.
    The AI updates this periodically based on search history and other details ...
    """

    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='persona')
    style_description = models.TextField(blank=True, help_text="AI generated summary of user style")
    preferred_categories = models.JSONField(default=list)  # e.g. ["Tech", "Minimalist Fashion"]
    loyalty_score = models.IntegerField(default=0)
    last_ai_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Persona: {self.profile.user.username}"








# users conversations with AI/system

class Conversation(models.Model):
    # Matches 'conversationId'
    conversationId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    title = models.CharField(max_length=255) 
    status = models.CharField(max_length=20, default='active')
    is_liked = models.BooleanField(default=False)
    is_disliked = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-last_update']





# User conversation with AI sate manager...

class SearchState(models.Model):

    conversation = models.OneToOneField(
        Conversation,
        on_delete=models.CASCADE,
        related_name="search_state",
    )




    # -----------------------------------
    # CORE SEARCH
    # -----------------------------------
    raw_query = models.TextField(blank=True)
    cleaned_query = models.TextField(blank=True)
    intent = models.CharField(max_length=255, blank=True)
    categories = models.JSONField(default=list, blank=True)
    subcategories = models.JSONField(default=list, blank=True)
    domains = models.JSONField(default=list, blank=True)  
    filters = models.JSONField(default=dict, blank=True)




    # -----------------------------------
    # SEARCH STATUS
    # -----------------------------------
    confidence_score = models.FloatField(default=0.0)
    requires_followup = models.BooleanField(default=False)
    is_deterministic = models.BooleanField(default=False)
    search_completed = models.BooleanField(default=False)




    # -----------------------------------
    # PRICE
    # -----------------------------------
    currency_in_use = models.CharField(max_length=50, default="KSH")
    budget_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(  max_digits=12,   decimal_places=2,    null=True,    blank=True  )



    # -----------------------------------
    # AI MEMORY / STATE
    # -----------------------------------
    ai_memory = models.JSONField(default=dict, blank=True)
    attributes = models.JSONField(default=dict, blank=True)
    semantic_keywords = models.JSONField(default=list, blank=True)
    preferred_brands = models.JSONField(default=list, blank=True)
    excluded_terms = models.JSONField(default=list, blank=True)
    retrieval_context = models.JSONField(default=dict, blank=True)




    # -----------------------------------
    # METADATA
    # -----------------------------------
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.conversation_id} - {self.cleaned_query}"  







class ConversationHistory(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='history', on_delete=models.CASCADE)
    user_query = models.JSONField() 
    agent_response = models.JSONField(null=True, blank=True)
    has_been_streamed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)





# ------------------------------------------------------------------------------------

class UserNotification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    message = models.TextField()
    notif_type = models.CharField(max_length=20,
                                  choices=(('ORDER', 'Order'), ('AI_SUGGESTION', 'AI Hint'), ('SYSTEM', 'System')))
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.title}, {self.message}"


