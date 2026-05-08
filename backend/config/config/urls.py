

from django.contrib import admin

from django.urls import path, include 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("drop-founders-admin-root/<str:admin_id>/", admin.site.urls),

    path ("", include("apps.common.urls")),
    
    path("api/users/", include("apps.users.urls")),
    path("api/merchants/", include("apps.merchants.urls")),
    path("api/conversations/", include("apps.conversations.urls")),
    path("api/inventory/", include("apps.inventory.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/search/", include("apps.search.urls")),
    path("api/cart/", include("apps.cart.urls")),
    path("api/shipping/", include("apps.shipping.urls")),

    
    
]

