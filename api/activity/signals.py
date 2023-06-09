from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from rest_framework.generics import get_object_or_404

from confirmation.models import Confirmation
from activity.models import Activity
from notification.models import Notification


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
        notification = Notification(receiver=instance.activity.owner, activity_notify=instance.activity,
                                    text=f"System staff confirmed your {instance.activity.title} activity.", type="SSC")
        notification.save()
    else:
        instance.activity.activity_status = False
        post_save.disconnect(update_confirmation, sender=Activity)
        instance.activity.save()
        post_save.connect(update_confirmation, sender=Activity)
        try:
            notification = Notification.objects.get(receiver=instance.activity.owner, activity_notify=instance.activity,
                                                    type="SSC")
            notification.text = f"System staff did not confirm your {instance.activity.title} activity."
            notification.type = "SSR"
            notification.save()
        except Notification.DoesNotExist:
            notification = Notification(receiver=instance.activity.owner, activity_notify=instance.activity,
                                        text=f"System staff confirmed your {instance.activity.title} activity.", type="SSR")
            notification.save()


@receiver(post_save, sender=Activity)
def update_confirmation(sender, instance, **kwargs):
    if ('title' in instance.get_dirty_fields()) or ('description' in instance.get_dirty_fields()) or ('activity_status' in instance.get_dirty_fields()):
        confirmation = Confirmation.objects.get(activity=instance)
        confirmation.confirm_status = False
        instance.activity_status = False
        confirmation.confirm_type = 'Update'
        post_save.disconnect(update_activity_status, sender=Confirmation)
        confirmation.save()
        post_save.connect(update_activity_status, sender=Confirmation)
    try:
        confirmation = Confirmation.objects.get(activity=instance)
    except Confirmation.DoesNotExist:
        instance.activity_status = False
        post_save.disconnect(update_activity_status, sender=Confirmation)
        Confirmation.objects.create(activity=instance, confirm_status=False, confirm_type='Create')
        post_save.connect(update_activity_status, sender=Confirmation)
    print(instance.get_dirty_fields())


@receiver(post_delete, sender=Activity)
def delete_related_address(sender, instance, **kwargs):
    if instance.address:
        instance.address.delete()