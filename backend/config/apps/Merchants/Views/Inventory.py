from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from django.shortcuts import get_object_or_404

from ..models import InternalMerchantProfile, MerchantStoreBranch, BranchSpecificInventory, MerchantInventoryProduct
from .permissions import IsVerifiedMerchant

# --- Serializers ---

class InventorySerializer(ModelSerializer):
    class Meta:
        model = BranchSpecificInventory
        fields = "__all__"
        read_only_fields = ['parrentBranch']  


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
    
    def _get_branch(self, user, unique_id):
        merchant = self._get_merchant(user)
        return get_object_or_404(MerchantStoreBranch, merchant=merchant, unique_id=unique_id)
        
    def get(self, request, unique_id):
        branch = self._get_branch(request.user, unique_id)
        
        # 1. Grab the inventories for this branch
        inventories = BranchSpecificInventory.objects.filter(parrentBranch=branch)
        
        # 2. Extract the actual products inside these inventories
        # Using prefetch_related or a direct filter to keep DB trips minimal
        products = MerchantInventoryProduct.objects.filter(parrentInventory__in=inventories)
        
        # 3. Combine inventory metadata and slim product items into one clean response
        return Response({
            "inventories": InventorySerializer(inventories, many=True).data,
            "products": SlimMerchantProductSerializer(products[:100], many=True).data  # Sliced at 100 max for peak UX
        }, status=status.HTTP_200_OK)
        

    def post(self, request, unique_id):
        branch = self._get_branch(request.user, unique_id)
        serializer = InventorySerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(parrentBranch=branch)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        
