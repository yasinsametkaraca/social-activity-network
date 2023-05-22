import uuid
from django.db import models


def comment_file_directory_path(self, filename):
    activity_id = self.activity.id
    comment_id = self.id
    username = self.owner.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'activity_files/comment_files/photos_{0}/{1}_{2}_{3}.{4}'.format(username, activity_id, comment_id, fn, ext)


class Comment(models.Model):
    owner = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='owner', null=True)
    activity = models.ForeignKey('activity.Activity', on_delete=models.CASCADE, related_name='activity_id', null=True)
    comment = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=comment_file_directory_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        app_label = 'comment'
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ('-created_at',)

    def __str__(self):
        return f'Comment by {self.owner.username} on {self.activity.title}'

    def get_username(self):
        return self.owner.username if self.owner else '-'

    get_username.admin_order_field = 'owner__username'
    get_username.short_description = 'User'

    def get_activity_title(self):
        return self.activity.title if self.activity else '-'

    get_activity_title.admin_order_field = 'activity__title'
    get_activity_title.short_description = 'Activity Title'

    def get_activity_owner(self):
        return self.activity.owner.username if self.activity and self.activity.owner else '-'

    get_activity_owner.admin_order_field = 'activity__owner__username'
    get_activity_owner.short_description = 'Activity Owner'

