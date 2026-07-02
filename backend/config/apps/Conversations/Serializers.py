
import time
from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    # Mapping exact naming conventions expected by fronted 
    
    searchType = serializers.CharField(source='search_type', required=False, allow_null=True)
    responseType = serializers.CharField(source='response_type', required=False, allow_null=True)
    relatedProducts = serializers.JSONField(source='related_products', required=False)

    class Meta:
        model = Message
        fields = [ 'id', 'sender', 'text', 'products', 'relatedProducts', 'timestamp', 'type', 'streamed', 'searchType', 'responseType' ]
        
    def to_internal_value(self, data):
        # Gracefully normalizes inbound frontend fields to match backend models
        if 'searchType' in data: 
            data['search_type'] = data.pop('searchType')
            
        if 'responseType' in data:
            data['response_type'] = data.pop('responseType')
            
        if 'relatedProducts' in data:
            data['related_products'] = data.pop('relatedProducts')
            
        return super().to_internal_value(data)





class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    uid = serializers.IntegerField(source='user.id', read_only=True, allow_null=True)
    createdAt = serializers.IntegerField(source='created_at', read_only=True)
    updatedAt = serializers.IntegerField(source='updated_at', read_only=True)
    protected = serializers.BooleanField(source='is_protected', default=False)

    class Meta:
        model = Conversation
        fields = ['id', 'uid', 'pinned', 'completed', 'title', 'messages', 'createdAt', 'updatedAt', 'protected']




class ConversationSummarySerializer(serializers.ModelSerializer):
    """
    Optimized serialization matching  'ConversationSummary' React payload type.
    Drastically minimizes execution times for global structural updates.
    """
    updatedAt = serializers.IntegerField(source='updated_at')
    class Meta:
        model = Conversation
        fields = ['id', 'title', 'updatedAt']
        
        
        