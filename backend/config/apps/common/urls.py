

from django.urls import path
from .views import (CommonAPIView,pingAPIView)
urlpatterns = [
    path("", pingAPIView.as_view(), name="common-root"),
    path("ping/", CommonAPIView.as_view(), name="ping"),
    
 
]