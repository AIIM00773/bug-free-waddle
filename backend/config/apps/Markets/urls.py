from django.urls import path 
from .views import *
urlpatterns =[
    path ("",BaseMarketsView.as_view(), name="base_markets_view")
]