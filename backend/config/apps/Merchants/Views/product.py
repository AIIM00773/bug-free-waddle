import re
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ModelSerializer
from django.shortcuts import get_object_or_404 

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



class MerchantInventoryIndividualProductView (APIView):
    def get (self,request, product_unique_id):
        # Fetch related parent models
        merchant = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        product = get_object_or_404(MerchantInventoryProduct , merchant= merchant,  unique_id = product_unique_id)
        serializer = FullMerchantInventoryProductSerializer(product, many=False)

        return Response(serializer.data, status = status.HTTP_200_OK)

        

    



class MerchantInventoryProductOnboardView(APIView):
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        print("\n\n===================GOOD1")
        # Fetch related parent models
        merchant = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        branch = get_object_or_404(MerchantStoreBranch, merchant=merchant, unique_id=data.get('parrentBranch'))
        inventory = get_object_or_404(BranchSpecificInventory, parrentBranch=branch, unique_id=data.get('parrentInventory'))

        #  getlist()  ==>  get the full array of InMemoryUploadedFiles
        images = data.getlist('productImages')
        if not images:
            return Response({
                "error": "Validation Failed , at least one product image is required. ",
                "details": {"productImages": ["At least one product image is required."]}
            }, status=status.HTTP_400_BAD_REQUEST)

        print("\n\n===================GOOD2")

        # Type-casting helpers
        def parse_bool(val):
            if isinstance(val, bool): return val
            return str(val).strip().lower() in ['true', '1', 'yes']

        print("\n\n===================GOOD3")


        def parse_numeric(val):
            if val in [None, '', 'null']: return None
            return val

        print("\n\n===================GOOD4")


        condition = data.get('condition', '')

        print("\n\n===================GOOD5")

        try:
            with transaction.atomic():
                product = MerchantInventoryProduct(
                    merchant=merchant,
                    parrentInventory=inventory,
                    
                    # Strings
                    title=data.get('title'),
                    sku=data.get('sku'),
                    category=data.get('category'),
                    brand=data.get('brand'),
                    description=data.get('description'),
                    color=data.get('color'),
                    size=data.get('size'),
                    manufacturer=data.get('manufacturer'),
                    madeIn=data.get('madeIn'),
                    shelfLocationSnapshot=data.get('shelfLocationSnapshot'),
                    
                    # Numerics
                    originalPrice=parse_numeric(data.get('originalPrice')),
                    dealPrice=parse_numeric(data.get('dealPrice')),
                    recentPrice =parse_numeric(data.get('dealPrice')),
                    stockQuantity=parse_numeric(data.get('stockQuantity')) or 0,
                    minimumStockThreshold=parse_numeric(data.get('minimumStockThreshold')) or 4,
                    weightKg=parse_numeric(data.get('weightKg')),
                    length=parse_numeric(data.get('length')),
                    width=parse_numeric(data.get('width')),
                    height=parse_numeric(data.get('height')),
                    
                    # Booleans
                    isTaxExempt=parse_bool(data.get('isTaxExempt')),
                    isPhysical=parse_bool(data.get('isPhysical')),
                    locallyMade=parse_bool(data.get('locallyMade')),
                    isNew=(condition == 'isNew'),
                    isRefurbished=(condition == 'isRefurbished'),
                    isSecondHand=(condition == 'isSecondHand'),
                    isUsable=True,
                    
                    # Images (Mapped sequentially based on list length)
                    primaryImage=images[0] if len(images) > 0 else None,
                    seconaryImage_one=images[1] if len(images) > 1 else None,
                    seconaryImage_two=images[2] if len(images) > 2 else None,
                    seconaryImage_three=images[3] if len(images) > 3 else None,
                    seconaryImage_four=images[4] if len(images) > 4 else None,
                )

                # 5. Manually trigger model validations
                product.full_clean() 
                print("\n\n===================GOOD6")

                # 6. Save to database
                product.save()
                print("\n\n===================GOOD7")

            return Response({
                "message": "Product successfully onboarded.",
                "product_id": product.unique_id
            }, status=status.HTTP_201_CREATED)
            
            print("\n\n===================GOOD8")

        except DjangoValidationError as e:
            return Response({
                "error": "Validation Failed", 
                "details": e.message_dict if hasattr(e, 'message_dict') else e.messages
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except ValueError as e:
            return Response({
                "error": "Invalid Data Type", 
                "details": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                "error": "Internal Server Error", 
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




            
