from rest_framework.permissions import BasePermission


class IsFriend(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == "FRIEND" and request.user.is_authenticated)


class IsCompanyStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == "COMPANY_STAFF" and request.user.is_authenticated)
