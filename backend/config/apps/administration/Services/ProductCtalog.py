from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .User import IsAdminStaff
from ...Merchants.models import MerchantProductCatalog


class MerchantProductCatalogSerializer(ModelSerializer):
    class Meta:
        model = MerchantProductCatalog
        fields = "__all__"







class BaseMerchantProductCatalogView(APIView):
    permission_classes = [IsAuthenticated, IsAdminStaff]
    
    def get(self, request, *args, **kwargs):
        """
        Retrieves the entire product catalog data matrix.
        """
        queryset = MerchantProductCatalog.objects.all()
        serializer = MerchantProductCatalogSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    
    def post(self, request, *args, **kwargs):
        """
        Ingests a new product into the merchant inventory catalog system.
        """
        if not request.data:
            return Response(
                {"error": "Empty payload context payload rejected."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = MerchantProductCatalogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Product state successfully synchronized to catalog database.",
                    "data": serializer.data
                }, 
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "error": "Pipeline integrity breakdown: invalid product structural attributes.",
                "details": serializer.errors
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )







class MerchantProductCatalogDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminStaff]

    def get_object(self, product_id):
        """
        Helper method to safely isolate and retrieve a specific product state 
        or trigger a standard API 404 handler fallback.
        """
        return get_object_or_404(MerchantProductCatalog, unique_id=product_id)


    def get(self, request, product_id, *args, **kwargs):
        """
        Retrieves contextual records for a specific product entity.
        """
        product_id = request.query_params.get("product_id")
        
        product = self.get_object(product_id)
        serializer = MerchantProductCatalogSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)





    def put(self, request, *args, **kwargs):
        """
        Performs a full mutation/update on a specific product model payload.
        """
        product_id = request.query_params.get("product_id")
        product = self.get_object(product_id)
        
        if not request.data:
            return Response(
                {"error": "Empty payload context payload rejected."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Passing the isolated instance alongside the incoming data triggers standard update validation
        serializer = MerchantProductCatalogSerializer(product, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": f"Product {product_id} state updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "error": "Pipeline integrity breakdown: mutation validation failure.",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )





    def delete(self, request, *args, **kwargs):
        """
        Purges a specific product record out of the inventory matrix.
        """
        
        product_id = request.query_params("product_id")
        product = self.get_object(product_id)
        product.delete()
        
        
        return Response(
            {"message": f"Product {product.title} successfully purged from storage matrix."},
            status=status.HTTP_200_OK # Or HTTP_24_NO_CONTENT depending on front-end event hook design
        )