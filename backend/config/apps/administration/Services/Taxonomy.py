

from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from ...taxonomies.models  import   Category, Brand, Size, Color, Weight, Tag, Shape, Country, Currency

from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _




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



class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['unique_id', 'name', 'zip_code', 'is_setup_for_operation']




class CurrencySerializer(serializers.ModelSerializer):
    country = serializers.CharField()

    class Meta:
        model = Currency  # Changed from Brand back to Currency
        fields = [
            'unique_id', 
            'name', 
            'symbol', 
            'code', 
            'country', 
            'is_allowed', 
            'is_base_currency', 
        ]
        read_only_fields = ['unique_id']



    def create(self, validated_data):
        country_uuid = validated_data.pop('country')
        country_obj = get_object_or_404(Country, unique_id=country_uuid)
        currency = Currency.objects.create(country=country_obj, **validated_data)
        
        return currency



class SiteTaxonomiesListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        return Response({
            "categories": CategorySerializer(Category.objects.all(), many=True).data,
            "brands": BrandSerializer(Brand.objects.all(), many=True).data,
            "sizes": SizeSerializer(Size.objects.all(), many=True).data,
            "colors": ColorSerializer(Color.objects.all(), many=True).data,
            "weights": WeightSerializer(Weight.objects.all(), many=True).data,
            "tags": TagSerializer(Tag.objects.all(), many=True).data,
            "shapes": ShapeSerializer(Shape.objects.all(), many=True).data,
            "countries": CountrySerializer(Country.objects.all(), many=True).data,
            "currencies": CurrencySerializer(Currency.objects.all(), many=True).data,
        }, status=status.HTTP_200_OK)
        
        

# Registry maps frontend path strings to backend components
TAXONOMY_REGISTRY = {
    "category": {"model": Category, "serializer": CategorySerializer},
    "brand": {"model": Brand, "serializer": BrandSerializer},
    "size": {"model": Size, "serializer": SizeSerializer},
    "color": {"model": Color, "serializer": ColorSerializer},
    "weight": {"model": Weight, "serializer": WeightSerializer},
    "tag": {"model": Tag, "serializer": TagSerializer},
    "shape": {"model": Shape, "serializer": ShapeSerializer},
    "country": {"model": Country, "serializer": CountrySerializer},
    "currency": {"model": Currency, "serializer": CurrencySerializer},
}






class IsAdminStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)



class TaxonomyCreateViewService(APIView):
    permission_classes = [IsAdminStaff, IsAuthenticated]
    def post(self, request, matrix_type, *args, **kwargs):     
        registry = TAXONOMY_REGISTRY.get(matrix_type.lower())
        if not registry:
            return Response({"error": f"Matrix type '{matrix_type}' is not recognized."}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = registry["serializer"](data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









class TaxonomyUpdateViewService(APIView):
    permission_classes = [IsAdminStaff,IsAuthenticated]
    def put(self, request, matrix_type, unique_id, *args, **kwargs):
        registry = TAXONOMY_REGISTRY.get(matrix_type.lower())
        if not registry:
            return Response(
                {"error": f"Matrix type '{matrix_type}' is not recognized."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        model = registry["model"]
        instance = get_object_or_404(model, unique_id=unique_id)
        data=request.data
        
        
        if data:
            # {'unique_id': 'd6c0efa7-585c-409a-81c7-4953245eedc0', 'name': 'Kenyan shilings', 'symbol': 'sh', 'code': 'KSH', 'country': '13d126dc-0855-4cb4-b886-03c6e4c0f50e', 'is_allowed': True, 'is_base_currency': True}
            instance.name = data.get("name")
            instance.symbol = data.get("symbol")
            instance.code = data.get("code")
            instance.country = Country.objects.get(unique_id= data.get("country"))
            instance.is_allowed = data.get("is_allowed")
            instance.is_base_currency = data.get("is_base_currency")
            
            instance.save()
            serializer = CurrencySerializer(instance, many=False, )
            return Response({"newVersion": serializer.data}, status=status.HTTP_200_OK) 
            
        
        return Response({"error":"Error in updating "}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
class TaxonomyDeleteViewService(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, matrix_type, unique_id, *args, **kwargs):
        registry = TAXONOMY_REGISTRY.get(matrix_type.lower())
        if not registry:
            return Response(
                {"error": f"Matrix type '{matrix_type}' is not recognized."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        model = registry["model"]
        instance = get_object_or_404(model, unique_id=unique_id)
        instance.delete()
        
        return Response(
            {"message": f"Successfully removed node from {matrix_type} pool."}, 
            status=status.HTTP_204_NO_CONTENT
        )
        
        
        
        
        