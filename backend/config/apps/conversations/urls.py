

from django.urls import path, include
from .views import (
     ConversationListView,
     ConversationHistoryView, 
     ConversationCreateView, 
     ConversationDeleteView,
     MessageCreateView
)
urlpatterns = [
    path("conversations/get/all/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/get/<str:conversation_id>/", ConversationHistoryView.as_view(), name="conversation-history"),
    path("conversations/create/new/", ConversationCreateView.as_view(), name="conversation-create"),
    path("conversations/update/<str:conversation_id>/", ConversationHistoryView.as_view(), name="conversation-update"),
    path("conversations/delete/<str:conversation_id>/", ConversationDeleteView.as_view(), name="conversation-delete"),
    path("messages/push/new/<str:conversation_id>/", MessageCreateView.as_view(), name="conversation-message-push"),
    ]