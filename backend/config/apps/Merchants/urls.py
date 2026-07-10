from django.urls import path 
# from .views import *
from .Views.Profile import MerchantProfileDashboardView
from .Views.Branch import BranchOnboardView,IndividualBranchView, BranchDeleteView 
from .Views.Inventory import InventoriesView 
from .Views.Merchant import MerchantOnboardingView 

urlpatterns =[
    path ("",MerchantProfileDashboardView.as_view(), name="base_view "),
    
    # MERCHANT ONBOARDING AND VALIDATION
    path("merchant/onboard/", MerchantOnboardingView.as_view(), name="onboarding_view"),
    

    # BRANCH RELATED ROUTES 
    path("branches/branch/onboard/",BranchOnboardView.as_view(), name="branch_onboarding"),
    path("branches/branch/<str:unique_id>/", BranchDeleteView.as_view(), name="delete_branch"),
    path("branches/branch/details/<str:unique_id>/", IndividualBranchView.as_view(),name="branch_details"), 


    # INVONTORY RELATED ROUTES 
    path("inventories/<str:unique_id>/",InventoriesView.as_view(),name="merchant_inventories"), 

]




