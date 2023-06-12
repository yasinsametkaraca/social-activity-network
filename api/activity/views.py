from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from api.pagination import CustomPagination
from api.permissions import CanChangeActivityParticipateStatus, IsActivityOwner, IsFriend, ActivityStatus
from notification.models import Notification
from .models import ActivityUser, Activity
from .serializers import ActivitySerializer, ActivityCreateUpdateSerializer, ActivityUserSerializer
from account.models import MyUser


class ActivityList(generics.ListCreateAPIView):
    pagination_class = CustomPagination

    def get_queryset(self):
        if self.request.method == 'GET':
            category = self.request.GET.get('category')
            if category:
                queryset = Activity.objects.filter(category=category, activity_status=True)
            else:
                queryset = Activity.objects.filter(activity_status=True)
        else:
            queryset = Activity.objects.all()
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ActivitySerializer
        return ActivityCreateUpdateSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsFriend)
        else:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save(owner=request.user, activity_status=False)
        headers = self.get_success_headers(serializer.data)
        return Response(ActivityCreateUpdateSerializer(activity).data, status=status.HTTP_201_CREATED, headers=headers)


class ActivityDetail(generics.UpdateAPIView, generics.DestroyAPIView, generics.RetrieveAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivityCreateUpdateSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (IsActivityOwner, IsAuthenticated, ActivityStatus)
        return super().get_permissions()


class ActivityUserList(generics.ListAPIView):
    serializer_class = ActivityUserSerializer
    permission_classes = [IsAuthenticated, IsFriend]

    def get_queryset(self):
        activity_id = self.kwargs['activity_id']  # Aktivite ID' sini URL parametresinden alıyoruz
        if Activity.objects.get(id=activity_id).owner == self.request.user:
            queryset = ActivityUser.objects.filter(activity_id=activity_id)
        else:
            queryset = ActivityUser.objects.filter(activity_id=activity_id, participate_status="Accepted")
        return queryset


class ActivityJoin(generics.GenericAPIView):
    serializer_class = ActivityUserSerializer
    permission_classes = [IsAuthenticated, IsFriend]

    def get_queryset(self):
        return ActivityUser.objects.filter(activity_id=self.kwargs['activity_id'])

    def get_object(self):
        queryset = self.get_queryset()
        user = self.request.user
        obj = get_object_or_404(queryset, user=user)
        return obj

    def post(self, request, *args, **kwargs):
        activity_id = self.kwargs['activity_id']
        user = request.user
        activity = get_object_or_404(Activity, id=activity_id)
        activity_user, created = ActivityUser.objects.get_or_create(activity=activity, user=user)
        serializer = self.get_serializer(activity_user)

        if not created:
            activity_user.delete()
<<<<<<< HEAD
            get_object_or_404(Notification, sender=request.user, receiver=activity.owner,
                                        activity_notify=activity, type="AJ").delete()
            return Response({'message': 'Activity participation successfully canceled.', 'data': serializer.data},
                            status=status.HTTP_200_OK)

        notification = Notification(sender=request.user,  receiver=activity.owner,
                                    activity_notify=activity, type="AJ")
=======
            get_object_or_404(Notification, sender=request.user, receiver=activity_user.user,
                                        activity_notify=activity_user.activity, type="AJ").delete()

            return Response({'message': 'Activity participation successfully canceled.', 'data': serializer.data},
                            status=status.HTTP_200_OK)

        notification = Notification(sender=request.user, receiver=activity_user.user,
                                    activity_notify=activity_user.activity, type="AJ")
>>>>>>> main
        notification.save()
        return Response(
            {'message': 'The request to join the activity was successfully received.', 'data': serializer.data},
            status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Activity participation successfully canceled.', 'data': ""},
                        status=status.HTTP_204_NO_CONTENT)


class ActivityUserStatusUpdate(generics.UpdateAPIView):
    serializer_class = ActivityUserSerializer
    queryset = ActivityUser.objects.all()
    permission_classes = [CanChangeActivityParticipateStatus, IsAuthenticated]

    def get_object(self):
        activity_id = self.kwargs['activity_id']
        username = self.request.data.get('username')
        user = get_object_or_404(MyUser, username=username)
        obj, created = ActivityUser.objects.get_or_create(activity_id=activity_id, user=user)
        return obj

    def put(self, request, *args, **kwargs):
        activity_user = self.get_object()
        participate_status = request.data.get('participate_status')
        if participate_status is None:
            return Response({'error': 'Yeni bir status belirtmelisiniz.'}, status=status.HTTP_400_BAD_REQUEST)

        activity_user.participate_status = participate_status
        activity_user.save()
        if participate_status == "Rejected":
            notification = get_object_or_404(Notification, sender=request.user, receiver=activity_user.user, activity_notify=activity_user.activity, type="AA")
            notification.type = "AR"
            notification.save()
            return Response({'status': participate_status,
                             'message': f'{activity_user.user.username} adlı kullanıcının aktiviteye katılmasını '
                                        f'iptal ettiniz.'}, status=status.HTTP_200_OK)
        elif participate_status == "Accepted":
            notification = Notification(sender=request.user, receiver=activity_user.user, activity_notify=activity_user.activity, type="AA")
            notification.save()
            return Response({'status': participate_status,
                             'message': f'{activity_user.user.username} adlı kullanıcının aktiviteye katılmasını '
                                        f'onayladınız.'}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FavouriteActivity(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        user = request.user
        activity = get_object_or_404(Activity, pk=pk)

        if user in activity.add_favourite.all():
            activity.add_favourite.remove(user)
            response = {'message': f'{activity.title} favorilerden kaldırıldı.',
                        "data": ActivitySerializer(activity, context={'request': request}).data}
            notification = Notification.objects.get(sender=user, receiver=activity.owner, activity_notify=activity, type="Fav")
            notification.delete()
        else:
            activity.add_favourite.add(user)
            response = {'message': f'{activity.title} favorilere eklendi.', "data": ActivitySerializer(activity, context={'request': request}).data}
            notification = Notification(sender=user, receiver=activity.owner, activity_notify=activity, type="Fav")
            notification.save()

        return Response(response, status=status.HTTP_200_OK)


class ActivityListByUsername(ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        username = self.kwargs['username']
        serializer = self.get_serializer(context=self.get_serializer_context())
        queryset = serializer.get_activities_by_username(username)
        return queryset


class ActivityListForAdmin(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = CustomPagination
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
