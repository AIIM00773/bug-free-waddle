from rest_framework import serializers
from django.contrib.auth import get_user_model


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction




User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        exclude = ['password', 'account_validation_code', 'is_staff', 'is_superuser']




# imports
from ..models import UserReview, UserAlert, UserSearches, CartGroup
from ..utils.validators.auth_validation_helpers import (
    validate_password as custom_password_validator,
    validate_phone as custom_phone_validator
)




class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        
        # 1. Extract and Basic Validation
        full_name = (data.get("full_name") or "").strip()
        phone = (data.get("phone") or "").strip()
        password = (data.get("password") or "").strip()

        if not all([full_name, phone, password]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Logic Validation (Re-using your existing helpers)
        names = full_name.split()
        if len(names) < 2 or not all(n.isalpha() for n in names):
            return Response({"error": "Full name must be at least two alphabetical names."}, status=status.HTTP_400_BAD_REQUEST)

        if not custom_phone_validator(phone):
            return Response({"error": "Invalid phone number or already registered."}, status=status.HTTP_400_BAD_REQUEST)

        if not custom_password_validator(password):
            return Response({"error": "Password requirements not met."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. (Wrapped in Atomic to ensure all-or-nothing)
        try:
            with transaction.atomic():

                user = User.objects.create_user(
                    username=phone,
                    phone=phone,
                    password=password,
                    first_name=names[0],
                    last_name=names[-1],
                    email = None,
                )

                # Initialize related models
                CartGroup.objects.create(user=user)
                UserReview.objects.create(user=user)
                UserAlert.objects.create(user=user)
                UserSearches.objects.create(user=user)

        except Exception as e:
            print(f"Registration Error: {str(e)}")
            return Response({"error": "Database error during registration."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4. Token Generation
        refresh = RefreshToken.for_user(user)

        # 5. Serialization for Response
        serializer = UserSerializer(user)

        return Response({
            "message": "User registered successfully.",
            "user": serializer.data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)



        
