from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from django.shortcuts import get_object_or_404

from ..models import InternalMerchantProfile, MerchantInventory, MerchantInventoryProduct
from .permissions import IsVerifiedMerchant

# --- Serializers ---

class InventorySerializer(ModelSerializer):
    class Meta:
        model = MerchantInventory
        fields = "__all__"


class SlimMerchantProductSerializer(ModelSerializer):
    """
    LIGHTWEIGHT LIST SERIALIZER:
    Strips out all 40+ heavy database fields, JSON logs, and extra images.
    Returns only what the dashboard grid needs to display.
    """
    class Meta:
        model = MerchantInventoryProduct
        fields = [
            'unique_id', 
            'title', 
            'sku', 
            'category', 
            'dealPrice', 
            'stockQuantity', 
            'placeHolderimageUrl', 
            'isAvailable'
        ]



# --- Views ---

class BaseMerchantView(APIView):
    permission_classes = [IsVerifiedMerchant]

    def _get_merchant(self, user):
        return get_object_or_404(InternalMerchantProfile, vendorOwner=user)


class InventoriesView(BaseMerchantView):

        
    def get(self, request, unique_id):
        
        # 1. Grab the inventory  for this merchant 
        inventory = MerchantInventory.objects.get(parentMerchant = request.user , unique_id=unique_id)
        
        # 2. Extract the actual products inside this inventory 
        # Using prefetch_related or a direct filter to keep DB trips minimal
        products = MerchantInventoryProduct.objects.filter(parrentInventory = inventory )
        
        # 3. Combine inventory metadata and slim product items into one clean response
        return Response({
            "inventory": InventorySerializer(inventory, many=False).data,
            "products": SlimMerchantProductSerializer(products[:100], many=True).data
        }, status=status.HTTP_200_OK)

        



        
