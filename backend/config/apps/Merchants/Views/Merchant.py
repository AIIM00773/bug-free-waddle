import re
from django.db import transaction
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import InternalMerchantProfile
from ..utils.loggers.log_merchant_activity  import log_merchant_activity
from .permissions import IsVerifiedMerchant
from rest_framework.permissions import AllowAny




# =============================================================================
# REGEX VALIDATORS
# =============================================================================

# Industry-Standard Compiled Regular Expressions
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^(07|01)\d{8}$")  # Validates 10-digit format starting with 07 or 01
KRA_PIN_REGEX = re.compile(r"^[A-Z]\d{9}[A-Z]$")
NUMERIC_REGEX = re.compile(r"^\d+$")


# =============================================================================
# VIEWS
# =============================================================================

class MerchantOnboardingView(APIView):
    permission_classes = [AllowAny]

    def validate_inputs(self, data):
        errors = {}

        if not PHONE_REGEX.match(str(data.get("support_phone", '')).strip()):
            errors['supportPhone'] = "Invalid support phone format. Must start with 07 or 01 and be 10 digits."

            
        if not EMAIL_REGEX.match(str(data.get("accountEmail", '')).strip()):
            errors['accountEmail'] = "Invalid email format."

            
        if data.get("bussinessRegisted"):
            tax_pin = str(data.get("taxPin", '')).strip().upper()
            if not KRA_PIN_REGEX.match(tax_pin):
                errors['taxPin'] = "Invalid KRA PIN format. Must be 11 characters (Letter, 9 digits, Letter)."


        payout_method = data.get("payoutMethod")
        
        if payout_method == 'M-Pesa Send Money':
            if not PHONE_REGEX.match(str(data.get("accountPhone", '')).strip()):
                errors['accountPhone'] = "Invalid M-Pesa phone number."

                
        elif payout_method == 'M-pesa Paybill':
            if not NUMERIC_REGEX.match(str(data.get("payBillNumber", '')).strip()):
                errors['payBillNumber'] = "Paybill must be numeric."
                
            if not data.get("accountNumber"):
                errors['accountNumber'] = "Paybill account number is required."
                
        elif payout_method == 'M-pesa Till':
            if not NUMERIC_REGEX.match(str(data.get("accountNumber", '')).strip()):
                errors['accountNumber'] = "Till number must be numeric."
                
        elif payout_method == 'Bank Transfer':
            if not data.get("bankName") or not data.get("bankAccountNumber"):
                errors['bankDetails'] = "Bank Name and Account Number are required."
                
        return errors



    def check_integrity(self, user, data):
        errors = {}

        if hasattr(user, 'merchant_profile') or InternalMerchantProfile.objects.filter(vendorOwner=user).exists():
            errors['profile'] = "This user account is already linked to an existing merchant profile."
           
        shop_name = data.get("shopName", '').strip()
        if InternalMerchantProfile.objects.filter(shopName__iexact=shop_name).exists():
            errors['shopName'] = f"The shop name '{shop_name}' already exists. Please choose another."
            
        if data.get("bussinessRegisted"):
            tax_pin = data.get("taxPin", '').strip().upper()
            if tax_pin and InternalMerchantProfile.objects.filter(taxPin__iexact=tax_pin).exists():
                errors['taxPin'] = "A merchant profile with this KRA PIN already exists."
                
        account_email = data.get("accountEmail", '').strip().lower()
        if InternalMerchantProfile.objects.filter(accountEmail__iexact=account_email).exists():
            errors['accountEmail'] = "This email is already associated with another merchant profile."
        
        support_phone = data.get("support_phone", '').strip()
        if InternalMerchantProfile.objects.filter(accountPhone__iexact=support_phone).exists():
            errors["supportPhone"] = f"The Phone Number {support_phone} is already registered."
                        
        return errors



    
    @transaction.atomic
    def post(self, request):
        data = request.data
        
        required_fields = ['shopName', 'shopCategory', 'accountEmail', 'support_phone', 'payoutMethod', 'shopDescription']
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"'{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        validation_errors = self.validate_inputs(data)
        if validation_errors:
            return Response({"errors": validation_errors}, status=status.HTTP_400_BAD_REQUEST)
        
        integrity_errors = self.check_integrity(request.user, data)
        if integrity_errors:
            return Response({"errors": integrity_errors}, status=status.HTTP_400_CONFLICT)

        try:
            payout_method = data.get("payoutMethod", '').strip()

            profile_kwargs = {
                "vendorOwner": request.user,
                "shopName": data.get("shopName", '').strip(),
                "shopDescription": data.get("shopDescription", '').strip(),
                "accountEmail": data.get("accountEmail", '').strip().lower(),
                "accountPhone": data.get("support_phone", '').strip(), 
                "shopCategoryPersist": data.get("shopCategory", '').strip(),
                "bussinessRegisted": data.get("bussinessRegisted", False),
                "taxPin": data.get("taxPin", '').strip().upper() if data.get("bussinessRegisted") else None,
                "businessRegistrationNumber": data.get("businessRegistrationNumber", '').strip() if data.get("bussinessRegisted") else None, 
                "payoutMethod": payout_method,
            }

            if payout_method == 'M-Pesa Send Money':
                profile_kwargs["sendMoneyPhone"] = data.get("accountPhone", "").strip()
            elif payout_method == 'M-pesa Paybill':
                profile_kwargs["payBillNumber"] = data.get("payBillNumber", "").strip()
                profile_kwargs["accountNumber"] = data.get("accountNumber", "").strip()
            elif payout_method == 'M-pesa Till':
                profile_kwargs["accountNumber"] = data.get("accountNumber", "").strip()
            elif payout_method == 'Bank Transfer':
                profile_kwargs["bankName"] = data.get("bankName", "").strip()
                profile_kwargs["bankAccountNumber"] = data.get("bankAccountNumber", "").strip()



            merchant = InternalMerchantProfile(**profile_kwargs)
            merchant.save()

            log_merchant_activity(
                merchant=merchant,
                action_event="merchant_onboarding",
                category="profile",
                description=f"Merchant {merchant.shopName} successfully onboarded via {payout_method}.",
                request=request,
                severity='info'
            )
            
            user = request.user 
            user.is_merchant = True
            user.save(update_fields=['is_merchant'])

            return Response({
                "message": "Merchant onboarded successfully", 
                "merchant_id": merchant.unique_id
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"errors": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
