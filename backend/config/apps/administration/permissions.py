
from rest_framework.permissions import BasePermission
class IsAdminStaff(BasePermission):
    """
    Allows access only to authenticated users who are marked as staff.
    """
    def has_bse_admin_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
    
    

class has_read_write_permissions(BasePermission):
    """
    Allows access only to authenticated users who are marked as staff.
    """
    def has_read_permissions(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
    
    def has_write_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
