from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet

#Initialize the router
router = DefaultRouter()

#Register  ViewSet;  This single registration handles list, create, retrieve, update, destroy, messages, and clear!
router.register(r'conversations', ConversationViewSet, basename='conversations')

#Include the generated router URLs
urlpatterns = [
    path('', include(router.urls)),
]