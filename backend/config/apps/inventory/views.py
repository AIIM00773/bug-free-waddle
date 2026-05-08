from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
# Create your views here.

class InventoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "List of inventories"}, status=200)
    


class InventoryCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "Inventory created successfully"}, status=201)
    
    def get(self, request, *args, **kwargs):
        return Response({"message": "Inventory  creation endpoint"}, status=200)



class InventoryDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"message": "Inventory  details"}, status=200)
    
    def put(self, request, *args, **kwargs):
        return Response({"message": "Inventory  updated successfully"}, status=200)
    
    def delete(self, request, *args, **kwargs):
        return Response({"message": "Inventory  deleted successfully"}, status=200)



class InventoryUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        return Response({"message": "Inventory  partially updated successfully"}, status=200)



class InventoryDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return Response({"message": "Inventory  deleted successfully"}, status=200)

