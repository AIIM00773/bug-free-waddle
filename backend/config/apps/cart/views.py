from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

# Create your views here.


class CartDetailView(generics.RetrieveAPIView):
    def get(self, request, cart_id, *args, **kwargs):
        return Response({"message": f"Details of cart {cart_id}"}, status=status.HTTP_200_OK)



class CartCreateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        return Response({"message": "Cart created"}, status=status.HTTP_201_CREATED)



class CartUpdateView(generics.UpdateAPIView):
    def put(self, request, cart_id, *args, **kwargs):
        return Response({"message": f"Cart {cart_id} updated"}, status=status.HTTP_200_OK)



class CartDeleteView(generics.DestroyAPIView):
    def delete(self, request, cart_id, *args, **kwargs):
        return Response({"message": f"Cart {cart_id} deleted"}, status=status.HTTP_204_NO_CONTENT)

