from rest_framework import status
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.response import Response


class ShowNotifications(APIView):
    def get(self, request):
        user = self.request.user
        notifications = Notification.objects.filter(receiver=user, is_read=False).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class NotificationRead(APIView):
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(receiver=request.user, id=pk)
        except Notification.DoesNotExist:
            return Response('Notification does not exist', status=status.HTTP_404_NOT_FOUND)

        if notification.receiver != request.user:
            return Response('You are not allowed to read this notification', status=status.HTTP_403_FORBIDDEN)

        notification.is_read = True
        notification.save()
        return Response('Notification read')
