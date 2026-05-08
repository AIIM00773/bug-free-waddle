from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from rest_framework import status
# Create your views here.



class ConversationListView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "List of conversations"}, status=status.HTTP_200_OK)
    


class ConversationHistoryView(generics.RetrieveAPIView):
    def get(self, request, conversation_id, *args, **kwargs):
        return Response({"message": f"History of conversation {conversation_id}"}, status=status.HTTP_200_OK)
    


class ConversationCreateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        return Response({"message": "Conversation created"}, status=status.HTTP_201_CREATED)



class ConversationDeleteView(generics.DestroyAPIView):
    def delete(self, request, conversation_id, *args, **kwargs):
        return Response({"message": f"Conversation {conversation_id} deleted"}, status=status.HTTP_204_NO_CONTENT)
    

    
class MessageCreateView(generics.CreateAPIView):
    def post(self, request, conversation_id, *args, **kwargs):
        return Response({"message": f"Message added to conversation {conversation_id}"}, status=status.HTTP_201_CREATED)
    
