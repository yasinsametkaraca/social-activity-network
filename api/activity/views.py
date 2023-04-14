from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from api.permissions import CanChangeActivityParticipateStatus
from .models import ActivityUser, Activity
from .serializers import ActivitySerializer


class ActivityList(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer

    def get_queryset(self):
        queryset = Activity.objects.filter(activity_status=True)
        return queryset


class ActivityCreateView(generics.CreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save(owner=request.user) # Aktivitenin sahibi olarak mevcut kullanıcıyı atıyoruz
        activity_user = activity.activity_user.create(user=request.user, status=True)  # Aktiviteye sahibi olarak katılan kullanıcıyı ekliyoruz
        headers = self.get_success_headers(serializer.data)
        return Response(ActivitySerializer(activity).data, status=status.HTTP_201_CREATED, headers=headers)



class ActivityJoinView(APIView):
    def post(self, request, activity_id):
        try:
            activity = Activity.objects.get(id=activity_id)
        except Activity.DoesNotExist:
            return Response({'error': 'Aktivite bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        activity_user, created = ActivityUser.objects.get_or_create(activity=activity, user=user)

        if not created:
            return Response({'error': 'Kullanıcı zaten bu aktiviteye katılmış.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': 'Aktiviteye katılma isteği başarıyla alındı.'}, status=status.HTTP_201_CREATED)


class ActivityUserStatusUpdateView(APIView):
    """
    ActivityUser modelindeki status alanını güncellemek için kullanılan view.
    Sadece aktivite sahibi izinlidir.
    """
    permission_classes = [CanChangeActivityParticipateStatus]

    def put(self, request, activity_id):
        user_id = request.user.id
        try:
            activity_user = ActivityUser.objects.get(activity_id=activity_id, user_id=user_id)
        except ActivityUser.DoesNotExist:
            return Response({'error': 'ActivityUser bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status is None:
            return Response({'error': 'Yeni bir status belirtmelisiniz.'}, status=status.HTTP_400_BAD_REQUEST)

        activity_user.status = new_status
        activity_user.save()

        return Response({'status': new_status}, status=status.HTTP_200_OK)