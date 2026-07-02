# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.shortcuts import get_object_or_404  
from django.db import IntegrityError
from django.db import transaction 
from rest_framework import serializers
import re 
from django.contrib.auth import get_user_model

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
    MerchantInventoryStock,
    MerchantOrder,
    MerchantPayoutLedger
)



from .Serializsers import (
    InternalMerchantProfileSerializer,
    MerchantStoreBranchSerializer,
    MerchantProductCatalogSerializer,
    MerchantInventoryStockSerializer,
    MerchantOrderSerializer,
    MerchantPayoutLedgerSerializer,
    MerchantDashboardSerializer
)




from .utils import log_merchant_activity


""""""""" GUIDES 

MERCHNAT ONBOARDING :
frontend_payload = {
 'shopName': 'ElectroHub Naorobi',
 'shopDescription': 'All electronic essentials ',
 'accountEmail': 'vendor1@gmail.com',
 'support_phone': '0727221106',
 'shopCategory': 'GeneralShop',   # initially we use strings and save to "shopCategoryPersist" field
 'bussinessRegisted': True, 
 'taxPin': 'p051rrt8009505',
 'businessRegistrationNumber': 'BN/2026/40-05950',
 'businessDocument': {},
 'payoutMethod': 'M-Pesa Send Money',  
 'accountPhone': '0727221106',
 'bankName': '',
 'bankAccountNumber': '',
 'payBillNumber': '',
 'accountNumber': ''
 
 }




payment_methords = [ {
        id: "M-Pesa Send Money",
        title: "M-Pesa",
        description: "Receive directly to your phone",
        icon: "📱"
    },
    {
        id: "M-pesa Paybill",
        title: "Paybill",
        description: "Business paybill settlement",
        icon: "🏦"
    },
    {
        id: "M-pesa Till",
        title: "Till Number",
        description: "Receive via Buy Goods",
        icon: "🛒"
    },
    {
        id: "Bank Transfer",
        title: "Bank",
        description: "Direct bank settlement",
        icon: "🏛️"
    }]



"""""




class MerchantOnboardingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def validate_inputs(self, data):
        errors = {}
        # Base Regex
        PHONE_REGEX = r'^(07|01)\d{8}$'
        KRA_PIN_REGEX = r'^[A-Z]\d{9}[A-Z]$'
        EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        NUMERIC_REGEX = r'^\d+$'

        # 1. Base Validations
        if not re.match(PHONE_REGEX, str(data.get("support_phone", '')).strip()):
            errors['support_phone'] = "Invalid support phone format."
        if not re.match(EMAIL_REGEX, str(data.get("accountEmail", '')).strip()):
            errors['accountEmail'] = "Invalid email format."
        if data.get("bussinessRegisted") and not re.match(KRA_PIN_REGEX, str(data.get("taxPin", '')).strip().upper()):
            errors['taxPin'] = "Invalid KRA PIN."

        # 2. Conditional Payout Validations
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
                errors['bank_details'] = "Bank Name and Account Number are required."

        return errors
    
    
    def check_integrity(self, request, data):
        """ Checks for business logic conflicts and existing records. """
        errors = {}

        if InternalMerchantProfile.objects.filter(vendorOwner=request.user).exists():
           errors['profile'] = "This user account is already linked to an existing merchant profile."
           
        shop_name = data.get("shopName", '').strip().upper()
        if InternalMerchantProfile.objects.filter(shopName__iexact=shop_name).exists():
            errors['shopName'] = "A shop with this name already exists Use another name ."
            
        tax_pin = data.get("taxPin", '').strip().upper()
        if data.get("bussinessRegisted") and tax_pin:
            if InternalMerchantProfile.objects.filter(taxPin__iexact=tax_pin).exists():
                errors['taxPin'] = "A merchant profile with this KRA PIN already exists."
                
        account_email = data.get("accountEmail", '').strip().lower()
        if InternalMerchantProfile.objects.filter(accountEmail__iexact=account_email).exists():
            errors['accountEmail'] = "This email is already associated with another merchant profile."
            
        return errors
    
    
    @transaction.atomic
    def post(self, request):
        data = request.data
        
        # Initial presence check (excluding conditional payout fields)
        required_fields = ['shopName', 'shopCategory', 'accountEmail', 'support_phone', 'payoutMethod', 'shopDescription']
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)
            
                    

        # Validate everything
        validation_errors = self.validate_inputs(data)
        if validation_errors:
            return Response({"errors": validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. Integrity Check (Database-level logic)
        integrity_errors = self.check_integrity(request, data)
        if integrity_errors:
            return Response({"errors": integrity_errors}, status=status.HTTP_400_CONFLICT)
    
    
    
        try:
            # 2. Create Merchant Profile
            merchant = InternalMerchantProfile.objects.create(
                vendorOwner=request.user,
                shopName=data.get("shopName", '').strip().upper(),
                shopDescription=data.get("shopDescription", '').strip(),
                accountEmail=data.get("accountEmail", '').strip().lower(),
                support_phone=data.get("support_phone", '').strip(),
                shopCategoryPersist=data.get("shopCategory", '').strip().upper(),
                bussinessRegisted=data.get("bussinessRegisted", False),
                taxPin=data.get("taxPin", '').strip().upper(),
                businessRegistrationNumber=data.get("businessRegistrationNumber", '').strip(),
                payoutMethod=data.get("payoutMethod", '').strip()
            )



            # 3. Create Payout Route based on Payout Method
            payout_method = data.get("payoutMethod")
            
            if payout_method == 'M-Pesa Send Money':
                MpesaSendMoneyMerchnatPayoutDestination.objects.create(
                    merchnat=merchant, phoneNumber=data.get("accountPhone")
                )
            elif payout_method == 'M-pesa Paybill':
                MpesaPaybillMerchnatPayoutDestination.objects.create(
                    merchnat=merchant, 
                    paybillNumber=data.get("payBillNumber"),
                    accountNumber=data.get("accountNumber")
                )
            elif payout_method == 'M-pesa Till':
                MpesaTillMerchnatPayoutDestination.objects.create(
                    merchnat=merchant, tillNumber=data.get("accountNumber") # or relevant field
                )
            elif payout_method == 'Bank Transfer':
                BankTransfarMerchnatPayoutDestination.objects.create(
                    merchnat=merchant, accountNumber=data.get("bankAccountNumber")
                )

            # 4. Log Activity
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
            user.save()
            

            return Response({
                "message": "Merchant onboarded successfully", 
                "merchant_id": merchant.unique_id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        




 
    
# ================================================================================================================
# MODULE A: PROFILE & LOGISTICS NODES
# ================================================================================================================







class MerchantProfileDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch the profile
        profile = get_object_or_404(InternalMerchantProfile.objects.prefetch_related('branches', 'payout_history', "incoming_orders","products", "merchant_alerts","incoming_orders", "reviews") , vendorOwner=request.user)
        serializer = MerchantDashboardSerializer(profile)
        return Response({
            "merchant_profile": serializer.data
        }, status=status.HTTP_200_OK)
        
        

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


class ProductCatalogListCreateView(APIView):
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


class InventoryStockUpdateView(APIView):
    """
    Allows localized updates to a product's stock levels at a specific branch.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, stock_id):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        # Ensure the stock item actually belongs to the calling vendor's ecosystem
        stock_record = get_object_or_404(MerchantInventoryStock, pk=stock_id, product__merchant=profile)
        
        serializer = MerchantInventoryStockSerializer(stock_record, data=request.data, partial=True)
        if serializer.is_valid():
            old_qty = stock_record.quantity_in_stock
            updated_stock = serializer.save()
            
            log_merchant_activity(
                merchant=profile,
                action_event="stock_level_modified",
                category="catalog",
                description=f"Stock for '{updated_stock.product.title}' at branch '{updated_stock.branch.branch_name}' modified from {old_qty} to {updated_stock.quantity_in_stock}.",
                request=request,
                product_uuid=updated_stock.product.unique_id
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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