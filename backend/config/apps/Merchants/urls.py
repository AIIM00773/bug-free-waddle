from django.urls import path 
from .views import *
urlpatterns =[
    path ("",MerchantProfileDashboardView.as_view(), name="base_view "),
    path("merchant/onboard/", MerchantOnboardingView.as_view(), name="onboarding_view"),
    path("products/catalog/", ProductCatalogView.as_view(), name="merchants_catalog_view"),
    path("products/catalog/new/", ProductCatalogInfillView.as_view(), name="catalog_infill_view")

]


#/public/api/v1/merchants/public/api/v1/merchants/onboard/