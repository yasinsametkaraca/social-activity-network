from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    receiver = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'sender', 'receiver', 'type', 'created_at', 'is_read')
        read_only_fields = ('id', 'sender', 'receiver', 'type', 'created_at')
