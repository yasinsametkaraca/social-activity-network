import uuid
from django.db import models
from dirtyfields import DirtyFieldsMixin


def activity_file_directory_path(self, filename):
    activity_id = self.id
    username = self.owner.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'activity_files/photos_{0}/{1}_{2}.{3}'.format(username, activity_id, fn, ext)


class ActivityUser(models.Model):
    PARTICIPATE_STATUS_CHOICES = (
        ("Accepted", "Accepted"),
        ("Wait-listed", "Wait-listed"),
        ("Rejected", "Rejected"),
    )

    activity = models.ForeignKey('activity.Activity', on_delete=models.CASCADE)
    user = models.ForeignKey('account.MyUser', on_delete=models.CASCADE)
    participate_status = models.CharField(max_length=20, choices=PARTICIPATE_STATUS_CHOICES, default="Wait-listed",)
    apply_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        app_label = 'activity'

    def save(self, *args, **kwargs):
        if self.activity:
            self.activity.missing_player_count = self.activity.total_player_count - self.activity.activity_user.count() - 1
            self.activity.save()
        super(ActivityUser, self).save(*args, **kwargs)


class ActivityManager(models.Manager):
    def get_activities_by_username(self, username):
        activities = self.filter(owner__username=username)
        return activities

    def get_activities_by_category(self, category):
        activities = self.filter(category=category)
        return activities


class Activity(models.Model, DirtyFieldsMixin):
    CATEGORY_CHOICES = (
        ('Sport', "SPORT"),
        ('Culture', "CULTURE"),
        ('Music', "MUSIC"),
        ('Game', "GAME"),
        ('Travel', "TRAVEL"),
        ('Cinema', "CINEMA"),
        ('Theatre', "THEATRE"),
    )

    owner = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='owner_id')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.ForeignKey('address.Address', on_delete=models.CASCADE, related_name='address', null=True, blank=True)
    image = models.ImageField(upload_to=activity_file_directory_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    confirm = models.ForeignKey('confirmation.Confirmation', on_delete=models.CASCADE, related_name='confirm', blank=True, null=True)
    total_player_count = models.IntegerField(default=2)
    missing_player_count = models.IntegerField(blank=True, null=True)
    activity_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    activity_status = models.BooleanField(default=False)
    add_favourite = models.ManyToManyField('account.MyUser', related_name='add_favourite', blank=True)
    activity_user = models.ManyToManyField('account.MyUser', through=ActivityUser, related_name='activity_user', blank=True)

    objects = ActivityManager()

    class Meta:
        app_label = 'activity'
        db_table = 'activity'
        verbose_name = 'Activity'
        verbose_name_plural = 'Activities'
        ordering = ("-created_at",)

    def __str__(self):
        return str(self.title)

    def get_owner(self):
        return self.owner

    def get_category(self):
        return self.category

    def get_title(self):
        return self.title

    def get_activity_user(self):
        return self.activity_user

