# serializers.py
from rest_framework import serializers
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

from .models import (
    InternalMerchantProfile,
    MerchantStoreBranch,
    MerchantProductCatalog,
    MerchantOrder,
    MerchantOrderItem,
    MerchantPayoutLedger,
    MerchantActivityLog,
    BranchSpecificInventory
)

from django.db.models import Count



class MerchantDashboardSerializer(serializers.ModelSerializer):
    # Aggregated fields
    _business_branches = serializers.SerializerMethodField()
    _branch_inventory = serializers.SerializerMethodField()
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
        branches = obj.branches.all()
        return [
            {
                "unique_id": branch.unique_id, 
                "branchName": branch.branchName, 
                "country": branch.country,
                "county": branch.county, 
                "cityTown": branch.cityTown, 
                "isPrimary": branch.isPrimary, 
                "isActive": branch.isActive
            } 
            for branch in branches
        ]

    def get__branch_inventory(self, obj):
        output = []
        for branch in obj.branches.all():
            for inventory in branch.branch_inventory.all():
                output.append({
                    "parrentBranchID": inventory.parrentBranch_id,
                    "inventoryID": inventory.inventoryID,     
                    "inventoryTitle": inventory.inventoryTitle,
                    "inventoryLocked": inventory.inventoryLocked,
                    "totalProducts": getattr(inventory, 'total_products', 0) 
                })
        return output

    def get__gross_net_payout(self, obj):
        # NOTE: If payout_history isn't prefetched in the view, this triggers 1 aggregation query.
        return obj.payout_history.filter(status='COMPLETED').aggregate(
            total_payout=Sum('net_payout_amount')
        )['total_payout'] or 0.00  
        

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
                "sku":product.sku, 
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
        
        
         
    
        
        
        
        
# 1. MERCHANT PROFILE & BRANCH SERIALIZERS



class InternalMerchantProfileSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)
    commissionCutPercent = serializers.DecimalField(max_digits=5, decimal_places=3, read_only=True)
    verificationStatus = serializers.CharField(read_only=True)
    totalActiveListings = serializers.IntegerField(read_only=True)

    class Meta:
        model = InternalMerchantProfile
        exclude = ['vendorOwner']

    def validate_tax_pin(self, value):
        if value:
            cleaned_pin = value.strip().upper()
            if len(cleaned_pin) != 11:
                raise serializers.ValidationError("A valid KRA PIN must be exactly 11 characters long.")
            return cleaned_pin
        return value







class MerchantStoreBranchSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = MerchantStoreBranch
        fields = '__all__'

    def validate(self, data):
        # Coordinates range validation
        lat = data.get('latitude')
        lon = data.get('longitude')
        if lat and not (-90.0 <= lat <= 90.0):
            raise serializers.ValidationError({"latitude": "Latitude must be between -90 and 90 degrees."})
        if lon and not (-180.0 <= lon <= 180.0):
            raise serializers.ValidationError({"longitude": "Longitude must be between -180 and 180 degrees."})
        return data




# 2. CATALOG & INVENTORY SERIALIZERS

class MerchantProductCatalogSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)
    slug = serializers.SlugField(read_only=True)
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = MerchantProductCatalog
        fields = '__all__'

    def validate(self, data):
        # Replicating our business logic check from the model layer
        original_price = data.get('original_price')
        deal_price = data.get('deal_price')
        
        if deal_price > original_price:
            raise serializers.ValidationError({
                "deal_price": "The active selling price cannot be higher than the original retail price."
            })
        return data






class MerchantInventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = BranchSpecificInventory
        fields = '__all__'
        







# 3. ORDER & TRANSACTION EXECUTION SERIALIZERS

class MerchantOrderItemSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = MerchantOrderItem
        fields = '__all__'


class MerchantOrderSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)
    manifest_items = MerchantOrderItemSerializer(many=True, read_only=True)
    
    # Financial snapshots frozen by backend system logic at point of sale
    gross_sales_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    commission_percentage_applied = serializers.DecimalField(max_digits=5, decimal_places=3, read_only=True)
    platform_fee_deducted = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_vendor_payout = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = MerchantOrder
        fields = '__all__'

    def validate(self, data):
        status = data.get('status')
        waybill = data.get('waybill_number')
        
        # Ensure logistics tracking code is enforced upon handover dispatch
        if status == 'DISPATCHED' and not waybill:
            raise serializers.ValidationError({
                "waybill_number": "A logistics tracking reference or rider waybill number is mandatory before dispatching."
            })
        return data







# 4. DISBURSEMENT & AUDIT LOG SERIALIZERS

class MerchantPayoutLedgerSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)
    net_payout_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = MerchantPayoutLedger
        fields = '__all__'


class MerchantActivityLogSerializer(serializers.ModelSerializer):
    unique_id = serializers.UUIDField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = MerchantActivityLog
        fields = '__all__'
        read_only_fields = ['merchant', 'initiated_by', 'category', 'severity', 'action_event', 'description', 'ip_address', 'user_agent', 'location_snapshot']