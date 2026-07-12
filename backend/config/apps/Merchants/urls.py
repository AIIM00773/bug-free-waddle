from django.urls import path

# Assuming you renamed the 'Views' folder to 'views' and the files to lowercase
from .views.profile import MerchantProfileDashboardView
from .views.branch import BranchOnboardView, IndividualBranchView, BranchDeleteView
from .views.inventory import InventoriesView
from .views.merchant import MerchantOnboardingView
from .views.product import MerchantInventoryProductOnboardView , MerchantInventoryIndividualProductView 

urlpatterns = [
    path("", MerchantProfileDashboardView.as_view(), name="base_view"),
    
    # MERCHANT ONBOARDING
    path("merchant/onboard/", MerchantOnboardingView.as_view(), name="onboarding_view"),
    
    # BRANCH RELATED ROUTES
    path("branches/onboard/", BranchOnboardView.as_view(), name="branch_onboarding"),
    path("branches/<str:unique_id>/", IndividualBranchView.as_view(), name="branch_details"), 
    path("branches/<str:unique_id>/delete/", BranchDeleteView.as_view(), name="delete_branch"),

    # INVENTORY RELATED ROUTES
    path("inventories/<str:unique_id>/", InventoriesView.as_view(), name="merchant_inventories"), 

    # PRODUCT RELATED ROUTES 
    path("products/onboard/",MerchantInventoryProductOnboardView.as_view(), name="onboard_product" ),
    path("products/<str:product_unique_id>/", MerchantInventoryIndividualProductView.as_view(), name="individual_product" ),
]
