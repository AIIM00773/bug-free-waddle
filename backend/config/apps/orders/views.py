from django.shortcuts import render
from rest_framework import generics, permissions

from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


class OrderListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "List of orders"}, status=200)
    
    
class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "Order created successfully"}, status=201)
    
    def get(self, request, *args, **kwargs):
        return Response({"message": "Order creation endpoint"}, status=200)
    

class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"message": "Order details"}, status=200)
    
    def put(self, request, *args, **kwargs):
        return Response({"message": "Order updated successfully"}, status=200)
    
    def delete(self, request, *args, **kwargs):
        return Response({"message": "Order deleted successfully"}, status=200)
    
class OrderUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        return Response({"message": "Order partially updated successfully"}, status=200)
    
    
class OrderDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return Response({"message": "Order deleted successfully"}, status=200)