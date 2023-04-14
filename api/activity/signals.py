from django.db.models.signals import post_save
from django.dispatch import receiver
from confirmation.models import Confirmation

from activity.models import Activity


@receiver(post_save, sender=Confirmation)
def update_activity_status(sender, instance, **kwargs):
    """
    Confirmation modeli kaydedildiğinde, ilgili Activity modelinin activity_status değerini günceller.
    """
    if instance.confirm_status:
        instance.activity.activity_status = True
        post_save.disconnect(update_confirmation, sender=Activity)  # post_save sinyalini geçici olarak devre dışı bırak
        instance.activity.save()
        post_save.connect(update_confirmation, sender=Activity)  # post_save sinyalini tekrar etkinleştir
    else:
        # Confirmation modelinde confirm_status False ise, ilgili Activity modelinin activity_status'u da False olarak güncellenir.
        instance.activity.activity_status = False
        post_save.disconnect(update_confirmation, sender=Activity)  # post_save sinyalini geçici olarak devre dışı bırak
        instance.activity.save()
        post_save.connect(update_confirmation, sender=Activity)  # post_save sinyalini tekrar etkinleştir


@receiver(post_save, sender=Activity)
def update_confirmation(sender, instance, **kwargs):
    try:
        confirmation = Confirmation.objects.get(activity=instance)
        confirmation.confirm_status = False
        confirmation.confirm_type = 'Update'
        post_save.disconnect(update_activity_status, sender=Confirmation)
        confirmation.save()
        post_save.connect(update_activity_status, sender=Confirmation)
    except Confirmation.DoesNotExist:
        post_save.disconnect(update_activity_status, sender=Confirmation)
        Confirmation.objects.create(activity=instance, confirm_status=False, confirm_type='Create')
        post_save.connect(update_activity_status, sender=Confirmation)