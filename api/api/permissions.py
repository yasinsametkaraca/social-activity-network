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


class CanViewPrivateComments(BasePermission):  # sadece o aktiviteye katılanlar private yorumları görebilir.
    def has_object_permission(self, request, view, obj):
        if obj.is_public:
            return True
        return request.user in obj.activity.activity_user.filter(activityuser__participate_status=True)


class CanCreatePrivateComments(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(obj.is_public)
        if obj.is_public:
            return True

        if request.user.is_authenticated:
            activity_id = obj.activity.id
            return ActivityUser.objects.filter(activity=activity_id, user=request.user,
                                               participate_status=True).exists()

        return False


# class CanCreatePrivateComments(BasePermission):
#     message = 'You are not authorized to create comments for non-public activities.'
#
#     def has_permission(self, request, view):
#         if request.method == 'POST':
#             activity_id = request.data.get('activity')
#             is_public = request.data.get('is_public')
#             if not is_public:
#                 activity = Activity.objects.filter(id=activity_id).first()
#                 if activity and request.user in activity.activity_user.all():
#                     return True
#                 return False
#         return True
#
# class CanViewPrivateComments(BasePermission):
#     message = 'You are not authorized to view comments for non-public activities.'
#
#     def has_permission(self, request, view):
#         activity_id = request.GET.get('activity')
#         is_public = request.GET.get('is_public', True)
#         if not is_public:
#             activity = Activity.objects.filter(id=activity_id).first()
#             if activity and request.user in activity.activity_user.all():
#                 return True
#             return False
#         return True
