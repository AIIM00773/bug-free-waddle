from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

# Create your views here.

class MerchantListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "List of merchants"}, status=200)
    

class MerchantCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "Merchant created successfully"}, status=201)
    
    def get(self, request, *args, **kwargs):
        return Response({"message": "Merchant creation endpoint"}, status=200)
    

class MerchantDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"message": "Merchant details"}, status=200)
    
    def put(self, request, *args, **kwargs):
        return Response({"message": "Merchant updated successfully"}, status=200)
    
    def delete(self, request, *args, **kwargs):
        return Response({"message": "Merchant deleted successfully"}, status=200)
    
    

class MerchantUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        return Response({"message": "Merchant partially updated successfully"}, status=200)
    

class MerchantDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return Response({"message": "Merchant deleted successfully"}, status=200)
    