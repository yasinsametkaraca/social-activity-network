# Generated by Django 4.2 on 2023-06-12 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0006_alter_notification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('C', 'comment'), ('AA', 'activity accept'), ('AR', 'activity reject'), ('AJ', 'activity join'), ('Fav', 'favourite'), ('SSC', 'system staff confirm'), ('SSR', 'system staff reject'), ('F', 'follow'), ('U', 'unfollow')], max_length=50),
        ),
    ]
