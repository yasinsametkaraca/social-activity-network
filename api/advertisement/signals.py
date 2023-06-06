from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from confirmation.models import AdvertisementConfirmation
from advertisement.models import Advertisement


@receiver(post_save, sender=AdvertisementConfirmation)
def update_advertisement_status(sender, instance, **kwargs):
    if instance.confirm_status:
        instance.advertisement.advertisement_status = True
        post_save.disconnect(update_advertisement_confirmation, sender=Advertisement)
        instance.advertisement.save()
        post_save.connect(update_advertisement_confirmation, sender=Advertisement)
    else:
        instance.advertisement.advertisement_status = False
        post_save.disconnect(update_advertisement_confirmation, sender=Advertisement)
        instance.advertisement.save()
        post_save.connect(update_advertisement_confirmation, sender=Advertisement)


@receiver(post_save, sender=Advertisement)
def update_advertisement_confirmation(sender, instance, **kwargs):
    try:
        advertisement_confirmation = AdvertisementConfirmation.objects.get(advertisement=instance)
        advertisement_confirmation.confirm_status = False
        advertisement_confirmation.confirm_type = 'Update'
        post_save.disconnect(update_advertisement_status, sender=AdvertisementConfirmation)
        advertisement_confirmation.save()
        post_save.connect(update_advertisement_status, sender=AdvertisementConfirmation)
    except AdvertisementConfirmation.DoesNotExist:
        instance.advertisement_status = False
        post_save.disconnect(update_advertisement_status, sender=AdvertisementConfirmation)
        AdvertisementConfirmation.objects.create(advertisement=instance, confirm_status=False, confirm_type='Create')
        post_save.connect(update_advertisement_status, sender=AdvertisementConfirmation)


@receiver(post_delete, sender=Advertisement)
def delete_related_address(sender, instance, **kwargs):
    if instance.address:
        instance.address.delete()