

from django.urls import path, include
from .views import( 
    MerchantListView,
      MerchantDetailView,
        MerchantCreateView,
          MerchantUpdateView,
            MerchantDeleteView, 
           
        )

urlpatterns = [
    path("", MerchantListView.as_view(), name="merchant-list"),
    path("create/", MerchantCreateView.as_view(), name="merchant-create"),
    path("<str:merchant_id>/", MerchantDetailView.as_view(), name="merchant-detail"),
    path("<str:merchant_id>/update/", MerchantUpdateView.as_view(), name="merchant-update"),
    path("<str:merchant_id>/delete/", MerchantDeleteView.as_view(), name="merchant-delete")
    
]
