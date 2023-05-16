from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission, SAFE_METHODS
from activity.models import Activity
from activity.models import ActivityUser


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
            activity = get_object_or_404(Activity, id=activity_id)
            return activity.owner == request.user
        return False

    def has_object_permission(self, request, view, obj):
        activity = obj.activity
        return activity.owner == request.user


class IsActivityOwner(BasePermission):
    """
    Sadece aktiviteyi oluşturan kullanıcının güncelleme yapabilmesine izin verir.
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


class CanCrudPrivateComments(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            activity_id = request.GET.get('activity')
            is_public = request.GET.get('is_public', 'true')
        else:
            activity_id = request.data.get('activity')
            is_public = request.data.get('is_public')
        if is_public:
            return True
        else:
            return ActivityUser.objects.filter(activity=activity_id, user=request.user,
                                               participate_status=True).exists()


class CanCrudPrivateCommentDetail(BasePermission):  # sadece o aktiviteye katılanlar private yorumları görebilir.
    def has_object_permission(self, request, view, obj):
        if obj.is_public:
            return True
        return request.user in obj.activity.activity_user.filter(activityuser__participate_status=True)
