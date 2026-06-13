from django.db import models
from django.conf import settings
from django.utils import timezone

class AdminProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='admin_profile'
    )
    

    class AdminRole(models.TextChoices):
        SUPER_ADMIN = 'SuperAdmin', 'Super Administrator'
        SEC_OPS = 'SecOps', 'Security Operations'
        DATA_ENGINEER = 'DataEngineer', 'Data Engineer'
        CUSTOMER_SERVICE = 'CustomerService', 'Customer Service'
        SALES = 'Sales', 'Sales'
        MARKETING = 'Marketing', 'Marketing'


    assigned_roles = models.JSONField(default=list, help_text="List of roles assigned to this administrator")
    
    # Operational Meta-data
    employee_id = models.CharField(max_length=30, unique=True, blank=True, null=True)
    department = models.CharField(max_length=100, default="Operations")
    phone = models.CharField(max_length=20, blank=True)
    duration_in_the_company = models.CharField(max_length=50, blank=True, null=True)

    # Demographic attributes requested by your client runtime
    class GenderChoices(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'

    gender = models.CharField(max_length=10, choices=GenderChoices.choices, blank=True, null=True)
    age = models.IntegerField(default=18)
    ethnicity = models.CharField(max_length=50, default="Not Specified")
    country_of_birth = models.CharField(max_length=100, default="Kenya")
    
    # Fine-grained Security & Verification States
    is_allowed_access = models.BooleanField(default=True)
    is_registration_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_identity_verified = models.BooleanField(default=False)
    
    two_factor_enforced = models.BooleanField(default=False)
    suspended_at = models.DateTimeField(blank=True, null=True)
    
    # Hardware Security Logging
    trusted_machine_seeds = models.JSONField(default=list, blank=True)
    login_history = models.JSONField(default=list, blank=True, help_text="Array of recent login ISO timestamps")
    
    # System Overrides & Layout Configurations
    ui_theme_preference = models.CharField(max_length=10, default='dark')
    default_dashboard_view = models.CharField(max_length=50, default='general_view')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_suspended(self):
        return self.suspended_at is not None or not self.is_allowed_access

    def log_access(self):
        """Utility function to keep rolling log array cleanly size-bounded."""
        now = timezone.now().isoformat()
        history = self.login_history or []
        history.insert(0, now)
        self.login_history = history[:60] 
        self.save(update_fields=['login_history'])

    def __str__(self):
        return f"{self.user.username} - Roles: {', '.join(self.assigned_roles)}"