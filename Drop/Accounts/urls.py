from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignupView, 
    LoginView, 
    ProfileView, 
    GetBasics, 
    ConversationListView, 
    UpdateStreamStatusView, 
    PerformNewSearchView,
    RefinedSearch
)

urlpatterns = [
    # --- JWT Authentication ---
    # LoginView handles token generation, but you can keep these for standard JWT flow
    path('auth/api/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # --- User & Auth ---
    path('auth/user-signup/', SignupView.as_view(), name='user-signup'),
    path('auth/user-login/', LoginView.as_view(), name='user-login'),
    path("auth/validate/", GetBasics.as_view(), name='welcome-note'),




    # --- Profile Management ---
    # Consolidated Detail and Update into one View (GET for detail, PATCH for update)
    path('auth/user-profile/', ProfileView.as_view(), name='profile-detail-update'),

    # --- Conversations History ---
    # Handles both GET (fetch all) and DELETE (remove one)
    path("conversations/", ConversationListView.as_view(), name='conversation-list'),
    
    # Update whether a specific message in a conversation has finished streaming
    path("conversations/update-stream/", UpdateStreamStatusView.as_view(), name='update-stream'),

    # --- Search & AI Queries ---
    path("conversations/new/", PerformNewSearchView.as_view(), name='new-search'),
    path("conversations/refine/", RefinedSearch.as_view(), name='refined-search'),
]