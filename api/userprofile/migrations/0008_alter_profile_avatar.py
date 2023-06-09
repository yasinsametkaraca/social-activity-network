from django.db import migrations, models
import userprofile.models


class Migration(migrations.Migration):
    dependencies = [
        ('userprofile', '0007_remove_profile_is_online_profile_linkedin_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=userprofile.models.low_file_directory_path),
        ),
    ]
