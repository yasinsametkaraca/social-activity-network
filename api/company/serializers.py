from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    employer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'


class CompanyAdvertisementSerializer(serializers.ModelSerializer):
    employer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Company
        fields = ['name', 'company_logo', 'company_url', 'employer', 'company_mail', 'company_phone']