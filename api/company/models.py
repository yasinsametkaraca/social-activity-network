import uuid
from django.db import models


def company_file_directory_path(self, filename):
    company_id = self.id
    username = self.employer.username
    ext = filename.split('.')[-1]
    fn = uuid.uuid4()
    return 'company_files/photos_{0}/{1}_{2}.{3}'.format(username, company_id, fn, ext)


class Company(models.Model):

    employer = models.ForeignKey('account.MyUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=True)
    address = models.OneToOneField('address.Address', on_delete=models.CASCADE, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified_at = models.DateTimeField(auto_now=True)
    company_url = models.CharField(max_length=255, blank=True, null=True)
    company_logo = models.ImageField(upload_to=company_file_directory_path, blank=True, null=True)
    company_mail = models.CharField(max_length=150, blank=False, null=False)
    company_phone = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"
        db_table = "company"
        verbose_name = "Company"
