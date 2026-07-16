

import re
from django.contrib.auth import get_user_model
User = get_user_model()

# ---------------------------------------------------------
# AUTH VALIDATION HELPERS
# ---------------------------------------------------------

def validate_email(email):
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
    if not name or len(name.strip()) < 2:
        return None
    if not re.match(r"^[A-Za-z\-]+$", name):
        return None
    return name.strip()



def validate_password(password):
    if not password or len(password) < 4:
        return None
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in r"""!@#$%^&*()_+-=[]{}|;':",./<>?""" for c in password)
    
    if all([has_upper, has_lower, has_digit, has_special]):
        return password
    return None




def validate_phone(phone):
    if not phone:
        return None
    cleaned_phone = re.sub(r"\s+|\+", "", phone)
    if not cleaned_phone.isdigit() or len(cleaned_phone) < 9 or len(cleaned_phone) > 15:
        return None
    if User.objects.filter(username=phone).exists() or User.objects.filter(phone=phone).exists():
        return None
    return cleaned_phone




        
        
        
        
        
