# Generated by Django 4.2 on 2023-06-12 18:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('advertisement', '0002_initial'),
        ('notification', '0007_alter_notification_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='advertisement_notify',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='advertisement_notify', to='advertisement.advertisement'),
        ),
    ]
