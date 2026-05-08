

from django.urls import path, include
from .views import InventoryListView, InventoryCreateView, InventoryDetailView, InventoryUpdateView, InventoryDeleteView

    
urlpatterns = [
    path("", InventoryListView.as_view(), name="inventory-list"),
    path("create/", InventoryCreateView.as_view(), name="inventory-create"),
    path("<str:inventory_id>/", InventoryDetailView.as_view(), name="inventory-detail"),
    path("<str:inventory_id>/update/", InventoryUpdateView.as_view(), name="inventory-update"),
    path("<str:inventory_id>/delete/", InventoryDeleteView.as_view(), name="inventory-delete"),
]