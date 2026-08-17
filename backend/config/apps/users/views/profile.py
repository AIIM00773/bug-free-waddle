from django.contrib.auth import get_user_model
from rest_framework import permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# Models
from ..models import (
    UserReview, UserAlert, UserSearches, CartGroup, 
    SubCart, SubCartItem, UserOrderGroup, UserSubOrder, UserSubOrderItem
)

# Custom Validation Helpers
from ..utils.validators.auth_validation_helpers import (
    validate_email, 
    validate_name, 
    validate_password, 
    validate_phone
)

User = get_user_model()

# ---------------------------------------------------------
# SERIALIZERS
# ---------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        exclude = ['password', 'account_validation_code', 'is_staff', 'is_superuser']


# ---------------------------------------------------------
# VIEWS
# ---------------------------------------------------------

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


class UserProfileIdentityUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        
        print("Incoming patch data:", data)

        # Profile Edit Update logic
        if "email" in data and data["email"] is not None:
            email = data["email"].strip().lower()
            if email:
                user.email = email
                
        if "national_id_number" in data and data["national_id_number"] is not None:
            national_id = data["national_id_number"].strip()
            if national_id:
                user.national_id_number = national_id

        if "dob" in data and data["dob"] is not None and not user.date_of_birth:
            dob = data["dob"].strip()
            if dob:
                user.date_of_birth = dob

        if "gender" in data and data["gender"] is not None and not user.gender:
            gender = data["gender"].strip().lower()
            if gender:
                user.gender = gender

        # Settings Edit Update logic (Key-presence check allows True or False updates)
        if "allow_push_notification" in data:
            user.allow_push_notification = bool(data["allow_push_notification"])
            
        if "allow_whatsApp_dispatch_alerts" in data:
            user.allow_whatsApp_dispatch_alerts = bool(data["allow_whatsApp_dispatch_alerts"])

        if "allow_sms_tracking_pings" in data:
            user.allow_sms_tracking_pings = bool(data["allow_sms_tracking_pings"])

        if "allow_order_dispatch_checkpoints_alerts" in data:
            user.allow_order_dispatch_checkpoints_alerts = bool(data["allow_order_dispatch_checkpoints_alerts"])

        if "allow_payment_receipt_alert" in data:
            user.allow_payment_receipt_alert = bool(data["allow_payment_receipt_alert"])

        if "allow_location_access" in data:
            user.allow_location_access = bool(data["allow_location_access"])

        if "preferred_language" in data and data["preferred_language"] is not None:
            preferred_language = str(data["preferred_language"]).strip()
            if preferred_language:
                user.preferred_language = preferred_language

        user.save()
        
        serializer = UserSerializer(user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)




class UserProfileLogisticsUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        
        # Extract and clean inputs
        county = data.get("county", "").strip().lower()
        sub_county = data.get("sub_county", "").strip()
        street = data.get("street", "").strip()
        estate_area_neighborhood = data.get("estate_area_neighborhood", "").strip().lower()
        apartment_court_or_Door_id = data.get("apartment_court_or_Door_id", "").strip().lower()
        location_explanation = data.get("location_explanation", "").strip().lower()
        


        # Update logic
        if county:
            user.county = county
            
        if sub_county:
            user.sub_county = sub_county

        if street:
            user.street = street

        if estate_area_neighborhood:
            user.estate_area_neighborhood = estate_area_neighborhood


        if apartment_court_or_Door_id:
            user.apartment_door_id = apartment_court_or_Door_id

        if location_explanation:
            user.location_explanation = location_explanation
            
            

        user.save()
        
        serializer = UserSerializer(user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)




