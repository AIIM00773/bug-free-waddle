from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .User import IsAdminStaff

User = get_user_model()






# ==========================================================================================================================================ADMIN AUTH AND RELATE 
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "unique_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
        )
        
    
    
    
class AdminLoginService(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username", "")
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"detail": "Username and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "User account disabled"},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": AdminUserSerializer(user).data
        }, status=status.HTTP_200_OK)
 
        
        
class ValidateAdminAuthService(APIView):
    """
    GET /api/admin/auth/me/
    Validates JWT access token and returns current admin user.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminStaff, IsAuthenticated]

    def get(self, request, *args, **kwargs):

        user = request.user

        if not user or not user.is_authenticated:
            return Response(
                {"detail": "Unauthenticated"},
                status=401
            )

        return Response(
            {
                "id": user.unique_id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
            }
        )
        
        
        
        

