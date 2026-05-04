from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Merchant

class MerchantSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    county = serializers.StringRelatedField()
    subcounty = serializers.StringRelatedField()
    street = serializers.StringRelatedField()

    class Meta:
        model = Merchant
        fields = [
            'id',
            'title',
            'slug',
            'bio',
            'phone',
            'email',
            'address',
            'country',
            'county',
            'subcounty',
            'street',
            'coordinates',
            'is_active',
            'is_verified',
        ]


class MerchantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ['title', 'phone', 'email', 'bio', 'address', 'country', 'county', 'subcounty', 'street', 'coordinates']


class MerchantListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        merchants = Merchant.objects.filter(is_active=True, is_verified=True)
        serializer = MerchantSerializer(merchants, many=True)
        return Response(serializer.data)


class MerchantDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        merchant = get_object_or_404(Merchant, pk=pk)
        serializer = MerchantSerializer(merchant)
        return Response(serializer.data)


class MerchantRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not hasattr(request.user, 'profile'):
            return Response({'error': 'User profile required before merchant registration.'}, status=status.HTTP_400_BAD_REQUEST)

        if hasattr(request.user, 'merchant_profile'):
            return Response({'error': 'Merchant profile already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MerchantCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Merchant.objects.filter(email=serializer.validated_data['email']).exists():
            return Response({'error': 'A merchant with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        merchant = serializer.save(user=request.user, is_active=False, is_verified=False)
        request.user.profile.is_merchant = True
        request.user.profile.save()
        return Response(MerchantSerializer(merchant).data, status=status.HTTP_201_CREATED)
