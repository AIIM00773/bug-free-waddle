import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ...Markets.models import Marketplace, Country, Currency
from .User import IsAdminStaff
from rest_framework.serializers import ModelSerializer



class MarketplaceSerializer(ModelSerializer):
    class Meta:
        model = Marketplace
        fields = "__all__"
        
        

class GetMarketsService(APIView):
    permission_classes = [IsAdminStaff, IsAuthenticated]

    # --------------------------------------------------
    # GET ALL
    # --------------------------------------------------
    def get(self, request, *args, **kwargs):
        markets = Marketplace.objects.all()
        markets_data = MarketplaceSerializer(markets, many=True)
        return Response(
            {"markets": markets_data.data},
            status=status.HTTP_200_OK
        )




    # --------------------------------------------------
    # CREATE
    # --------------------------------------------------
    def post(self, request, *args, **kwargs):

        data = request.data

        if not data:
            
            return Response(
                {"error": "Request payload is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = [
            "title",
            "sku",
            "base_url",
            "base_search_url",
            "region_boundary",
            "currency"
        ]

        missing_fields = []

        for field in required_fields:
            value = data.get(field)

            if value is None or value == "":
                missing_fields.append(field)


        if missing_fields:
            return Response(
                {
                    "error": "Missing required fields.",
                    "missing_fields": missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        title = data.get("title").strip()
        sku = data.get("sku").strip()

        # --------------------------------------------------
        # UNIQUE VALIDATION
        # --------------------------------------------------

        if Marketplace.objects.filter(title=title).exists():
            return Response(
                {"error": f"Marketplace title '{title}' already exists."},
                status=status.HTTP_409_CONFLICT
            )

        if Marketplace.objects.filter(sku=sku).exists():
            return Response(
                {"error": f"Marketplace SKU '{sku}' already exists."},
                status=status.HTTP_409_CONFLICT
            )

        if Marketplace.objects.filter(
            base_url=data.get("base_url")
        ).exists():
            return Response(
                {"error": "Marketplace base_url already exists."},
                status=status.HTTP_409_CONFLICT
            )

        # --------------------------------------------------
        # COUNTRY VALIDATION
        # --------------------------------------------------

        region_value = data.get("region_boundary")

        country = (
            Country.objects.filter(unique_id=region_value).first()
            or Country.objects.filter(name__iexact=region_value).first()
        )

        if not country:
            return Response(
                {
                    "error": "Invalid country supplied.",
                    "region_boundary": region_value
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # --------------------------------------------------
        # CREATE
        # --------------------------------------------------

        try:

            market = Marketplace.objects.create(
                title=title,
                sku=sku,
                base_url=data.get("base_url"),
                base_search_url=data.get("base_search_url"),
                categorised_search_url=data.get(
                    "categorised_search_url"
                ),
                index_output=data.get("index_output"),
                logo_url=data.get("logo_url"),
                is_active=data.get("is_active", False),
                is_suspended=data.get("is_suspended", False),
                is_running=data.get("is_running", False),
            )

            market.region_boundary.add(country)

            return Response(
                {
                    "message": "Marketplace created successfully.",
                    "market_id": market.unique_id
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    "error": "Failed to create marketplace.",
                    "details": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            
            
            
            
            
            
    
            
class UpdateDeleteMarketService(APIView):
    permission_classes = [IsAdminStaff, IsAuthenticated]

    # 1. UPDATE MANUALLY VIA SKU IN BODY
    def put(self, request, *args, **kwargs):
        data = request.data
        market_sku = data.get('sku')

        if not market_sku:
            return Response({"error": "Missing 'sku' identifier in payload body."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Query instance using the SKU string identifier
            market = Marketplace.objects.get(sku=market_sku)
            
            # Update matching database entries manually
            market.is_active = data.get('is_active', market.is_active)
            market.save()

            # Re-map Many-to-Many associations manually if provided
            region_id = data.get('region_boundary')
            if region_id:
                country = Country.objects.filter(unique_id=region_id).first()
                if country:
                    market.region_boundary.set([country])

            currency_code = data.get('currency')
            if currency_code:
                currency = Currency.objects.filter(code=currency_code).first() or Currency.objects.filter(id=currency_code).first()
                if currency:
                    market.currency.set([currency])

            return Response(
                {
                    "message": f"Merchant profile '{market_sku}' modified successfully.",
                    "market": MarketplaceSerializer(market).data
                }, 
                status=status.HTTP_200_OK
            )
        except Marketplace.DoesNotExist:
            return Response({"error": f"No merchant matching SKU '{market_sku}' verified in database."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




    # 2. DELETE MANUALLY VIA SKU IN BODY
    def delete(self, request, *args, **kwargs):
        data = request.data
        market_sku = data.get('sku')

        if not market_sku:
            return Response({"error": "Missing 'sku' identifier in payload body."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            market = Marketplace.objects.get(sku=market_sku)
            market.delete()
            return Response({"message": f"Merchant network map '{market_sku}' dropped successfully."}, status=status.HTTP_200_OK)
        except Marketplace.DoesNotExist:
            return Response({"error": f"Target SKU '{market_sku}' does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)      
            
            
            
            
            
            
            
            
            
            
            