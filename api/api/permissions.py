from rest_framework.permissions import BasePermission, SAFE_METHODS

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


class IsActivityOwner(BasePermission):
    """
    Bu izin sınıfı, sadece aktiviteyi oluşturan kullanıcının güncelleme yapabilmesine izin verir.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsOwnerOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated is True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.owner == request.user