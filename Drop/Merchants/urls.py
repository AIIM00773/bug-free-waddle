from django.urls import path
from .views import MerchantListView, MerchantDetailView, MerchantRegisterView

urlpatterns = [
    path('', MerchantListView.as_view(), name='merchant-list'),
    path('register/', MerchantRegisterView.as_view(), name='merchant-register'),
    path('<int:pk>/', MerchantDetailView.as_view(), name='merchant-detail'),
  
]
