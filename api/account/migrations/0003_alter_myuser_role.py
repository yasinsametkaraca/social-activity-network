from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_myuser_last_login'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='role',
            field=models.CharField(blank=True, choices=[('ADMIN', 'Admin'), ('FRIEND', 'Friend'), ('COMPANY_STAFF', 'Company_Staff'), ('SYSTEM_STAFF', 'System_Staff')], max_length=50),
        ),
    ]