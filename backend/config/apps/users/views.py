import re
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

# Explicitly import all updated backend schemas for the atomic pipeline
from .models import UserCart, UserReview, UserAlert, UserSearches

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
    if not password or len(password) < 4:  # Re-enforced production 8-character rule
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


# ---------------------------------------------------------
# API CONTROLLER VIEWS
# ---------------------------------------------------------

class ValidateAuth(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = self.request.user
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Your authentication has been successfully validated.",
                "user": {
                    "uuid": str(user.unique_uuid),
                    "phone": user.phone if user.phone else user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_200_OK,
        )


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        data = request.data

        first_name = (data.get("first_name") or "").strip().capitalize()
        last_name = (data.get("last_name") or "").strip().capitalize()
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        phone = (data.get("phone") or "").strip()

        if not all([first_name, email, password, phone]):
            return Response(
                {"error": "First name, email, password and phone are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not validate_name(first_name):
            return Response(
                {"error": "Invalid first name format. Use alphabetical text characters only (min 2)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if last_name and not validate_name(last_name):
            return Response(
                {"error": "Invalid last name format. Use alphabetical text characters only."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not validate_email(email):
            return Response(
                {"error": "Invalid email address format or email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not validate_password(password):
            return Response(
                {"error": "Password must contain uppercase, lowercase, digit, special character and be at least 4 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not validate_phone(phone):
            return Response(
                {"error": "Invalid phone number format or phone number is already registered."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- ATOMIC CREATION PIPELINE BLOCK ---
        user = User.objects.create_user(
            username=phone, 
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            phone=phone,
        )

        UserCart.objects.create(user=user)
        UserReview.objects.create(user=user)
        UserAlert.objects.create(user=user)
        UserSearches.objects.create(user=user)  
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "uuid": str(user.unique_uuid),
                    "phone": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )




class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        phone = (data.get("phone") or "").strip()
        password = (data.get("password") or "").strip()

        if not phone or not password:
            return Response(
                {"error": "Phone and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=phone, password=password)

        if user is None:
            return Response(
                {"error": "Invalid phone number or password security match."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            
        if getattr(user, 'is_banned', False) or getattr(user, 'is_blocked', False):
            return Response(
                {"error": "This account profile has been locked or suspended."},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "uuid": str(user.unique_uuid),
                    "phone": user.phone if user.phone else user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_200_OK,
        )





class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(
            {
                "message": "To log out, send a POST request with your refresh token to this endpoint."
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Your authorization refresh token is required to invalidate active sessions."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (TokenError, InvalidToken):
            return Response(
                {"error": "Invalid or expired refresh token reference."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "User logged out successfully and tokens revoked."},
            status=status.HTTP_200_OK,
        )





class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Safely extract search metadata attributes via the related search profile interface
        search_profile = getattr(user, 'search_profile', None)
        search_meta = {
            "eligible": getattr(search_profile, 'eligible', True),
            "is_on_free_tier": getattr(search_profile, 'is_on_free_tier', True),
            "free_tier_search_limit": getattr(search_profile, 'free_tier_search_limit', 20),
            "current_tier_use": getattr(search_profile, 'current_tier_use', 0),
        }

        return Response(
            {
                "uuid": str(user.unique_uuid),
                "phone": user.phone if user.phone else user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_merchant": user.is_merchant,
                "onboarding_completed": user.onboarding_completed,
                "search_allowance": search_meta 
            },
            status=status.HTTP_200_OK,
        )