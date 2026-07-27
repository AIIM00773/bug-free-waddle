


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
from rest_framework import serializers
# Explicitly import all updated backend schemas for the atomic pipeline
from ..models import  UserReview, UserAlert, UserSearches, CartGroup, SubCart, SubCartItem , UserOrderGroup, UserSubOrder, UserSubOrderItem

# AUTH VALIDATION HELPERS
from  ..utils.validators.auth_validation_helpers import validate_email,validate_name,validate_password,validate_phone  
User = get_user_model()



# ---------------------------------------------------------
# API CONTROLLER VIEWS
# ---------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        exclude = ['password', 'account_validation_code', 'is_staff', 'is_superuser','groups',"last_ip_address","user_permissions" ,"failed_login_attempts","deleted_at"]



class ValidateAuth(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = self.request.user  
        serializer = UserSerializer(user)
        
        return Response(
            {
                "message": "Token validated successfully.",
                "user": serializer.data,
             
            },
            status=status.HTTP_200_OK,
        )
