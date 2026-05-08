from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

# views


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return Response({"message": "User registered successfully"}, status=201)
    
    def get (self, request, *args, **kwargs):
        return Response({"message": "User registration endpoint"}, status=200 )
    

    
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        return Response({"message": "User logged in successfully"}, status=200)
    def get(self, request, *args, **kwargs):
        return Response({"message": "User login endpoint"}, status=200)
    



class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        return Response({"message": "User profile data"}, status=200)
    def post(self, request, *args, **kwargs):
        return Response({"message": "User profile updated successfully"}, status=200)
    
        

class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return Response({"message": "User logged out successfully"}, status=200)
    def get(self, request, *args, **kwargs):
        return Response({"message": "User logout endpoint"}, status=200)
    