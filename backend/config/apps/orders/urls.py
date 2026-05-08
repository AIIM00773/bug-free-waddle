

from django.urls import path
from .views import OrderListView, OrderCreateView, OrderDetailView, OrderUpdateView, OrderDeleteView
urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("create/", OrderCreateView.as_view(), name="order-create"),
    path("<str:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path("<str:order_id>/update/", OrderUpdateView.as_view(), name="order-update"),
    path("<str:order_id>/delete/", OrderDeleteView.as_view(), name="order-delete"),
]

