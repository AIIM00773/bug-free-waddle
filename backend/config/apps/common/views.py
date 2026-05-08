from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

# Create your views here.


class CommonAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "This is a common API view"}, status=status.HTTP_200_OK)
    

class pingAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "ping - pong, you are in the common API view"}, status=status.HTTP_200_OK)
    

    