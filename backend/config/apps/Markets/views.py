from django.shortcuts import render

# Create your views here.
from  rest_framework.response import Response 
from rest_framework.views import APIView

class BaseMarketsView (APIView):
    def get (self,request,*args , **kwargs):
        
        return Response ({"message":"something here"})