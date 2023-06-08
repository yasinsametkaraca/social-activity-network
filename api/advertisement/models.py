import uuid
from django.db import models


def advertisement_file_directory_path(self, filename):
    advertisement_id = self.id
    username = self.employer.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'advertisement_files/photos_{0}/{1}_{2}.{3}'.format(username, advertisement_id, fn, ext)


class AdvertisementManager(models.Manager):
    def get_advertisement_by_username(self, username):
        advertisements = self.filter(employer__username=username)
        return advertisements

    def get_advertisement_by_category(self, category):
        advertisements = self.filter(category=category, advertisement_status=True)
        return advertisements


class Advertisement(models.Model):
    CATEGORY_CHOICES = (
        ('Travel', "TRAVEL"),
        ('Cinema', "CINEMA"),
        ('Theatre', "THEATRE"),
        ('Sport', "SPORT"),
        ('Culture', "CULTURE"),
        ('Music', "MUSIC"),
        ('Game', "GAME"),
    )

    employer = models.ForeignKey('account.MyUser', on_delete=models.CASCADE, related_name='employer')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    image = models.ImageField(upload_to=advertisement_file_directory_path, blank=True, null=True)
    address = models.OneToOneField('address.Address', on_delete=models.CASCADE)
    confirm = models.ForeignKey('confirmation.AdvertisementConfirmation', on_delete=models.CASCADE,
                                related_name='confirm',
                                blank=True, null=True)
    total_user_count = models.IntegerField(blank=True, null=True)
    advertisement_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    advertisement_status = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    advertisement_url = models.CharField(max_length=255, blank=True, null=True)
    advertisement_company = models.CharField(max_length=255, blank=True, null=True)

    objects = AdvertisementManager()

    class Meta:
        db_table = 'advertisement'
        verbose_name = 'Advertisement'
        verbose_name_plural = 'Advertisements'
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.title} - {self.employer.username}"

    def get_employer(self):
        return self.employer

    def get_category(self):
        return self.category

    def get_title(self):
        return self.title
