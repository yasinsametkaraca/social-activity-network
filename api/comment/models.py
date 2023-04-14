from django.db import models
from activity.models import Activity
from account.models import MyUser


class Comment(models.Model):
    user_id = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='comments', null=True)
    activity_comment = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activity_comment', null=True)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ('-created_at',)

    def __str__(self):
        return f'Comment by {self.user_id.username} on {self.activity_comment.title}'

    def get_username(self):
        return self.user_id.username if self.user_id else '-'

    get_username.admin_order_field = 'user_id__username'
    get_username.short_description = 'User'

    def get_activity_title(self):
        return self.activity_comment.title if self.activity_comment else '-'

    get_activity_title.admin_order_field = 'activity_comment__title'
    get_activity_title.short_description = 'Activity Title'

    def get_activity_owner(self):
        return self.activity_comment.owner.username if self.activity_comment and self.activity_comment.owner else '-'

    get_activity_owner.admin_order_field = 'activity_comment__owner__username'
    get_activity_owner.short_description = 'Activity Owner'