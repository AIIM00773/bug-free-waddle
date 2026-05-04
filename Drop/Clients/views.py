from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Cart, CartGroup, CartItem



class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    merchant = serializers.CharField(source='item.merchant.title', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'item',
            'item_name',
            'merchant',
            'quantity',
            'price_at_addition',
            'total_price',
        ]
        read_only_fields = ['total_price']

    def get_total_price(self, obj):
        return obj.total_price


class CartGroupSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    group_total = serializers.SerializerMethodField()

    class Meta:
        model = CartGroup
        fields = ['id', 'merchant', 'group_uuid', 'items', 'group_total']

    def get_group_total(self, obj):
        return obj.group_total


class CartSerializer(serializers.ModelSerializer):
    groups = CartGroupSerializer(many=True, read_only=True)
    base_cart_total_cost = serializers.SerializerMethodField()
    final_cart_total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'cart_uuid',
            'is_active',
            'groups',
            'base_cart_total_cost',
            'final_cart_total_cost',
        ]

    def get_base_cart_total_cost(self, obj):
        return obj.base_cart_total_cost

    def get_final_cart_total_cost(self, obj):
        return obj.final_cart_total_cost


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(default=1, min_value=1)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_cart(self, user):
        return Cart.objects.get_or_create(user=user, is_active=True)[0]

    def get(self, request):
        cart = self._get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)



class CartItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(CartItem, pk=pk)

    def patch(self, request, pk):
        cart_item = self.get_object(pk)
        if cart_item.cart_group.cart.user != request.user:
            return Response({'error': 'Unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)

        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({'error': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity)
        if quantity < 1:
            cart_item.delete()
            return Response({'message': 'Item removed from cart.'}, status=status.HTTP_204_NO_CONTENT)

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data)

    def delete(self, request, pk):
        cart_item = self.get_object(pk)
        if cart_item.cart_group.cart.user != request.user:
            return Response({'error': 'Unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)

        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

