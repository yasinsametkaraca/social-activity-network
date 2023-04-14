from rest_framework.permissions import BasePermission

from activity.models import Activity


class IsFriend(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == "FRIEND" and request.user.is_authenticated)


class IsCompanyStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == "COMPANY_STAFF" and request.user.is_authenticated)


class CanChangeActivityParticipateStatus(BasePermission):
    """
    Sadece aktivite sahibinin ActivityUser modelindeki status alanını değiştirebilmesine izin verir.
    """

    def has_permission(self, request, view):
        if 'activity_id' in view.kwargs:
            activity_id = view.kwargs['activity_id']
            activity = Activity.objects.get(id=activity_id)
            return activity.owner == request.user
        return False

    def has_object_permission(self, request, view, obj):
        activity = obj.activity
        return activity.owner == request.user