import uuid
from django.db import models
from api.settings import AUTH_USER_MODEL
from address.models import Address


def low_file_directory_path(self, filename):
    user_id = self.user.id
    username = self.user.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'profile_files/photos_{0}/{1}_{2}.{3}'.format(username, user_id, fn, ext)


class Profile(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    EDUCATION_LEVEL_CHOICES = [
        ('ES', 'Elementary School'),
        ('MS', 'Middle School'),
        ('HS', 'High School'),
        ('AD', "Associate's Degree"),
        ('BD', "Bachelor's Degree"),
        ('MD', "Master's Degree"),
        ('PhD', "Doctorate or PhD"),
    ]
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE)
    about = models.TextField(max_length=600, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    is_online = models.BooleanField(default=False)
    following = models.ManyToManyField(AUTH_USER_MODEL, related_name="following")
    follower = models.ManyToManyField(AUTH_USER_MODEL, related_name='follower')
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='None', blank=True, null=True)
    education_level = models.CharField(max_length=20, blank=True, null=True, choices=EDUCATION_LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    avatar = models.ImageField(upload_to=low_file_directory_path, default='/default.png', blank=True, null=True)
    company_url = models.URLField(max_length=200, blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    address = models.OneToOneField(Address, on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        return self.user.username

    class Meta:
        db_table = 'profile'
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def get_full_name(self):
        return self.user.get_full_name()


