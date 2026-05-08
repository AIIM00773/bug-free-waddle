from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from  rest_framework.views import APIView
from django.contrib.auth.models import User
from django.http import JsonResponse
# Create your views here.


class PaymentListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "List of payments"}, status=200)
    

    def post(self, request, *args, **kwargs):
        return Response({"message": "Payment created successfully"}, status=201)
    

    def put(self, request, *args, **kwargs):
        return Response({"message": "Payment updated successfully"}, status=200)
    

    def delete(self, request, *args, **kwargs):
        return Response({"message": "Payment deleted successfully"}, status=200)
    
    
    def patch(self, request, *args, **kwargs):
        return Response({"message": "Payment partially updated successfully"}, status=200)
    

    def head(self, request, *args, **kwargs):
        return Response(status=200)
    

    def options(self, request, *args, **kwargs):
        return Response(status=200)
    

    def trace(self, request, *args, **kwargs):
        return Response(status=200)
 



class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "Payment created successfully"}, status=201)
    
    def get(self, request, *args, **kwargs):
        return Response({"message": "Payment creation endpoint"}, status=200)
    

class PaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        return Response({"message": f"Details of payment with id {pk}"}, status=200)
    
    def put(self, request, pk, *args, **kwargs):
        return Response({"message": f"Payment with id {pk} updated successfully"}, status=200)
    
    def delete(self, request, pk, *args, **kwargs):
        return Response({"message": f"Payment with id {pk} deleted successfully"}, status=200)
    

    def patch(self, request, pk, *args, **kwargs):
        return Response({"message": f"Payment with id {pk} partially updated successfully"}, status=200)
    
    def head(self, request, pk, *args, **kwargs):
        return Response(status=200)
    
    def options(self, request, pk, *args, **kwargs):
        return Response(status=200)
    
    def trace(self, request, pk, *args, **kwargs):
        return Response(status=200)
    

class PaymentListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"message": "List of payments"}, status=200)
    

