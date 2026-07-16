


from datetime import timedelta
from django.utils import timezone
from django.db.models import Prefetch, Count, Sum
from django.shortcuts import get_object_or_404

from rest_framework import serializers, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import InternalMerchantProfile, MerchantInventory
from ..utils.permissions.merchantAuth import IsVerifiedMerchant

# VIEWS ============================================================================

class MerchantProfileDashboardView(APIView):
    permission_classes = [IsVerifiedMerchant] 

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
                "merchant_reviews",
                "payout_history",  # Added to prevent N+1 query in get__gross_net_payout
                "products"         # Added to prevent N+1 query in get__catalog_low_stock_items
            ), 
            vendorOwner=request.user
        )
        
        serializer = MerchantDashboardSerializer(profile)
        return Response({
            "merchant_profile": serializer.data
        }, status=status.HTTP_200_OK)















