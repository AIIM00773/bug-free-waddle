from rest_framework import serializers
from django.contrib.auth import get_user_model
from ...Merchants.models import    InternalMerchantProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .User import IsAdminStaff
from django.shortcuts import get_object_or_404
User = get_user_model()
from rest_framework.pagination import PageNumberPagination
from django.db import transaction



        

class MerchantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "full_name", "email", "phone", "continent" ,
            "country", "country_code", "state","city",
            "timezone_name", "gender","date_of_birth",
            "is_merchant","is_merchant_verified","is_banned",
            "is_suspended","is_blocked","is_email_verified",
            "is_phone_verified","onboarding_completed","created_at",
            "age"
        )    
             
  
   
class merchantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalMerchantProfile
        fields = (
            'unique_id', 'shopName', "shopDescription",
            'accountEmail', "accountPhone", "shopCategoryPersist" ,
            "bussinessRegisted","commissionCutPercent", "isCommissionFree",
            "verified", "payoutMethod", 'verificationStatus', 'owner', 'createdAt'
        )
        
             
        
class MerchantListSerializer(serializers.ModelSerializer):
    owner = MerchantUserSerializer(source='vendorOwner', read_only=True)
    class Meta:
        model = InternalMerchantProfile
        fields = (
            'unique_id', 'shopName', "shopDescription",
            'accountEmail', "accountPhone", "shopCategoryPersist" ,
            "bussinessRegisted","commissionCutPercent", "isCommissionFree",
            "verified", "payoutMethod", 'verificationStatus', 'owner', 'createdAt'
        )
        


class MerchantPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'



class MerchantsFetchView(APIView):
    permission_classes = [IsAdminStaff, IsAuthenticated]
    pagination_class = MerchantPagination

    def get(self, request, *args, **kwargs):
        merchants = InternalMerchantProfile.objects.select_related("vendorOwner").all()
        
        # Paginate the queryset
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(merchants, request)
        
        serializer = MerchantListSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
          
        

class MerchantDetailFetchView(APIView):
    """
    Fetches the full merchant ecosystem: Profile, Branches, Catalog, 
    Payout Routes, and Recent Activity.
    """
    permission_classes = [IsAdminStaff,IsAuthenticated] 

    def get(self, request, *args, **kwargs):
        merchant_id = request.query_params.get('id')
        
        if not merchant_id:
            return Response({"error": "Query parameter 'id' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Fetch the merchant with pre-fetched related data :: We use select_related for OneToOne fields (like payout routes) ::  We use prefetch_related for Many-to-One and Many-to-Many fields
        try:
            merchant = InternalMerchantProfile.objects.select_related(
                'merchant_mpesa_payout_route',
                'merchant_mpesa_paybill_payout_route',
                'merchant_mpesa_till_payout_route',
                'merchant_bank_transfar_payout_route'
            ).prefetch_related(
                'branches',
                'products',
                'activity_logs',
                'payout_history'
            ).get(unique_id=merchant_id)
            
            
        except (InternalMerchantProfile.DoesNotExist, ValueError):
            return Response({"error": "Merchant not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Return ;  When aggregating deeply nested data, a custom  structure is often cleaner than a complex nested serializer.
        data = {
            "profile": {
                "shopName": merchant.shopName,
                "description": merchant.shopDescription,
                "verificationStatus": merchant.verificationStatus,
                "email": merchant.accountEmail,
                "is_verified": merchant.verified,
                "commissionCutPercent": merchant.commissionCutPercent,
                "isCommissionFree": merchant.isCommissionFree,
                "payoutMethod": merchant.payoutMethod,
                "createdAt": merchant.createdAt,
                "updatedAt": merchant.updatedAt,
                
            },
            "payout_routes": {
                "mpesa": merchant.merchant_mpesa_payout_route.phoneNumber if hasattr(merchant, 'merchant_mpesa_payout_route') else None,
                "paybill": merchant.merchant_mpesa_paybill_payout_route.paybillNumber if hasattr(merchant, 'merchant_mpesa_paybill_payout_route') else None,
                "till": merchant.merchant_mpesa_till_payout_route.tillNumber if hasattr(merchant, 'merchant_mpesa_till_payout_route') else None,
                "bank": merchant.merchant_bank_transfar_payout_route.accountNumber if hasattr(merchant, 'merchant_bank_transfar_payout_route') else None,
            },
            "branches": [
                {"name": b.branchName, "city": b.cityTown, "isPrimary": b.isPrimary} 
                for b in merchant.branches.all()
            ],
            "catalog_summary": {
                "total": merchant.products.count(),
                "items": [{"title": p.title, "sku": p.sku} for p in merchant.products.all()[:10]]
            },
            "recent_activity": [
                {"event": a.action_event, "date": a.created_at, "severity": a.severity} 
                for a in merchant.activity_logs.all()[:5]
            ]
        }
        
        return Response(data, status=status.HTTP_200_OK)




class ActivateMerchantView(APIView):
    permission_classes = [IsAdminStaff,IsAuthenticated] 
    
    @transaction.atomic
    def patch(self, request ,*args,**kwargs):
        merchnat_unique_id = request.query_params.get('id')
        if not merchnat_unique_id:
            return Response({"error": "Query parameter 'id' is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        merchant = get_object_or_404(InternalMerchantProfile, unique_id =merchnat_unique_id )
        owner = merchant.vendorOwner 
        owner.is_merchant = True
        owner.is_merchant_verified = True
        
        merchant.verificationStatus = "verified"
        merchant.verified = True
        
        owner.save()
        merchant.save()
        return Response({"message":"Merchnat Activated "}, status=status.HTTP_200_OK)
    
    
    
class DeactivateMerchantView(APIView):
    permission_classes = [IsAdminStaff,IsAuthenticated] 
    
    @transaction.atomic
    def patch(self, request ,*args,**kwargs):
        merchnat_unique_id = request.query_params.get('id')
        if not merchnat_unique_id:
            return Response({"error": "Query parameter 'id' is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        merchant = get_object_or_404(InternalMerchantProfile, unique_id =merchnat_unique_id )
        owner = merchant.vendorOwner 
        owner.is_merchant = True
        owner.is_merchant_verified = False
        merchant.verificationStatus = "unverified"
        merchant.verified = False
        
        owner.save()
        merchant.save()
        return Response({"message":"Merchnat DeActivated "}, status=status.HTTP_200_OK)
    
    

class DeleteMerchantView(APIView):
    permission_classes = [IsAdminStaff,IsAuthenticated] 



    def delete(self, request):
        """
        DELETE /adm/root/api/v1/.../merchants/update/delete
        Removes a merchant store node from the system cleanly.
        """
        merchant_id = request.query_params.get('id')
        if not merchant_id:
            return Response({"error": "Query parameter string key 'id' is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        merchant_profile = get_object_or_404(InternalMerchantProfile, unique_id=merchant_id)
        
        # Optionally safely untag the core User's merchant classification role flag here if needed
        if merchant_profile.vendorOwner:
            user = merchant_profile.vendorOwner
            user.is_merchant = False
            user.save(update_fields=['is_merchant'])
            
        merchant_profile.delete()
        
        return Response({"success": "Profile node unlinked and deleted successfully."}, status=status.HTTP_200_OK)
    
    
    
    
    
    
    
    
    
    
    
    