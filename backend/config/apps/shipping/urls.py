
from django.urls import path
from .views import ShippingOptionListView, ShippingOptionCreateView
urlpatterns = [
    path("options/", ShippingOptionListView.as_view(), name="shipping-options"),
    path("options/create/", ShippingOptionCreateView.as_view(), name="shipping-option-create"),
]