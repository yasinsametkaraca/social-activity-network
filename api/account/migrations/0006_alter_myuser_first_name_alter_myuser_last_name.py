# Generated by Django 4.2 on 2023-06-02 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_alter_myuser_first_name_alter_myuser_last_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='first_name',
            field=models.CharField(default='a', max_length=50),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='last_name',
            field=models.CharField(default='a', max_length=50),
        ),
    ]
