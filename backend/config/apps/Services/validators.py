import re

from django.contrib.auth import get_user_model

User = get_user_model()


EMAIL_PATTERN = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)

PASSWORD_PATTERN = re.compile(
    r"""
    ^
    (?=.*[A-Z])                # At least one uppercase
    (?=.*[a-z])                # At least one lowercase
    (?=.*\d)                   # At least one digit
    (?=.*[@$!%*?&])            # At least one special character
    [A-Za-z\d@$!%*?&]{8,}      # Allowed chars + min length
    $
    """,
    re.VERBOSE,
)

PHONE_PATTERN = re.compile(
    r"^\+?[1-9]\d{8,14}$"
)

NAME_PATTERN = re.compile(
    r"[A-Za-zÀ-ÿ\s'-]+"
)


def validate_email(email: str) -> bool:
    """
    Validate email format and uniqueness.
    """

    cleaned_email = email.strip().lower()

    email_exists = User.objects.filter(
        email=cleaned_email
    ).exists()

    return (
        bool(EMAIL_PATTERN.fullmatch(cleaned_email))
        and not email_exists
    )






def validate_password(password: str) -> bool:
    """
    Validate password strength.
    """

    return bool(
        len(password.strip()) >=6
    )






def validate_phone(phone: str) -> bool:
    """
    Validate international phone format
    and uniqueness.
    """

    cleaned_phone = phone.strip()

    phone_exists = User.objects.filter(
        username=cleaned_phone
    ).exists()

    return (
        bool(PHONE_PATTERN.fullmatch(cleaned_phone))
        and not phone_exists
    )







def validate_name(name: str) -> bool:
    """
    Validate human names.
    """

    cleaned_name = name.strip()

    return bool(
        cleaned_name
        and NAME_PATTERN.fullmatch(cleaned_name)
    )