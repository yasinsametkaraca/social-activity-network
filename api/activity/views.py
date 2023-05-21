from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.pagination import CustomPagination
from api.permissions import CanChangeActivityParticipateStatus, IsActivityOwner
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
            self.permission_classes = (IsAuthenticated,)
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
    permission_classes = [IsAuthenticated, IsActivityOwner]


class ActivityUserList(generics.ListAPIView):
    serializer_class = ActivityUserSerializer
    permission_classes = [IsAuthenticated,  ]

    def get_queryset(self):
        activity_id = self.kwargs['activity_id']  # Aktivite ID' sini URL parametresinden alıyoruz
        queryset = ActivityUser.objects.filter(activity_id=activity_id)
        return queryset


class ActivityJoin(generics.CreateAPIView, generics.RetrieveDestroyAPIView):
    serializer_class = ActivityUserSerializer
    queryset = ActivityUser.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        activity_id = self.kwargs['activity_id']
        user = self.request.user
        obj, created = ActivityUser.objects.get_or_create(activity_id=activity_id, user=user)
        return obj

    def create(self, request, *args, **kwargs):
        activity_id = kwargs['activity_id']
        user = request.user
        activity_user, created = ActivityUser.objects.get_or_create(activity_id=activity_id, user=user)

        if not created:
            return Response({'error': 'Aktiviteye zaten katılma isteği yolladınız.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(activity_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'success': 'Aktivite katılımı başarıyla iptal edildi.'}, status=status.HTTP_204_NO_CONTENT)


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
        if participate_status == 0:
            return Response({'status': participate_status, 'message': f'{activity_user.user.username} adlı kullanıcının aktiviteye katılmasını '
                                                          f'iptal ettiniz.'}, status=status.HTTP_200_OK)
        return Response({'status': participate_status, 'message': f'{activity_user.user.username} adlı kullanıcının aktiviteye katılmasını '
                                                          f'onayladınız.'}, status=status.HTTP_200_OK)


class FavouriteActivity(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        user = request.user
        activity = get_object_or_404(Activity, pk=pk)

        if user in activity.add_favourite.all():
            activity.add_favourite.remove(user)
            response = {'message': f'{activity.title} favorilerden kaldırıldı.'}
        else:
            activity.add_favourite.add(user)
            response = {'message': f'{activity.title} favorilere eklendi.'}

        return Response(response, status=status.HTTP_200_OK)


class ActivityListByUsername(ListAPIView):
    serializer_class = ActivitySerializer

    def get_queryset(self):
        username = self.kwargs['username']
        queryset = Activity.objects.get_activities_by_username(username)
        return queryset

