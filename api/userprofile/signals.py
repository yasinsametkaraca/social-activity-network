from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile
from account.models import MyUser


@receiver(post_save, sender=MyUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_staff or instance.is_superuser:
            return None
        Profile.objects.create(user=instance)


@receiver(post_save, sender=MyUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.is_staff or instance.is_superuser:
        return None
    instance.profile.save()

