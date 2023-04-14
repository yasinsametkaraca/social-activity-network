import uuid
from django.db import models
from address.models import Address


class Category(models.Model):
    CATEGORY_CHOICES = (
        ('Sport', "SPORT"),
        ('Culture', "CULTURE"),
        ('Music', "MUSIC"),
        ('Game', "GAME"),
        ('Travel', "TRAVEL"),
        ('Cinema', "CINEMA"),
        ('Theatre', "THEATRE"),
    )
    name = models.CharField(max_length=50, blank=True, null=True, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name


def activity_file_directory_path(self, filename):
    activity_id = self.id
    username = self.owner_id.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'activity_files/photos_{0}/{1}_{2}.{3}'.format(username, activity_id, fn, ext)


class ActivityUser(models.Model):
    activity = models.ForeignKey('activity.Activity', on_delete=models.CASCADE)
    user = models.ForeignKey('account.MyUser', on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    apply_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.activity:
            self.activity.missing_player_count = self.activity.total_player_count - self.activity.activity_user.count() - 1
            self.activity.save()
        super(ActivityUser, self).save(*args, **kwargs)


class Activity(models.Model):
    owner = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='owner_id')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category',)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='address')
    image = models.ImageField(upload_to=activity_file_directory_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    confirm = models.ForeignKey('confirmation.Confirmation', on_delete=models.CASCADE, related_name='confirm', blank=True, null=True)
    total_player_count = models.IntegerField(blank=True, null=True)
    missing_player_count = models.IntegerField(blank=True, null=True)
    activity_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    activity_status = models.BooleanField(default=False)
    add_favourite = models.ManyToManyField('account.MyUser', related_name='add_favourite', blank=True)
    activity_user = models.ManyToManyField('account.MyUser', through=ActivityUser, related_name='activity_user', blank=True)

    def __str__(self):
        return self.title

    def get_owner(self):
        return self.owner

    def get_category(self):
        return self.category

    def get_title(self):
        return self.title










