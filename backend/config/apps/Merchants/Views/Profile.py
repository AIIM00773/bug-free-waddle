from datetime import timedelta
from django.utils import timezone
from django.db.models import Prefetch, Count, Sum
from django.shortcuts import get_object_or_404

from rest_framework import serializers, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import InternalMerchantProfile, BranchSpecificInventory
from .permissions import IsVerifiedMerchant


# SERIALIZERS =========================================================================

class MerchantDashboardSerializer(serializers.ModelSerializer):
     #Aggregated fields ------------------------------------
     
    _business_branches = serializers.SerializerMethodField()
    _branch_inventories = serializers.SerializerMethodField()
    _gross_net_payout = serializers.SerializerMethodField()
    _gross_sales_today = serializers.SerializerMethodField()
    _awaiting_orders_queue = serializers.SerializerMethodField()
    _catalog_stock_items_overview = serializers.SerializerMethodField()
    _catalog_low_stock_items = serializers.SerializerMethodField()
    _merchant_alerts = serializers.SerializerMethodField()
    _incoming_orders = serializers.SerializerMethodField()
    _incoming_reviews = serializers.SerializerMethodField()

    class Meta:
        model = InternalMerchantProfile
        fields = '__all__' 
    
    def get__business_branches(self, obj):
        return [
            {
                "unique_id": branch.unique_id, 
                "branchName": branch.branchName, 
                "country": branch.country,
                "county": branch.county, 
                "cityTown": branch.cityTown, 
                "isPrimary": branch.isPrimary, 
                "isActive": branch.isActive,
                "operatingHours": branch.operatingHours,
                "managerName": branch.managerName,
                "managerPhone": branch.managerPhone,
                "managerEmail": branch.managerEmail,
            } 
            for branch in obj.branches.all()
        ]

    def get__branch_inventories(self, obj):
        output = []
        for branch in obj.branches.all():
            for inventory in branch.branch_inventory.all():
                output.append({
                    "parrentBranchID": inventory.parrentBranch_id,
                    "inventoryID": inventory.inventoryID,     
                    "inventoryTitle": inventory.inventoryTitle,
                    "inventoryLocked": inventory.inventoryLocked,
                    "totalProducts": getattr(inventory, 'total_products', 0),  
                    "totalInventoryValue": inventory.totalInventoryValue,
                    "lowStockItems": inventory.lowStockItems,
                    "outOfStockItems": inventory.outOfStockItems,
                })
        return output

    def get__gross_net_payout(self, obj):
        result = obj.payout_history.filter(status='COMPLETED').aggregate(
            total_payout=Sum('net_payout_amount')
        )
        return result['total_payout'] or 0.00  

    def get__gross_sales_today(self, obj):
        yesterday = timezone.now() - timedelta(hours=24)
        result = obj.payout_history.filter(processed_at__gte=yesterday).aggregate(
            total_sum=Sum('net_payout_amount')
        )
        return result['total_sum'] or 0.00

    def get__awaiting_orders_queue(self, obj):
        return len([order for order in obj.incoming_orders.all() if order.status == "AWAITING_ALLOCATION"])

    def get__catalog_stock_items_overview(self, obj):
        products = obj.products.all()[:20]
        return [
            {
                "unique_id": product.unique_id, 
                "title": product.title, 
                "category": product.categoryPersist, 
                "currentStock": product.stockQuantity, 
                "minimumStockThreshhold": product.minimumStockThreshhold,   
                "price": product.dealPrice 
            } for product in products
        ]

    def get__catalog_low_stock_items(self, obj):
        low_stock_items = [p for p in obj.products.all() if p.stockQuantity <= 4][:20]
        return [
            {
                "unique_id": product.unique_id,
                "sku": product.sku, 
                "title": product.title, 
                "category": product.categoryPersist, 
                "currentStock": product.stockQuantity, 
                "minimumStockThreshhold": product.minimumStockThreshhold,   
                "price": product.dealPrice 
            } for product in low_stock_items
        ]

    def get__merchant_alerts(self, obj):
        recent_alerts = [a for a in obj.merchant_alerts.all() if not a.Read]
        recent_alerts.sort(key=lambda x: x.created_at, reverse=True)
        return [
            {
                "Type": alert.Type,
                "Priority": alert.Priority,
                "Message": alert.Message,
                "created_at": alert.created_at,
                "Read": alert.Read,
            } for alert in recent_alerts
        ]
        
    def get__incoming_orders(self, obj):
        recent_orders = [o for o in obj.incoming_orders.all() if o.status == 'AWAITING_ALLOCATION']
        recent_orders.sort(key=lambda x: x.createdAt, reverse=True)
        return [
            {
                "unique_id": order.unique_id,
                "order_id": order.order_id,
                "shippingCustomerName": order.shippingCustomerName,
                "branch": order.fulfillmentBranch.branchName if order.fulfillmentBranch else None,
                "gross_sales_amount": order.grossSalesAmount,
                'currency': order.currency,
                "status": order.status,
                "createdAt": order.createdAt,
            } for order in recent_orders[:5]
        ]

    def get__incoming_reviews(self, obj):
        reviews_filtered = [r for r in obj.merchant_reviews.all() if not r.read]
        reviews_filtered.sort(key=lambda x: x.created_at)
        return [
            { 
                "unique_id": review.unique_id, 
                "customer": review.reviewer_name, 
                "ratting": review.rating, 
                "comment": review.comment, 
                "date": review.created_at
            } for review in reviews_filtered
        ]








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















