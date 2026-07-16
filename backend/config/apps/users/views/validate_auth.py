


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

class ValidateAuth(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = self.request.user
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


    
