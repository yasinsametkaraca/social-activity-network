from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, is_superuser=False, is_staff=False,
                    is_active=True, role='FRIEND', first_name=None, last_name=None,
                    secret_question=None, secret_answer=None, **kwargs):
        if not username:
            raise ValueError('Users must have a username')
        if not password:
            raise ValueError("User must have a password")
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError("User must have a last name")
        if not secret_question:
            raise ValueError("Users must provide a secret question")
        if not secret_answer:
            raise ValueError("Users must provide a secret answer")

        if role == 'ADMIN' or role == 'SYSTEM_STAFF' or is_superuser or is_staff:
            raise ValueError("You can't create an admin or system staff user with this method.")

        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name,
            secret_question=secret_question,
            secret_answer=secret_answer,
            **kwargs
        )

        user.set_password(password)
        user.role = role
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.is_active = is_active
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password=None, first_name="A", last_name="A",
                         secret_question="A", secret_answer="A", **kwargs):
        if not username:
            raise ValueError('Users must have a username')
        if not password:
            raise ValueError('Users must have a password')
        if not secret_question:
            raise ValueError("Users must provide a secret question")
        if not secret_answer:
            raise ValueError("Users must provide a secret answer")

        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name,
            secret_question=secret_question,
            secret_answer=secret_answer,
            **kwargs
        )
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

    QUESTION_CHOICES = (
        ("1", 'What is your favorite color?'),
        ("2", 'What is your favorite animal?'),
        ("3", 'What is your favorite food?'),
    )
    username = models.CharField(max_length=50, unique=True, blank=False, null=False)
    role = models.CharField(max_length=50, null=False, blank=True, choices=ROLE_CHOICES, default=FRIEND)
    identification_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    secret_question = models.CharField(max_length=100, blank=False, null=False, choices=QUESTION_CHOICES)
    secret_answer = models.CharField(max_length=100, blank=False, null=False)
    first_name = models.CharField(max_length=50, blank=False, null=False)
    last_name = models.CharField(max_length=50, blank=False, null=False)
    email = models.EmailField(max_length=50, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    REQUIRED_FIELDS = []

    USERNAME_FIELD = 'username'

    objects = UserManager()

    class Meta:
        app_label = 'account'
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name
