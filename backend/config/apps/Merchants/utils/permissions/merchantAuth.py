
from rest_framework.permissions import BasePermission 

class IsVerifiedMerchant(BasePermission):
    def has_permission(self):
        user = self.request.user
        return (
            user.is_authenticated 
            and not getattr(user, "is_suspended", False)
            and not getattr(user, "is_blocked", False)
            and getattr(user, "is_merchant", False)
            and getattr(user, "is_merchant_verified", False)
        )
