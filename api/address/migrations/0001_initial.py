# Generated by Django 4.2 on 2023-04-11 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Address",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "address_line1",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "address_line2",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("city", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "postal_code",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("country", models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                "verbose_name": "Address",
                "verbose_name_plural": "Addresses",
                "db_table": "address",
            },
        ),
    ]
