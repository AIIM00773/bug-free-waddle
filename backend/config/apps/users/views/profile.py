
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
                "uuid": str(user.unique_id),
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
        





