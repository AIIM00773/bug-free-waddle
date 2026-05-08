
from django.urls import path
from .views import (
    CartDetailView,
    CartCreateView,
    CartUpdateView,
    CartDeleteView,
)


urlpatterns = [
    path("carts/get/<str:cart_id>/", CartDetailView.as_view(), name="cart-detail"),
    path("carts/create/new/", CartCreateView.as_view(), name="cart-create"),
    path("carts/update/<str:cart_id>/", CartUpdateView.as_view(), name="cart-update"),
    path("carts/delete/<str:cart_id>/", CartDeleteView.as_view(), name="cart-delete"),
]

