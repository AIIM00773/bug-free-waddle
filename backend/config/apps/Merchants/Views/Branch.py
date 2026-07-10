import re
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import serializers 

from ..models import (InternalMerchantProfile, MerchantStoreBranch, BranchSpecificInventory)
from ..utils import log_merchant_activity


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BranchSpecificInventory
        fields = "__all__"
        


#  REGEX VALIDATORS =====================================================================
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
PHONE_REGEX = re.compile(r"^(?:\+254|0)[17]\d{8}$")  # Validates Kenyan format: 07..., 01..., +254.
TIME_REGEX = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")  # Validates 24HR HH:MM format




# SERIALIZER==============================================================================
class BranchAndBranchIndividualsSerializer(serializers.ModelSerializer):
    inventories = InventorySerializer(many=True, source='branch_inventory', read_only=True)

    class Meta:
        model = MerchantStoreBranch  
        fields = "__all__"





# VIEWS =================================================================================
class BranchOnboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data or {}
        
        # Permission and Verification Guard
        merchant_profile = get_object_or_404(InternalMerchantProfile, vendorOwner=user)

        if not getattr(user, 'is_merchant', False) or not merchant_profile.verified or not getattr(user, 'is_merchant_verified', False):
            return Response(
                {"error": "You do not have permission to perform this action. Please verify your merchant account status."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Extraction and Cleaning of Text Inputs
        branch_name = str(data.get("branchName", "")).strip()
        branch_category = str(data.get("branchCategory", "")).strip()
        branch_description = str(data.get("branchDescription", "")).strip()
        country = str(data.get("country", "Kenya")).strip()
        county = str(data.get("county", "")).strip()
        sub_county = str(data.get("subCounty", "")).strip()
        physical_address = str(data.get("physicalAddress", "")).strip()
        building_name = str(data.get("buildingName", "")).strip()
        opens_time = str(data.get("opens", "")).strip()
        closes_time = str(data.get("closes", "")).strip()
        operating_hours = str(data.get("operatingHours", "")).strip()
        manager_name = str(data.get("managerName", "")).strip()
        manager_phone = str(data.get("managerPhone", "")).strip()
        manager_email = str(data.get("managerEmail", "")).strip()

        # Required Fields Validation Guard
        required_fields = [
            branch_name, branch_category, county, sub_county, 
            physical_address, building_name, opens_time, closes_time, 
            operating_hours, manager_name, manager_phone, manager_email
        ]

        if Tannys := any(not field for field in required_fields):
            return Response(
                {"error": "Some required data fields are missing or empty. Please fill out all required fields."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Strict Regex & Format Data Validations
        if not EMAIL_REGEX.match(manager_email):
            return Response({"error": "Invalid manager email address format."}, status=status.HTTP_400_BAD_REQUEST)

        if not PHONE_REGEX.match(manager_phone):
            return Response({"error": "Invalid Kenyan phone number format. Use 07..., 01..., or +254..."}, status=status.HTTP_400_BAD_REQUEST)

        if not TIME_REGEX.match(opens_time) or not TIME_REGEX.match(closes_time):
            return Response({"error": "Opening and Closing times must be in HH:MM 24-hour format."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse Geo-coordinates safely if provided
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        lat_val = float(latitude) if latitude and str(latitude).strip() else None
        lon_val = float(longitude) if longitude and str(longitude).strip() else None

        # Atomic DB Execution Block
        try:
            with transaction.atomic():
                has_existing_branches = MerchantStoreBranch.objects.filter(merchant=merchant_profile).exists()
                
                # First branch entry must always act as the master/primary distribution hub
                is_primary_branch = bool(data.get("isPrimary", False)) if has_existing_branches else True

                # Database Object Construction
                branch = MerchantStoreBranch.objects.create(
                    merchant=merchant_profile,
                    branchName=branch_name,
                    branchCategory=branch_category,
                    branchDescription=branch_description if branch_description else None,
                    isPrimary=is_primary_branch,
                    isOnline=bool(data.get("isOnline", True)),
                    isStocked=bool(data.get("isStocked", True)),
                    isAcceptingOrders=bool(data.get("isAcceptingOrders", True)),
                    country=country,
                    county=county,
                    cityTown=sub_county,
                    physicalAddress=physical_address,
                    buildingName=building_name,
                    latitude=lat_val,
                    longitude=lon_val,
                    opens=opens_time,
                    closes=closes_time,
                    operatingHours=operating_hours,
                    managerName=manager_name,
                    managerPhone=manager_phone,
                    managerEmail=manager_email
                )
                
                # Step B: Auto-generate the Branch Specific Inventory
                inventory_title = f"{branch.branchName}'s Default Inventory"
                inventory_description = f"System generated default inventory - ledger- asset - system for tracking items at {branch.branchName} Branch."
                
                BranchSpecificInventory.objects.create(
                    parrentBranch=branch,
                    inventoryTitle=inventory_title,
                    inventoryDescription=inventory_description,
                    inventoryLocked=False,
                    totalProducts=0
                )
                
        except Exception as e:
            return Response(
                {"error": f"An unhandled database tracking error occurred during configuration: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        print(f"User Name : {user.username}")
        print(f"Successfully Created Branch ID: {branch.unique_id}")

        return Response(
            {"message": "Your Merchant Branch has been created and registered successfully."}, 
            status=status.HTTP_201_CREATED
        )




class IndividualBranchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, unique_id):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        queryset = MerchantStoreBranch.objects.prefetch_related(
            'branch_inventory',                     
            'branch_inventory__product_in_inventory' 
        )
        branch = get_object_or_404(queryset, merchant=profile, unique_id=unique_id)
        serializer = BranchAndBranchIndividualsSerializer(branch)
        
        return Response(serializer.data, status=status.HTTP_200_OK)



class BranchDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, unique_id):
        profile = get_object_or_404(InternalMerchantProfile, vendorOwner=request.user)
        branch = get_object_or_404(MerchantStoreBranch, merchant=profile, unique_id=unique_id)
                
        branch.branch_inventory.all().delete()
        
        # Cache variables for logging before the object is destroyed
        branch_name = branch.branchName
        city_town = branch.cityTown
        
        branch.delete()
        
        log_merchant_activity(
            merchant=profile,
            action_event="branch_node_deleted",
            category="branch",
            description=f"Removed one of the existing distribution branch hubs: '{branch_name}' in {city_town}.",
            request=request
        )
        
        return Response({"message": "Branch Removed!"}, status=status.HTTP_200_OK)
