from django.shortcuts import render
from rest_framework import generics, permissions
from  rest_framework import status
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        return Response({"message": f"Search results for query: {query}"}, status=200)
    

    def post(self, request, *args, **kwargs):
        query = request.data.get("q", "")
        return Response({"message": f"Search results for query: {query}"}, status=200)
    

    def put(self, request, *args, **kwargs):
        query = request.data.get("q", "")
        return Response({"message": f"Search results for query: {query}"}, status=200)
    

    def delete(self, request, *args, **kwargs):
        query = request.data.get("q", "")
        return Response({"message": f"Search results for query: {query}"}, status=200)
    

    def patch(self, request, *args, **kwargs):
        query = request.data.get("q", "")
        return Response({"message": f"Search results for query: {query}"}, status=200)
    

    def head(self, request, *args, **kwargs):
        return Response(status=200)
    

    def options(self, request, *args, **kwargs):
        return Response(status=200)
    
    
    def trace(self, request, *args, **kwargs):
        return Response(status=200)
    