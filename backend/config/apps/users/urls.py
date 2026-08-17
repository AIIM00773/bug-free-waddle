

from django.urls import path
from .views import UserRegistrationView, UserLoginView,RecoverPasswordView, UserProfileView,ValidateAuth,UserLogoutView,UserProfileIdentityUpdateView , UserProfileLogisticsUpdateView
urlpatterns = [
    path("validate-token/",ValidateAuth.as_view()),
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("logout/",UserLogoutView.as_view(), name="user-logout" ),
    path("recover-password/",RecoverPasswordView.as_view(),name="recover-password"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    
    path("profile/update/identity/",UserProfileIdentityUpdateView.as_view(), name="user-identity-update"),
    path("profile/update/logistic/",UserProfileLogisticsUpdateView.as_view(), name="user-logistics-update"),
]

