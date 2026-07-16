




from django.urls import path

# Assuming you renamed the 'Views' folder to 'views' and the files to lowercase
from .views.profile import MerchantProfileDashboardView
from .views.inventory import InventoriesView
from .views.merchant import MerchantOnboardingView
from .views.product import MerchantInventoryProductOnboardView , MerchantInventoryIndividualProductView 

urlpatterns = [
    path("<str:merchant_unique_id>/", MerchantProfileDashboardView.as_view(), name="base_view"),
    
    # MERCHANT ONBOARDING
    path("merchant/onboard/", MerchantOnboardingView.as_view(), name="onboarding_view"),

    # INVENTORY RELATED ROUTES
    path("inventories/<str:unique_id>/", InventoriesView.as_view(), name="merchant_inventories"), 

    # PRODUCT RELATED ROUTES 
    path("products/onboard/",MerchantInventoryProductOnboardView.as_view(), name="onboard_product" ),
    path("products/<str:product_unique_id>/", MerchantInventoryIndividualProductView.as_view(), name="individual_product" ),
]
