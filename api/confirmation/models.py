from django.db import models

CONFIRM_TYPE_CHOICES = (
        ('Create', 'Create'),
        ('Update', 'Update'),
    )


class Confirmation(models.Model):

    activity = models.ForeignKey('activity.Activity', on_delete=models.CASCADE, related_name='activity', null=True,
                                 blank=True)
    employee = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='user', null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirm_status = models.BooleanField(default=False)
    confirm_type = models.CharField(max_length=8, blank=True, null=True, choices=CONFIRM_TYPE_CHOICES)

    def __str__(self):
        return self.activity.title


class AdvertisementConfirmation(models.Model):
    advertisement = models.ForeignKey('advertisement.Advertisement', on_delete=models.CASCADE,
                                      related_name='advertisement', null=True, blank=True)
    employee = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='employee', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    confirm_status = models.BooleanField(default=False)
    confirm_type = models.CharField(max_length=8, blank=True, null=True, choices=CONFIRM_TYPE_CHOICES)

    def __str__(self):
        return self.advertisement.title