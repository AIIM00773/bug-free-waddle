from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

# views

class ShippingOptionListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "List of shipping options"}, status=200)

    
class ShippingOptionCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "Shipping option created successfully"}, status=201)
    
    def get(self, request, *args, **kwargs):
        return Response({"message": "Shipping option creation endpoint"}, status=200)
    
    