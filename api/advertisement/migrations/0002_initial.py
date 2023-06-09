# Generated by Django 4.2 on 2023-04-20 14:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("confirmation", "0005_advertisementconfirmation"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("advertisement", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="advertisement",
            name="confirm",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="confirm",
                to="confirmation.advertisementconfirmation",
            ),
        ),
        migrations.AddField(
            model_name="advertisement",
            name="employer",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="employer",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
