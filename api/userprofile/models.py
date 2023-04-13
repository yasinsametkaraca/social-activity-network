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
    linkedin_url = models.URLField(max_length=200, blank=True, null=True)
    website_url = models.URLField(max_length=200, blank=True, null=True)
    following = models.ManyToManyField(AUTH_USER_MODEL, related_name="following")  # who I follow
    follower = models.ManyToManyField(AUTH_USER_MODEL, related_name='follower')  # who follow me
    friends = models.ManyToManyField(AUTH_USER_MODEL, related_name='friends', blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='None', blank=True, null=True)
    education_level = models.CharField(max_length=20, blank=True, null=True, choices=EDUCATION_LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    avatar = models.ImageField(upload_to=low_file_directory_path, blank=True, null=True)
    company_url = models.URLField(max_length=200, blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    address = models.OneToOneField(Address, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.user.username

    def get_friends_count(self):
        return self.friends.all().count()

    def get_friends(self):
        return self.friends.all()

    class Meta:
        db_table = 'profile'
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def get_full_name(self):
        return self.user.get_full_name()


FRIENDSHIP_STATUS = (
    ('send', 'send'),
    ('accepted', 'accepted'),
    ('rejected', 'rejected'),
)


class Friendship(models.Model):
    from_id = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='from_user')
    to_id = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='to_user')
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=FRIENDSHIP_STATUS, blank=True, null=True)

    def __str__(self):
        return f"{self.from_id} -> {self.to_id} | status = {self.status}"

    class Meta:
        db_table = 'friendship'
        verbose_name = 'Friendship'
        verbose_name_plural = 'Friendships'
