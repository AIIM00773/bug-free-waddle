

from django.urls import path
from . import views
urlpatterns = [
    path("auth/access/", views.AdminLoginView.as_view()),
    path("auth/login/",views.AdminLoginView.as_view()),
    path("auth/me/",views.ValidateAuth.as_view())
]