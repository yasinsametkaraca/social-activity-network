from django.db import models


class Confirmation(models.Model):
    CONFIRM_TYPE_CHOICES = (
        ('Create', 'Create'),
        ('Update', 'Update'),
    )
    #advertisiment_id
    activity = models.ForeignKey('activity.Activity', on_delete=models.CASCADE, related_name='activity', null=True, blank=True)
    employee = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='user', null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirm_status = models.BooleanField(default=False)
    confirm_type = models.CharField(max_length=8, blank=True, null=True, choices=CONFIRM_TYPE_CHOICES)
    #is_advertisiment = models.BooleanField(default=False)

    def __str__(self):
        return self.activity.title

