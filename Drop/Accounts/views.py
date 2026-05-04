import uuid
import logging
from django.db import transaction
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError

from rest_framework import status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, Conversation, ConversationHistory,SearchState
from .services import get_personalized_welcome

logger = logging.getLogger('django.security')

from Processors.Services.init import  Processor
from Processors.types import SearchContext






# ============================================================
# SERIALIZERS
# ============================================================


# 1
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        fields = [
            'profile_uuid', 'username', 'email', 'profile_pic',
            'bio', 'user_age', 'gender', 'contact_number',
            'location', 'shipping_addresses', 'is_merchant', 'created_at',
        ]
        read_only_fields = ['profile_uuid', 'is_merchant', 'created_at']




# 2
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']




# 3
class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default='Kenya')
    city = serializers.CharField(max_length=100, default='Nairobi')
    # Optional fields for profile logic
    phone = serializers.CharField(required=False, allow_blank=True)
    area = serializers.CharField(required=False, allow_blank=True)
    street = serializers.CharField(required=False, allow_blank=True)
    landmark = serializers.CharField(required=False, allow_blank=True)




# 3
class UserConversationHistorySerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = ConversationHistory
        fields = "__all__"





# 4
class ConversationSerializer(serializers.ModelSerializer):
    # 'source=history' matches the related_name in Conversation History  model
    conversationHistory = UserConversationHistorySerializer(many=True, read_only=True, source='history')
    
    class Meta:
        model = Conversation
        fields = [
            'conversationId', 
            'title', 
            'is_pinned', 
            'conversationHistory', 
            'last_update'
        ]



# 5 
class SearchStateSerializer (serializers.ModelSerializer):
    class Meta:
        model = SearchState
        fields ="__all__"













# --- Auth Views ---

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        logger.info(f"Signup attempt: {data['email']}")

        if User.objects.filter(username=data['email']).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
        )

        UserProfile.objects.create(
            user=user,
            display_name=data['first_name'],
            metadata={'country': data['country'], 'city': data['city']},
            shipping_addresses=[{
                'id': str(uuid.uuid4()),
                'full_name': f"{data['first_name']} {data['last_name']}",
                'phone_number': data.get('phone', ""),
                'city': data['city'],
                'area': data.get('area', ""),
                'street': data.get('street', ""),
                'landmark': data.get('landmark', ""),
                'is_default': True,
            }],
            location={
                'Country': data['country'],
                'City': data['city'],
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)






class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        user = authenticate(username=email, password=password)
        
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({"error": "Account deactivated"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)}
        })






# --- Profile & Utility Views ---

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user.profile)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user.profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)




class GetBasics(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = self.request.auser
        return Response({"note": get_personalized_welcome(request.user)}, status=status.HTTP_200_OK)








# --- Conversation Views ---

class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user).order_by('-last_update')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)


    def delete(self, request):
        conv_id = request.data.get('conversationId')
        try:
            conversation = Conversation.objects.get(conversationId=conv_id, user=request.user)
            conversation.delete()
            return Response({"message": "Deleted"}, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)






class UpdateStreamStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        conv_id = request.data.get('conversationId')

        try:
            msg = ConversationHistory.objects.get(
                conversation__conversationId=conv_id, 
                conversation__user=request.user
            )
            msg.has_been_streamed = True
            msg.save()
            return Response({"status": "updated"})
        except ConversationHistory.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)








"""
Search Views
============

Production-ready DRF views integrated with the AI-native search engine.

Features:
- clean architecture
- transactional safety
- proper exception handling
- structured AI responses
- scalable search orchestration
- conversation persistence
- future AI compatibility
"""












# ============================================================
# NEW SEARCH
# ============================================================

class PerformNewSearchView(APIView):
    """
    Starts a completely new AI search conversation.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        query_text = (
            request.data.get("text", "")
            .strip()
        )

        filters = request.data.get(
            "filters",
            [],
        )

        logger.info(
            "New search initiated by user=%s query='%s'",
            request.user.email, 
            query_text,
        )


        try:

            # ------------------------------------------------
            # VALIDATION
            # ------------------------------------------------

            if not query_text:

                return Response(
                    {
                        "error": (
                            "Search query cannot be empty."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            


            # ------------------------------------------------
            # AI SEARCH EXECUTION
            # ------------------------------------------------

            if (SearchContext and query_text):
                SearchContext.raw_query = query_text
                SearchContext.filters = filters

                search_response = Processor.run(SearchContext)
            # search_response = (search_engine.initiate(query=query_text,filters=filters,))





            # ------------------------------------------------
            # DATABASE TRANSACTION
            # ------------------------------------------------

            with transaction.atomic():

                # Create conversation

                conversation = (
                    Conversation.objects.create(
                        user=request.user,
                        title=query_text[:50],
                    )
                )


                # Store conversation history

                ConversationHistory.objects.create(
                    conversation=conversation,

                    user_query={"text": query_text,"filters": filters,},

                    agent_response={ "type": search_response.return_type,"message": (search_response.ai_message),

                        "products": (search_response.search_results ),

                        "related_results": ( search_response.related_results ),

                        "alternatives": (
                            search_response.alternatives
                        ),

                        "suggestions": (
                            search_response.suggestions_list
                        ),

                        "nearest_matches": (
                            search_response.nearest_matches
                        ),

                        "filter_reasons": (
                            search_response.filter_reasons
                        ),

                        "metadata": (
                            search_response.metadata
                        ),
                    },
                )


                # ------------------------------------------------
                # Create Conversation Teacking State  
                # ------------------------------------------------

                # ConversationState = SearchState.objects.create(conversation = Conversation )
                
            

                logger.info(
                    "Conversation created successfully. id=%s",
                    conversation.conversationId,
                )



                return Response(
                    ConversationSerializer(conversation).data,
                    status=status.HTTP_201_CREATED,
                )







        except ValidationError as error:

            logger.warning( "Validation error during search: %s", str(error), )

            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )



        except Exception as error:

            logger.exception("Critical error during new search.")

            return Response(
                {
                    "error": ( "An unexpected error occurred." ),
                    "details": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )












# ============================================================
# REFINED / FOLLOW-UP SEARCH
# ============================================================

class RefinedSearch(APIView):

    """
    Handles:
    - follow-up queries
    - conversational refinement
    - filtering
    - extended AI search interactions
    """


    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        logger.info(
            "Refined search request received."
        )

        conversation_id = request.data.get(
            "conversationId"
        )

        search_query = (
            request.data.get("text", "")
            .strip()
        )

        filters = request.data.get(
            "filters",
            {},
        )

        try:

            # ------------------------------------------------
            # VALIDATION
            # ------------------------------------------------

            if not conversation_id:

                return Response(
                    {
                        "error": (
                            "conversationId is required."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ------------------------------------------------
            # FETCH CONVERSATION
            # ------------------------------------------------

            conversation = (
                Conversation.objects.get(
                    conversationId=conversation_id,
                    user=request.user,
                )
            )

            logger.info(
                "Conversation found: %s",
                conversation_id,
            )

            # ------------------------------------------------
            # AI SEARCH EXECUTION
            # ------------------------------------------------


            search_response = Processor.run(SearchContext)
            


            # ------------------------------------------------
            # TRANSACTION
            # ------------------------------------------------

            with transaction.atomic():

                # Mark older messages streamed

                ConversationHistory.objects.filter(
                    conversation=conversation
                ).update(
                    has_been_streamed=True
                )

                # Save new refinement message

                new_message = (
                    ConversationHistory.objects.create(

                        conversation=conversation,

                        user_query={
                            "text": search_query,
                            "filters": filters,
                        },

                        agent_response={
                            "type": (
                                search_response.return_type
                            ),

                            "message": (
                                search_response.ai_message
                            ),

                            "products": (
                                search_response.search_results
                            ),

                            "related_results": (
                                search_response.related_results
                            ),

                            "alternatives": (
                                search_response.alternatives
                            ),

                            "suggestions": (
                                search_response.suggestions_list
                            ),

                            "nearest_matches": (
                                search_response.nearest_matches
                            ),

                            "filter_reasons": (
                                search_response.filter_reasons
                            ),

                            "metadata": (
                                search_response.metadata
                            ),
                        },
                    )
                )

                logger.info(
                    "Refined search stored successfully."
                )

                return Response(
                    UserConversationHistorySerializer(
                        new_message
                    ).data,
                    status=status.HTTP_201_CREATED,
                )

        except Conversation.DoesNotExist:

            logger.warning(
                "Conversation not found. id=%s",
                conversation_id,
            )

            return Response(
                {
                    "error": (
                        "Conversation session not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as error:

            logger.exception(
                "Critical error during refined search."
            )

            return Response(
                {
                    "error": (
                        "An unexpected error occurred."
                    ),
                    "details": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )