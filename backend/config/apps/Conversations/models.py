from django.db import models
from django.conf import settings
# Create your models here.



import uuid
from django.db import models


class Conversation(models.Model):
    """
    Matches the TypeScript 'Conversation' interface.
    Using UUIDs makes it highly compatible with frontend client-side transitions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    title = models.CharField(max_length=255, default="New Chat")
    pinned = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    is_protected = models.BooleanField(default=False, db_column="protected")
    created_at = models.BigIntegerField()
    updated_at = models.BigIntegerField()
    class Meta:
        ordering = ['-updated_at']


    def save(self, *args, **kwargs):
        import time
        current_epoch = int(time.time() * 1000)
        if not self.created_at:
            self.created_at = current_epoch
        self.updated_at = current_epoch
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.id})"





class Message(models.Model):
    """
    Matches the TypeScript 'Message' interface.
    """
    SENDER_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
        ('sokoAI', 'SokoAI'),
    ]


    MESSAGE_TYPE_CHOICES = [
        ('success', 'Success'),
        ('inquiry', 'Inquiry'),
        ('error', 'Error'),
        ('followup', 'Followup'),
        ('response', 'Response'),
        ('search', 'Search'),
    ]
    

    SEARCH_TYPE_CHOICES = [
        ("direct_search", "Direct Search"),
        ("intelligent_search", "Intelligent Search"),
        ("direct_filter", "Direct Filter"),
        ("intelligent_filter", "Intelligent Filter"),
        ("direct_followup", "Direct Followup"),
        ("intelligent_followup", "Intelligent Followup"),
    ]
    

    RESPONSE_TYPE_CHOICES = [
        ("direct_response", "Direct Response"),
        ("intelligent_response", "Intelligent Response"),
        ("direct_followup", "Direct Followup"),
        ("intelligent_followup", "Intelligent Followup"),
        ("direct_inquiry", "Direct Inquiry"),
        ("intelligent_inquiry", "Intelligent Inquiry"),
    ]


    id = models.CharField(max_length=100, primary_key=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    text = models.TextField()
    timestamp = models.BigIntegerField()
    
    # Typing Telemetry mapping  exact TS unions
    type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, null=True, blank=True)
    search_type = models.CharField(max_length=30, choices=SEARCH_TYPE_CHOICES, null=True, blank=True)
    response_type = models.CharField(max_length=30, choices=RESPONSE_TYPE_CHOICES, null=True, blank=True)
    streamed = models.BooleanField(default=False)

    # Core engine outputs: handles Product[] structures fluidly via flexible JSON blocks
    products = models.JSONField(default=list, blank=True)
    related_products = models.JSONField(default=list, blank=True, db_column="relatedProducts")

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender}: {self.text[:30]}"