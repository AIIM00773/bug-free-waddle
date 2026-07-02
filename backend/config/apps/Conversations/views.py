import time
import uuid
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ModelSerializer
from .models import Conversation, Message
from ..Merchants.models import MerchantProductCatalog 

from .Serializers import (
    ConversationSerializer, 
    ConversationSummarySerializer, 
    MessageSerializer
)


class ProductSerializer (ModelSerializer):
    class Meta:
        model = MerchantProductCatalog
        fields = "__all__"



class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()

    
    def get_serializer_class(self):
        if self.action == 'list':
            return ConversationSummarySerializer
        return ConversationSerializer
    
    def get_queryset(self):
        """Keeps data scopes completely isolated to the logged-in user."""
        return self.queryset.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        POST /public/api/v1/conversations/
        Handles the initialization payload sent by client.
        """
        
        print("\n\n REQUEST REACHED THE CLASS \n\n\n")

        data = request.data
        client_msg_data = data.get('clientUserMessage', {})
        search_type = data.get('searchType', 'direct_search')
        
        raw_text = client_msg_data.get('text', 'New Chat') or 'New Chat'
        title_text = raw_text[:20]

        # 1. Initialize core conversation shell
        conversation = Conversation.objects.create(
            user=request.user,
            title=title_text
        )

        # 2. Record incoming message instance
        Message.objects.create(
            id=client_msg_data.get('id', f"server-msg-{uuid.uuid4()}"),
            conversation=conversation,
            sender=client_msg_data.get('sender', 'user'),
            text=raw_text,
            timestamp=client_msg_data.get('timestamp', int(time.time() * 1000)),
            type=client_msg_data.get('type', 'search'),
            search_type=search_type
        )

        # 3. Process merchant database recommendations
        products = MerchantProductCatalog.objects.all()[:10]
        products_serialized = ProductSerializer(products, many=True)
        
        Message.objects.create(
            id=f"ai-resp-{uuid.uuid4()}",
            conversation=conversation,
            sender='sokoAI',
            text=f"I am processing your query for '{raw_text}' via {search_type}.",
            timestamp=int(time.time() * 1000) + 50,
            type='response',
            products=products_serialized.data
        )

        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)






    @action(detail=True, methods=["GET"], url_path="conversation_history")
    def individual_conversation(self, request, pk=None):
        """
        GET /public/api/v1/conversations/<pk>/conversation_history/
        Retrieves a single whole conversation with its history safely scoped to the user.
        """
        # self.get_object() automatically applies get_queryset() filters and handles 404
        conversation = self.get_object()
        serialized = ConversationSerializer(conversation, many=False)
        return Response({"conversation": serialized.data}, status=status.HTTP_200_OK)



    @action(detail=True, methods=['post'], url_path='messages')
    def append_message(self, request, pk=None):
        """
        POST /public/api/v1/conversations/<pk>/messages/
        Saves user and AI entries to DB, but returns ONLY the AI response.
        """
        conversation = self.get_object()
        text = request.data.get('text')

        if not text:
            return Response({"error": "Payload text block cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Save User Message to Database
        Message.objects.create(
            id=f"user-msg-{uuid.uuid4()}",
            conversation=conversation,
            sender='user',
            text=text,
            timestamp=int(time.time() * 1000),
            type='followup'
        )
        
        # 2. Get Merchant Data & Create AI Message
        products = Product.objects.all()[:10]
        products_serialized = ProductSerializer(products, many=True)
        
        ai_msg = Message.objects.create(
            id=f"ai-follow-{uuid.uuid4()}",
            conversation=conversation,
            sender='sokoAI',
            text=f"Followup received: parsing deeper options for '{text}'",
            timestamp=int(time.time() * 1000) + 50,
            type='response',
            products=products_serialized.data,
        )

        # Update the conversation timestamp (Triggers auto_now update if configured)
        conversation.save()
        
        serializer = MessageSerializer(ai_msg)
        return Response(serializer.data, status=status.HTTP_200_OK)



    @action(detail=True, methods=['patch', 'post'], url_path='mark_streamed')
    def mark_streamed(self, request, pk=None):
        """
        PATCH/POST /public/api/v1/conversations/<pk>/mark_streamed/
        Expects body: {"messageId": "some-uuid-string"}
        """
        conversation_instance = self.get_object()
        message_id = request.data.get("messageId")
        
        if not message_id:
            return Response(
                {"error": "Invalid or missing 'messageId' payload variable."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            message = Message.objects.get(id=message_id, conversation=conversation_instance)
            message.streamed = True
            message.save()
            return Response({'status': 'marker updated'}, status=status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response(
                {'error': 'Message scope not discovered or belongs to a different thread.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    
    @action(detail=True, methods=["DELETE"], url_path="delete")
    def delete_conversation(self, request, pk=None):
        """
        DELETE /public/api/v1/conversations/<pk>/delete/
        Safely deletes a specific conversation if it belongs to the logged-in user.
        """
        conversation = self.get_object()
        conversation.delete()
        return Response(
            {"message": "Conversation deleted successfully."}, 
            status=status.HTTP_200_OK
        )
        
    
    
    
    @action(detail=False, methods=['post'], url_path='clear')
    def clear_all(self, request):
        """
        POST /public/api/v1/conversations/clear/
        Flushes all conversation history belonging strictly to the logged-in user.
        """
        self.get_queryset().delete()
        return Response({"status": "Global history sweep completed successfully."}, status=status.HTTP_200_OK)