

  
from rest_framework import serializers
from .models import Product, Category, Brand, Size, Color, Weight, Tag, Shape, Country, Currency
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

class ProductSerializer (serializers.ModelSerializer):
    class Meta:
        model = Product
        fields ="__all__"





class CategorySerializer(serializers.ModelSerializer):
    related_categories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['unique_id', 'name', 'description', 'related_categories']
    def get_related_categories(self, obj):
        return list(obj.related_categories.values_list('unique_id', flat=True))









class BrandSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()
    related_brands = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['unique_id', 'name', 'description', 'categories', 'related_brands']

    def get_categories(self, obj):
        return list(obj.categories.values_list('unique_id', flat=True))

    def get_related_brands(self, obj):
        return list(obj.related_brands.values_list('unique_id', flat=True))











class SizeSerializer(serializers.ModelSerializer):
    unit_symbol = serializers.CharField(default="N/A")

    class Meta:
        model = Size
        fields = ['unique_id', 'name', 'unit_symbol']







class ColorSerializer(serializers.ModelSerializer):
    identity_definnition = serializers.CharField(source='description', default=None, allow_null=True)

    class Meta:
        model = Color
        fields = ['unique_id', 'name', 'identity_definnition', 'hex_code']







class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = ['unique_id', 'unit_name', 'symbol']







class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['unique_id', 'name']





class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = ['unique_id', 'name']





    
    