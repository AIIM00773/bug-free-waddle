import os
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static 

urlpatterns = [

    # =========================================================================
    # 1. PUBLIC MARKETPLACE SERVICES LAYER (Client Facing Endpoints)
    # =========================================================================
    
    # Consumer Authentication Access Ports
    path("public/api/v1/auth/token/obtain/", TokenObtainPairView.as_view(), name="public-token-obtain"),
    path("public/api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="public-token-refresh"),  
    
    # Core Domain App Feature Routers
    path("public/api/v1/users/", include("apps.users.urls")),
 
    
]


# Serve media files during local development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
