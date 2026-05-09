from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from ..Services.validators import ( validate_email, validate_name,validate_password,validate_phone )
from django.contrib.auth import authenticate

User = get_user_model()






class UserRegistrationView(APIView):

    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):

        data = request.data

        first_name = (data.get("first_name") or "").strip().capitalize()
        last_name = (data.get("last_name") or "").strip().capitalize()
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        phone = ( data.get("phone") or "").strip()


        # Required fields
        if not all([first_name, email, password, phone]):

            return Response(
                {
                    "error": (
                        "First name, email, "
                        "password and phone "
                        "are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )



        # Name validation
        if not validate_name(first_name):
            return Response(
                {"error": "Invalid first name format or empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )



        if last_name and not validate_name(last_name):
            return Response(
                {"error": "Invalid last name format or empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )


        # Email validation
        if not validate_email(email):
            return Response(
                {
                    "error": (
                        "Invalid email "
                        "or email already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )



        # Password validation
        if not validate_password(password):

            return Response(
                {
                    "error": (
                        "Password must contain "
                        "uppercase, lowercase, "
                        "digit, special character "
                        "and be at least 8 "
                        "characters long."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )




        # Phone validation
        if not validate_phone(phone):
            return Response(
                {
                    "error": (
                        "Invalid phone number "
                        "or phone already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )



        # Create user
        user = User.objects.create_user(
            phone=phone,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )



        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User registered successfully.",

                "user": {
                    "uuid": str(user.unique_uuid),
                    "phone": user.phone,
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





    def get(self, request, *args, **kwargs):

        return Response(
            {
                "message": (
                    "User registration endpoint."
                )
            },
            status=status.HTTP_200_OK,
        )







class UserLoginView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):

        data = request.data

        phone = (data.get("phone") or "").strip()
        password = (data.get("password") or "").strip()


        # Validation
        if not phone or not password:
            return Response(
                {"error": "Phone and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )


        # Authenticate
        user = authenticate(
            request,
            username=phone,
            password=password
        )


        # Check result
        if user is None:
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )



        # JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "uuid": str(user.unique_uuid),
                    "phone": user.phone,
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

    permission_classes = [
        permissions.IsAuthenticated
    ]
    

    def get(self, request, *args, **kwargs):

        return Response(
            {
                "message": (
                    "To log out, send a POST request "
                    "with your refresh token to this endpoint."
                )
            },
            status=status.HTTP_200_OK,
        )
    


    def post(self, request, *args, **kwargs):

        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Your auth Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (TokenError, InvalidToken):
            return Response(
                {"error": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

        return Response(
            {
                "message": (
                    "User logged out successfully."
                )
            },
            status=status.HTTP_200_OK,
        )
    






class UserProfileView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, *args, **kwargs):

        user = request.user

        return Response(
            {
                "phone": user.phone,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=status.HTTP_200_OK,
        )
