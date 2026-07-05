import os
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static 

urlpatterns = [
    # =========================================================================
    # 1. ADMIN SYSTEM CONTROL LAYER (Obfuscated API Core Routing)
    # =========================================================================
    
    # Administrative Token Security Infrastructure
    path("adm/root/api/v1/b4539b0abd814f9ab9f8fcf33cc06187/token/obtain/",  TokenObtainPairView.as_view(), name="admin-token-obtain" ),
    path("adm/root/api/v1/4f6d29e7e37e45df95cef6185d7e9123/token/refresh/",  TokenRefreshView.as_view(), name="admin-token-refresh"),  
    
    
    
    # Root Administration Router 
    path( "adm/root/api/v1/cd7bbe787516468fbd92b361b6be452f/", include("apps.administration.urls")),
    
    # System Taxonomies Core Subsystem
    path("adm/root/api/v1/0e812203c3134ffeb059e8158a486250/", include("apps.administration.urls")),
    
    # Regional Market Configuration 
    path( "adm/root/api/v1/a37bee0797c54d7099ded5a50a1f9d85/", include("apps.administration.urls")),
    
    # Internal Registered Merchant Management Systems
    path( "adm/root/api/v1/8be4df6193ca11d2aa0d00e098032b8c/", include("apps.administration.urls")),
    
    # Distributed Product Catalog Aggregation Node 
    path("adm/root/api/v1/fdf3a589-dd03-4be8-9de4-66922db46e55/", include("apps.administration.urls")),
    
    # Distributed Customer Merchnat Orders Aggregation Matrix
    path("adm/root/api/v1/f4ed76a8-be40-4c69-987b-223feb04174b/", include("apps.administration.urls")),
    
    
    
    
    
    
    # =========================================================================
    # 2. PUBLIC MARKETPLACE SERVICES LAYER (Client Facing Endpoints)
    # =========================================================================
    
    # Consumer Authentication Access Ports
    path("public/api/v1/auth/token/obtain/", TokenObtainPairView.as_view(), name="public-token-obtain"),
    path("public/api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="public-token-refresh"),  
    
    # Core Domain App Feature Routers
    path("public/api/v1/users/", include("apps.users.urls")),
    path("public/api/v1/conversations/", include("apps.Conversations.urls")),   
    
    
    
    
    # ===============================================================================
    # 3 MERCHAT ROUTES   
    # ========================================================================

    path("public/api/v1/merchants/", include("apps.Merchants.urls")),
    
]


# Serve media files during local development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)