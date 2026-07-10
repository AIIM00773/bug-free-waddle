from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from django.shortcuts import get_object_or_404

from ..models import InternalMerchantProfile, MerchantStoreBranch, BranchSpecificInventory, MerchantProductCatalog
from .permissions import IsVerifiedMerchant

# --- Serializers ---

class InventorySerializer(ModelSerializer):
    class Meta:
        model = BranchSpecificInventory
        fields = "__all__"
        read_only_fields = ['parrentBranch']  




class MerchantProductCatalogSerializer(ModelSerializer):
    class Meta:
        model = MerchantProductCatalog
        fields = "__all__"
        read_only_fields = ['merchant']




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
        inventories = BranchSpecificInventory.objects.filter(parrentBranch=branch)
        return Response(InventorySerializer(inventories, many=True).data)

        

    def post(self, request, unique_id):
        branch = self._get_branch(request.user, unique_id)
        serializer = InventorySerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(parrentBranch=branch)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductCatalogInfillView(BaseMerchantView):

    def post(self, request):
        merchant = self._get_merchant(request.user)
        serializer = MerchantProductCatalogSerializer(data=request.data)
        
        if serializer.is_valid():
            product = serializer.save(merchant=merchant)
            return Response({
                "message": "Product onboarded successfully.",
                "product_id": product.unique_id,
                "sku": product.sku
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
