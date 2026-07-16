




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
from ..models import  UserReview, UserAlert, UserSearches, CartGroup, SubCart, SubCartItem , UserOrderGroup, UserSubOrder, UserSubOrderItem

# AUTH VALIDATION HELPERS
from  ..utils.validators.auth_validation_helpers import validate_email,validate_name,validate_password,validate_phone  
User = get_user_model()



# ---------------------------------------------------------
# API CONTROLLER VIEWS
# ---------------------------------------------------------



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

        CartGroup.objects.create(user=user)
        UserReview.objects.create(user=user)
        UserAlert.objects.create(user=user)
        UserSearches.objects.create(user=user)  
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "uuid": str(user.unique_id),
                    "phone": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "full_name":user.full_name,
                    "is_active": user.is_active,
                    "is_merchant": user.is_merchant,
                    "is_banned":user.is_banned,
                    "is_suspended":user.is_suspended ,
                    "is_blocked":user.is_blocked , 
                    "is_email_verified": user.is_email_verified,
                    "is_phone_verified":user.is_phone_verified ,
                    "onboarding_completed": user.onboarding_completed,
                    "mfa_required":user.mfa_required ,
                    "age": user.age,
                    "created_at":user.created_at,
                    "is_merchant_verified":user.is_merchant_verified      
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )









