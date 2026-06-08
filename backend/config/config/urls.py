

from django.contrib import admin

from django.urls import path, include 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    
    path('auth/api/token/obtain/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    
    path("api/users/", include("apps.users.urls")),
    path("api/inventory/", include("apps.inventory.urls")),
   
    
    
]

