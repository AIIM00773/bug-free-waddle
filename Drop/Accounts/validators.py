import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomPasswordValidator:
    """
    Custom password validator that enforces additional security rules.
    """

    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter."),
                code='password_no_upper',
            )

        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter."),
                code='password_no_lower',
            )

        if not re.search(r'\d', password):
            raise ValidationError(
                _("Password must contain at least one digit."),
                code='password_no_digit',
            )

        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code='password_no_special',
            )


        # Check for common patterns
        if re.search(r'(.)\1{2,}', password):  # Three or more repeated characters
            raise ValidationError(
                _("Password cannot contain three or more repeated characters."),
                code='password_repeated_chars',
            )

        if re.search(r'(012|123|234|345|456|567|678|789|890)', password):
            raise ValidationError(
                _("Password cannot contain sequential numbers like (012 | 123 | 234 | 345 | 456 | 567 | 678 | 789 | 890 )"),
                code='password_sequential',
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 6 characters, including "
            "uppercase and lowercase letters, digits, and special characters. "
            "Avoid repeated characters and sequential numbers."
        )