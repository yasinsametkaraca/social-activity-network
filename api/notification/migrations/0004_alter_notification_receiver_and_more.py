# Generated by Django 4.2 on 2023-06-12 15:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0011_profile_spotify_playlist'),
        ('notification', '0003_notification_activity_notify_alter_notification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='receiver',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to='userprofile.profile'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sender', to='userprofile.profile'),
        ),
    ]
