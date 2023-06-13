from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from api.pagination import CustomPagination
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.response import Response


class ShowNotifications(ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(receiver=user).order_by('-created_at')
        return queryset


class NotificationRead(APIView):
    def put(self, request, pk):
        try:
            notification = Notification.objects.get(receiver=request.user, id=pk)
        except Notification.DoesNotExist:
            return Response('Notification does not exist', status=status.HTTP_404_NOT_FOUND)

        if notification.receiver != request.user:
            return Response('You are not allowed to read this notification', status=status.HTTP_403_FORBIDDEN)

        notification.is_read = True
        notification.save()
        return Response('Notification read')
