import re
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email

User = get_user_model()

# ---------------------------------------------------------
# AUTH VALIDATION HELPERS
# ---------------------------------------------------------

def validate_email(email):
    """Validates email format and checks for uniqueness in the database."""
    if not email:
        return None
    try:
        django_validate_email(email)
        if User.objects.filter(email=email).exists():
            return None
        return email
    except ValidationError:
        return None


def validate_name(name):
    """Validates that a name contains only alphabetic characters and hyphens."""
    if not name or len(name.strip()) < 2:
        return None
    if not re.match(r"^[A-Za-z\-]+$", name):
        return None
    return name.strip()


def validate_password(password):
    """Ensures password meets complexity requirements."""
    if not password or len(password) < 4:
        return None
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?" for c in password)

    if all([has_upper, has_lower, has_digit, has_special]):
        return password
    return None


def validate_phone(phone):
    """Cleans phone string and checks for database uniqueness."""
    if not phone:
        return None
    
    # Strip spaces and leading '+'
    cleaned_phone = re.sub(r"\s+|\+", "", phone)
    
    # Check length and format
    if not cleaned_phone.isdigit() or not (9 <= len(cleaned_phone) <= 15):
        return None
    
    # Check for duplicates
    if User.objects.filter(username=cleaned_phone).exists() or \
       User.objects.filter(phone=cleaned_phone).exists():
        return None
        
    return cleaned_phone
