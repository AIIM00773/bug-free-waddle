from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated,BasePermission
from django.db import transaction
from django.contrib.auth import get_user_model

User = get_user_model()





          

# ===========================================PLATFORM USERS DATABASE MANAGEMENT =================================================
class IsAdminStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class PlatformUserNodeSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='unique_uuid', read_only=True)
    maskedEmail = serializers.SerializerMethodField()
    clearTextEmailProxy = serializers.EmailField(source='email')
    accountRole = serializers.SerializerMethodField()
    accountStatus = serializers.SerializerMethodField()
    totalAlertsConfigured = serializers.IntegerField(default=0, read_only=True) 

    class Meta:
        model = User
        fields = [
            "id", "username", "phone", "country", "gender", "date_joined",
            "clearTextEmailProxy", "maskedEmail", "accountRole", "accountStatus", "totalAlertsConfigured"
        ]

    def get_maskedEmail(self, obj):
        if not obj.email or '@' not in obj.email:
            return "******@anonymous.internal"
        name, domain = obj.email.split('@')
        visible = name[:3]
        return f"{visible}.*******@{domain}"




    def get_accountRole(self, obj):
        if obj.is_superuser:
            return 'system_developer'
        if obj.is_staff:
            return 'moderator_admin'
        return 'standard_user'



    def get_accountStatus(self, obj):
        if getattr(obj, 'is_banned', False) or getattr(obj, 'is_suspended', False) or getattr(obj, 'is_blocked', False):
            return 'suspended_breach'
        if not getattr(obj, 'is_merchant_verified', True):
            return 'pending_verification'
        return 'active'
    
    
    
    

class UsersDirectoryService(APIView):
    permission_classes = [IsAuthenticated, IsAdminStaff] 
    
    def get(self, request, *args, **kwargs):
        users_set = User.objects.all().order_by('-date_joined')
        serialized = PlatformUserNodeSerializer(users_set, many=True)
        return Response({"users": serialized.data}, status=status.HTTP_200_OK)



    def post(self, request, *args, **kwargs):
        payload = request.data
        email = payload.get('clearTextEmailProxy', '').strip().lower()
        username = payload.get('username', email.split('@')[0]) 
        
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"error": f"Data Integrity Exception: Email '{email}' already registers an active identity link."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_role = payload.get('accountRole', 'standard_user')
        is_staff = target_role in ['moderator_admin', 'system_developer']
        is_superuser = (target_role == 'system_developer')

        target_status = payload.get('accountStatus', 'active')
        is_suspended = (target_status == 'suspended_breach')


        try:
            with transaction.atomic():
                new_user = User.objects.create(
                    username=username,
                    email=email,
                    phone=payload.get('phone', ''),
                    country=payload.get('country', ''),
                    gender=payload.get('gender', ''),
                    is_staff=is_staff,
                    is_superuser=is_superuser,
                    is_suspended=is_suspended,
                    is_active=not is_suspended 
                )
                new_user.set_unusable_password() 
                new_user.save()

            serialized = PlatformUserNodeSerializer(new_user)
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Failed to populate identity database mapping: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)





    def put(self, request, pk=None, *args, **kwargs):
        if not pk:
            return Response({"error": "Target unique_uuid identity parameter required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_node = get_object_or_404(User, unique_uuid=pk)
        payload = request.data

        # GUARDRAIl
        if user_node.is_superuser:
            if 'accountStatus' in payload and payload.get('accountStatus') == 'suspended_breach':
                return Response(
                    {"error": "Security Guardrail Exception: Core engineering accounts cannot be modified to suspended workflows."},
                    status=status.HTTP_403_FORBIDDEN
                )

        if 'accountRole' in payload:
            role = payload.get('accountRole')
            user_node.is_superuser = (role == 'system_developer')
            user_node.is_staff = role in ['moderator_admin', 'system_developer']

        if 'accountStatus' in payload:
            status_token = payload.get('accountStatus')
            is_suspended = (status_token == 'suspended_breach')
            user_node.is_suspended = is_suspended
            user_node.is_banned = is_suspended
            user_node.is_blocked = is_suspended
            user_node.is_active = not is_suspended

        user_node.save()
        serialized = PlatformUserNodeSerializer(user_node)
        return Response(serialized.data, status=status.HTTP_200_OK)







    def delete(self, request, pk=None, *args, **kwargs):
        if not pk:
            return Response({"error": "Target unique_uuid identity parameter required."}, status=status.HTTP_400_BAD_REQUEST)
            
        user_node = get_object_or_404(User, unique_uuid=pk)
        
        # GUARDRAIL
        if user_node.is_superuser:
            return Response(
                {"error": "Fatal Security Overwrite Prevention: Cannot purge an active Core Engineer node from the live registry."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        user_node.delete()
        return Response({"message": "User node permanently deleted from core registry system."}, status=status.HTTP_200_OK)
    
    
    
   