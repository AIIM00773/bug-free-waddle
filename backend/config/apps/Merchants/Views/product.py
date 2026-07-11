import re
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ModelSerializer

from ..models import (
    InternalMerchantProfile, 
    MerchantStoreBranch, 
    BranchSpecificInventory, 
    MerchantInventoryProduct
)
from ..utils import log_merchant_activity
from .permissions import IsVerifiedMerchant

# =============================================================================
# Industry-Standard Compiled Regular Expressions
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^(07|01)\d{8}$")  # Validates 10-digit format starting with 07 or 01
KRA_PIN_REGEX = re.compile(r"^[A-Z]\d{9}[A-Z]$")
NUMERIC_REGEX = re.compile(r"^\d+$")


# =============================================================================


class FullMerchantInventoryProductSerializer(ModelSerializer):
    """
    HEAVY DETAIL SERIALIZER:
    Kept for when the merchant clicks 'Edit' or views a single product's deep metrics.
    """
    class Meta:
        model = MerchantInventoryProduct
        fields = "__all__"
        read_only_fields = ['merchant']




# onboard serializer 
class MerchantInventoryProductOnboardSerializer(ModelSerializer):
    class Meta:
        model = MerchantInventoryProduct
        exclude = ['merchant', 'slug', 'priceChangeRecords', 'priceCompetitionRecords', 'clickCount', 'reservedQuantity']   
    def validate (self, attrs):
        instance = MerchantInventoryProduct(**attrs)

        try: 
            instance.clean()
        except DjangoValidationError as e :
            raise (Serializers.ValidationError(e.message_dict))
        return instance


        
        
# =============================================================================
class MerchantInventoryIndividualProductView(APIView):
    permission_classes = [IsVerifiedMerchant]

    def get(self, request, product_id):
        user = request.user

        # 1. Fetch the merchant profile for the authenticated user
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=user)
        
        # 2. Fetch the product directly, strictly scoped to this merchant
        product = get_object_or_404(
            MerchantInventoryProduct, 
            unique_id=product_id, 
            merchant=profile
        )

        serializer = FullMerchantInventoryProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)






class MerchantInventoryProductOnboardView(APIView):

    permission_classes = [IsVerifiedMerchant]

    def post (self,request,*args,**kwargs):
        data = request.data
        merchant = get_object_or_404(InternalMerchantProfile, vendorOwner = request.user)

        print (data)
        
        return Response({"details":"some info"}, status = status.HTTP_201_CREATED)
        
    
