from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):

    def create_user(self, username, password=None, is_superuser=False, is_staff=False,
                    is_active=True, role='FRIEND', **kwargs):
        if not username:
            raise ValueError('Users must have a username')
        if not password:
            raise ValueError("User must have a password")

        user = self.model(
            username=username,
            **kwargs
        )
        if role == 'ADMIN' or role == 'SYSTEM_STAFF' or is_superuser or is_staff:
            raise ValueError("You can't create an admin or system staff user with this method.")

        user.set_password(password)
        user.role = role
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.is_active = is_active
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password=None, **kwargs):
        if not username:
            raise ValueError('Users must have a username')
        if not password:
            raise ValueError('Users must have a password')

        user = self.model(username=username, **kwargs)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.role = "ADMIN"
        user.save(using=self._db)

        return user


class MyUser(AbstractBaseUser, PermissionsMixin):
    ADMIN = 'ADMIN'
    FRIEND = 'FRIEND'
    COMPANY_STAFF = 'COMPANY_STAFF'
    SYSTEM_STAFF = 'SYSTEM_STAFF'

    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (FRIEND, 'Friend'),
        (COMPANY_STAFF, 'Company_Staff'),
        (SYSTEM_STAFF, 'System_Staff'),
    )

    username = models.CharField(max_length=50, unique=True, blank=False, null=False)
    role = models.CharField(max_length=50, null=False, blank=True, choices=ROLE_CHOICES)
    identification_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    REQUIRED_FIELDS = []

    USERNAME_FIELD = 'username'

    objects = UserManager()

    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name
