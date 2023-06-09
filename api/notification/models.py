from django.db import models


class Notification(models.Model):
    Notification_Choices = (
        ('C', 'comment'),
        ('AA', 'activity accept'),
        ('AR', 'activity reject'),
        ('AJ', 'activity join'),
        ('Fav', 'favourite'),
        ('SSC', 'system staff confirm'),
        ('SSR', 'system staff reject'),
        ('F', 'follow'),
        ('U', 'unfollow'),
    )
    activity_notify = models.ForeignKey('activity.Activity', on_delete=models.CASCADE, related_name='activity_notify', null=True, blank=True)
    advertisement_notify = models.ForeignKey('advertisement.Advertisement', on_delete=models.CASCADE, related_name='advertisement_notify', null=True, blank=True)
    sender = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='sender', null=True)
    receiver = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='receiver', null=True)
    type = models.CharField(max_length=50, choices=Notification_Choices)
    text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        sender_username = self.sender.username if self.sender else "System Staff"
        receiver_username = self.receiver.username if self.receiver else "System Staff"
        return f"{sender_username} {receiver_username} {self.type}"
