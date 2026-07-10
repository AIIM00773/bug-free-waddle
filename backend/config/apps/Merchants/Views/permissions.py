

from rest_framework import permissions

class IsVerifiedMerchant(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.is_merchant and user.is_merchant_verified
