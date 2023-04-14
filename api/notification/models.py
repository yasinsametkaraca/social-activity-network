from django.db import models


class Notification(models.Model):
    Notification_Choices = (
        ('C', 'comment'),
        ('Fav', 'favourite'),
        ('SSC', 'system staff confirm'),
        ('F', 'follow'),
        ('U', 'unfollow'),
    )
    activity_notify = models.ForeignKey('activity.Activity', on_delete=models.CASCADE, related_name='activity_notify', null=True, blank=True)
    sender = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='sender', null=True)
    receiver = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='receiver', null=True)
    type = models.CharField(max_length=50, choices=Notification_Choices)
    text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.sender.username + " " + self.receiver.username + " " + self.type