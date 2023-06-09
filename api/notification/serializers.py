from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    sender_avatar = serializers.CharField(source='sender.profile.avatar', read_only=True)
    receiver = serializers.CharField(source='receiver.username', read_only=True)
    activity = serializers.CharField(source='activity_notify.id', read_only=True)
    activity_title = serializers.CharField(source='activity_notify.title', read_only=True)
    advertisement = serializers.CharField(source='advertisement_notify.id', read_only=True)
    advertisement_title = serializers.CharField(source='advertisement_notify.title', read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'sender', 'receiver', 'activity', 'type', 'created_at', 'is_read', 'advertisement', 'activity_title', 'advertisement_title', 'sender_avatar')
        read_only_fields = ('id', 'sender', 'receiver', 'type', 'created_at', 'activity', 'advertisement', 'activity_title', 'advertisement_title', 'sender_avatar')

