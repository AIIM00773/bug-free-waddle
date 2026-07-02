from django.urls import path 
from .views import *
urlpatterns =[
    path ("",MerchantProfileDashboardView.as_view(), name="base_view "),
    path("onboard/", MerchantOnboardingView.as_view(), name="onboarding_view")
]