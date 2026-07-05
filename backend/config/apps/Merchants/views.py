# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.db import IntegrityError
from django.db import transaction 
from rest_framework import serializers
import re 
from ..taxonomies.models import Category, Shape,Size,Color,Brand,Tag
import uuid
from rest_framework.validators import ValidationError
from  django.shortcuts import  get_object_or_404
from .models import (
    InternalMerchantProfile,
    MpesaSendMoneyMerchnatPayoutDestination,
    MpesaPaybillMerchnatPayoutDestination,
    MpesaTillMerchnatPayoutDestination,
    BankTransfarMerchnatPayoutDestination,
    MerchantActivityLog
    
    )
from.utils import log_merchant_activity 


from .models import (
    InternalMerchantProfile,
    MerchantStoreBranch,
    MerchantProductCatalog,
    MerchantOrder,
    MerchantPayoutLedger,
    BranchSpecificInventory
)



from .Serializsers import (
    InternalMerchantProfileSerializer,
    MerchantStoreBranchSerializer,
    MerchantProductCatalogSerializer,
    MerchantInventorySerializer,
    MerchantOrderSerializer,
    MerchantPayoutLedgerSerializer,
    MerchantDashboardSerializer
)

from django.db.models import Prefetch, Count





class MerchantOnboardingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def validate_inputs(self, data):
        errors = {}
        PHONE_REGEX = r'^(07|01)\d{8}$'
        KRA_PIN_REGEX = r'^[A-Z]\d{9}[A-Z]$'
        EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        NUMERIC_REGEX = r'^\d+$'

        # 
        if not re.match(PHONE_REGEX, str(data.get("support_phone", '')).strip()):
            errors['supportPhone'] = "Invalid support phone format. Must start with 07 or 01 and be 10 digits."
            
            
        if not re.match(EMAIL_REGEX, str(data.get("accountEmail", '')).strip()):
            errors['accountEmail'] = "Invalid email format."
            
            
        if data.get("bussinessRegisted"):
            tax_pin = str(data.get("taxPin", '')).strip().upper()
            if not re.match(KRA_PIN_REGEX, tax_pin):
                errors['taxPin'] = "Invalid KRA PIN format. Must be 11 characters (Letter, 9 digits, Letter)."


        # 
        payout_method = data.get("payoutMethod")
        
        if payout_method == 'M-Pesa Send Money':
            if not re.match(PHONE_REGEX, str(data.get("accountPhone", '')).strip()):
                errors['accountPhone'] = "Invalid M-Pesa phone number."
                
        elif payout_method == 'M-pesa Paybill':
            if not re.match(NUMERIC_REGEX, str(data.get("payBillNumber", '')).strip()):
                errors['payBillNumber'] = "Paybill must be numeric."
                
            if not data.get("accountNumber"):
                errors['accountNumber'] = "Paybill account number is required."
                
        elif payout_method == 'M-pesa Till':
            if not re.match(NUMERIC_REGEX, str(data.get("accountNumber", '')).strip()):
                errors['accountNumber'] = "Till number must be numeric."
                
                
        elif payout_method == 'Bank Transfer':
            if not data.get("bankName") or not data.get("bankAccountNumber"):
                errors['bankDetails'] = "Bank Name and Account Number are required."
                
        return errors




    def check_integrity(self, user, data):
        errors = {}

        #
        if hasattr(user, 'merchant_profile') or InternalMerchantProfile.objects.filter(vendorOwner=user).exists():
            errors['profile'] = "This user account is already linked to an existing merchant profile."
           
        #
        shop_name = data.get("shopName", '').strip()
        if InternalMerchantProfile.objects.filter(shopName__iexact=shop_name).exists():
            errors['shopName'] = f"The shop name '{shop_name}' already exists. Please choose another."
            
        #
        if data.get("bussinessRegisted"):
            tax_pin = data.get("taxPin", '').strip().upper()
            if tax_pin and InternalMerchantProfile.objects.filter(taxPin__iexact=tax_pin).exists():
                errors['taxPin'] = "A merchant profile with this KRA PIN already exists."
                
        # 
        account_email = data.get("accountEmail", '').strip().lower()
        if InternalMerchantProfile.objects.filter(accountEmail__iexact=account_email).exists():
            errors['accountEmail'] = "This email is already associated with another merchant profile."
        
        #
        support_phone = data.get("support_phone", '').strip()
        if InternalMerchantProfile.objects.filter(accountPhone__iexact=support_phone).exists():
            errors["supportPhone"] = f"The Phone Number {support_phone} is already registered."
                        
        return errors
    
    
    
    

    @transaction.atomic
    def post(self, request):
        data = request.data
        
        #
        required_fields = ['shopName', 'shopCategory', 'accountEmail', 'support_phone', 'payoutMethod', 'shopDescription']
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"'{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        #
        validation_errors = self.validate_inputs(data)
        if validation_errors:
            return Response({"errors": validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        #
        integrity_errors = self.check_integrity(request.user, data)
        if integrity_errors:
            return Response({"errors": integrity_errors}, status=status.HTTP_400_CONFLICT)

        try:
            payout_method = data.get("payoutMethod", '').strip()

            #
            profile_kwargs = {
                "vendorOwner": request.user,
                "shopName": data.get("shopName", '').strip(),
                "shopDescription": data.get("shopDescription", '').strip(),
                "accountEmail": data.get("accountEmail", '').strip().lower(),
                "accountPhone": data.get("support_phone", '').strip(), 
                "shopCategoryPersist": data.get("shopCategory", '').strip(),
                "bussinessRegisted": data.get("bussinessRegisted", False),
                "taxPin": data.get("taxPin", '').strip().upper() if data.get("bussinessRegisted") else None,
                "businessRegistrationNumber": data.get("businessRegistrationNumber", '').strip() if data.get("bussinessRegisted") else None, 
                "payoutMethod": payout_method,
            }

            #
            if payout_method == 'M-Pesa Send Money':
                profile_kwargs["sendMoneyPhone"] = data.get("accountPhone", "").strip()
            elif payout_method == 'M-pesa Paybill':
                profile_kwargs["payBillNumber"] = data.get("payBillNumber", "").strip()
                profile_kwargs["accountNumber"] = data.get("accountNumber", "").strip()
            elif payout_method == 'M-pesa Till':
                profile_kwargs["accountNumber"] = data.get("accountNumber", "").strip()
            elif payout_method == 'Bank Transfer':
                profile_kwargs["bankName"] = data.get("bankName", "").strip()
                profile_kwargs["bankAccountNumber"] = data.get("bankAccountNumber", "").strip()

            merchant = InternalMerchantProfile(**profile_kwargs)
            merchant.save()

       

            #
            log_merchant_activity(
                merchant=merchant,
                action_event="merchant_onboarding",
                category="profile",
                description=f"Merchant {merchant.shopName} successfully onboarded via {payout_method}.",
                request=request,
                severity='info'
            )
            
            user = request.user 
            user.is_merchant = True
            user.save(update_fields=['is_merchant'])
            # user.save()

            return Response({
                "message": "Merchant onboarded successfully", 
                "merchant_id": merchant.unique_id
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"errors": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
        
        
 
#=======================================================================================================


class MerchantProfileDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        inventory_queryset = BranchSpecificInventory.objects.annotate(
            total_products=Count('product_in_inventory')
        )

        profile = get_object_or_404(
            InternalMerchantProfile.objects.prefetch_related(
                'branches',
                Prefetch('branches__branch_inventory', queryset=inventory_queryset),
                "incoming_orders",
                "incoming_orders__merchant_order_item",
                "merchant_mpesa_payout_route", 
                "merchant_mpesa_paybill_payout_route",
                "merchant_mpesa_till_payout_route",
                "merchant_bank_transfar_payout_route",
                "daily_sales_snapshots",
                "activity_logs",
                "merchant_alerts",
                "merchant_notifications",
                "merchant_reviews"
            ), 
            vendorOwner=request.user
        )
        
        serializer = MerchantDashboardSerializer(profile)
        return Response({
            "merchant_profile": serializer.data
        }, status=status.HTTP_200_OK)
        
        
"""""

    def put(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        serializer = InternalMerchantProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            try:
                was_accepting_orders = profile.is_accepting_orders
                updated_profile = serializer.save()
                
                if was_accepting_orders != updated_profile.isAcceptingOrders:
                    log_merchant_activity(
                        merchant=updated_profile,
                        action_event="vacation_mode_toggled",
                        category="profile",
                        description=f"Store order acceptance set to {updated_profile.isAcceptingOrders}",
                        request=request,
                        severity="warning"
                    )
                else:
                    log_merchant_activity(
                        merchant=updated_profile,
                        action_event="profile_updated",
                        category="profile",
                        description="Store parameters updated successfully.",
                        request=request
                    )
                return Response(serializer.data, status=status.HTTP_200_OK)
            except DjangoValidationError as e:
                return Response({"detail": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""



class BranchManagementListCreateView(APIView):
    """
    Lists all regional distribution nodes or appends a brand new physical branch.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        branches = MerchantStoreBranch.objects.filter(merchant=profile)
        serializer = MerchantStoreBranchSerializer(branches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        serializer = MerchantStoreBranchSerializer(data=request.data)
        
        if serializer.is_valid():
            # Force the branch allocation to this authenticated merchant profile
            new_branch = serializer.save(merchant=profile)
            
            log_merchant_activity(
                merchant=profile,
                action_event="branch_node_created",
                category="branch",
                description=f"Added new distribution branch hub: '{new_branch.branch_name}' in {new_branch.city_town}.",
                request=request
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# MODULE B: CATALOG & INVENTORY CONTROL


class ProductCatalogView(APIView):
    """
    Handles listing your products and adding clean new inventory records with automated slugging.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        products = MerchantProductCatalog.objects.filter(merchant=profile)
        serializer = MerchantProductCatalogSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        serializer = MerchantProductCatalogSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                new_product = serializer.save(merchant=profile)
                log_merchant_activity(
                    merchant=profile,
                    action_event="catalog_item_added",
                    category="catalog",
                    description=f"Created product listing: '{new_product.title}' with SKU: {new_product.sku}",
                    request=request,
                    product_uuid=new_product.unique_id
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DjangoValidationError as e:
                return Response({"detail": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



frontEndPayloadStructure = {
'unique_id': 'dd4ed2b6-4d3e-4bf1-b9df-0fcf8c2351f3', 
 'merchant': None,
 'title': 'Shoes',
 'description': 'Air free , running shoes ',
 'category': 'Clothings',
 'brand': 'Nike', 
 'categoryPersist': 'Clothings', 
 'color': None, 
 'size': None, 
 'shape': None, 
 'isNew': True, 
 'isRefurbished': False,
 'slug': 'shoes', 
 'sku': 'CLO-SHO-4955',
 'searchTags': ['shoes', 'free', 'running'], 
 'userAddedSearchTags': [], 
 'originalPrice': 1200, 
 'dealPrice': 1100, 
 'priceChangeRecord': [],
 'priceCompetitionRecord': [],
 'weightKg': 1,
 'isPhysical': True,
 'isTaxExempt': False,
 'primaryImageUrl': 'blob:http://localhost:5175/8916653a-a4c6-4601-a306-9ced04753a9b',
 'secondaryImages': ['blob:http://localhost:5175/6260b783-eb98-4ad7-b9ca-495f2d48f2d0',
                     'blob:http://localhost:5175/90309909-0ee1-4cec-910e-1d79fe2700d5', 
                     'blob:http://localhost:5175/67903651-70b6-465f-a71d-0c4ddd3e2c57'], 
 'isAvailable': True, 
 'clickCount': 0, 
 'minimumStockThreshold': 5, 
 'stockQuantity': 100, 
 'createdAt': '2026-07-03T06:26:09.663Z', 
 'updatedAt': '2026-07-03T06:26:09.663Z'
 }


class ProductCatalogInfillView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        
        if not user.is_merchant or not user.is_merchant_verified:
            return Response(
                {"error": "Your Shop is either inactive, blocked, or you are not registered as a Merchant"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        data = request.data
        
        
        try:
            merchant_profile = get_object_or_404(InternalMerchantProfile, vendorOwner=user)
            category_obj = None
            
            if data.get('category'):
                category_obj, _ = Category.objects.get_or_create(name=data.get('category'))
                
            brand_obj = None
            if data.get('brand'):
                brand_obj, _ = Brand.objects.get_or_create(name=data.get('brand'))
                
            # sku structure 
            # sku-(first three letters of the name/title)-(first three letters of the category)- (first three letters of the brand )
            generated_sku = f"SKU-{str(uuid.uuid4())[:8].upper()}"

            user_added_tags_array = data.get('userAddedSearchTags', [])
            if isinstance(user_added_tags_array, list):
                formatted_user_tags = ",".join(user_added_tags_array)
            else:
                formatted_user_tags = data.get('userAddedSearchTags', '')

            #
            product = MerchantProductCatalog(
                merchant=merchant_profile,
                title=data.get('title'),
                description=data.get('description'),
                category=category_obj,
                brand=brand_obj,
                categoryPersist=data.get('categoryPersist'),
                
                # 
                primaryImageUrl=data.get('primaryImageUrl'), 
                secondaryImages=data.get('secondaryImages', []),
                
                isNew=data.get('isNew', True),
                isRefurbished=data.get('isRefurbished', False),
                originalPrice=data.get('originalPrice'),
                dealPrice=data.get('dealPrice'),
                weightKg=data.get('weightKg'),
                isPhysical=data.get('isPhysical', True),
                isTaxExempt=data.get('isTaxExempt', False),
                isAvailable=data.get('isAvailable', True),
                minimumStockThreshold=data.get('minimumStockThreshold', 5),
                stockQuantity=data.get('stockQuantity', 0),

                sku=generated_sku,
                userAddedsearchTags=formatted_user_tags
            )
            
            product.save()

            # 5. Handle Many-to-Many Fields (Tags) AFTER saving the instance
            search_tags = data.get('searchTags', [])
            if search_tags:
                tag_objs = []
                for tag_name in search_tags:
                    # Assuming Tag model uses 'name'
                    tag_obj, _ = Tag.objects.get_or_create(name=tag_name.lower().strip())
                    tag_objs.append(tag_obj)
                product.searchTags.set(tag_objs)

            return Response({
                "message": "Product onboarded successfully.",
                "product_id": product.unique_id,
                "sku": product.sku,
                "slug": product.slug
            }, status=status.HTTP_201_CREATED)

        except InternalMerchantProfile.DoesNotExist:
            return Response({"error": "Merchant profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError as e:
            error_msg = e.message_dict if hasattr(e, 'message_dict') else list(e.messages)
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
        
        
        
        


class InventoryStockUpdateView(APIView):
    """
    Allows localized updates to a product's stock levels at a specific branch.
    """
    permission_classes = [permissions.IsAuthenticated]
    pass


# ================================================================================================================
# MODULE C: ORDER EXECUTION PIPELINE
# ================================================================================================================

class OrderPipelineProcessingView(APIView):
    """
    Manages order execution transitions. Enforces tracking identifiers upon dispatching.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        orders = MerchantOrder.objects.filter(merchant=profile)
        serializer = MerchantOrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, order_uuid):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        order = get_object_or_404(MerchantOrder, unique_id=order_uuid, merchant=profile)
        
        serializer = MerchantOrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                old_status = order.status
                updated_order = serializer.save()
                
                if old_status != updated_order.status:
                    log_merchant_activity(
                        merchant=profile,
                        action_event=f"order_status_{updated_order.status.lower()}",
                        category="order",
                        description=f"Order mutated state from '{old_status}' to '{updated_order.status}'.",
                        request=request,
                        order_uuid=updated_order.unique_id,
                        severity="info" if updated_order.status != 'CANCELLED' else "warning"
                    )
                return Response(serializer.data, status=status.HTTP_200_OK)
            except DjangoValidationError as e:
                return Response({"detail": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)