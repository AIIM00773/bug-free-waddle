

from rest_framework.serializers import ModelSerializer

from .models import Marketplace


class MarketplaceSerializer(ModelSerializer):
    class Meta:
        model = Marketplace
        fields = "__all_"