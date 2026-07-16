






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





        
        
        
        
    
