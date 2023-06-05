from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from company.models import Company
from company.serializers import CompanySerializer
from .models import MyUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        ref_name = 'UserSerializer'


class UserRegisterSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password', 'secret_question', 'secret_answer']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_role(self, obj):
        return obj.role if obj.role in ['FRIEND', 'COMPANY_STAFF'] else None

    def create(self, validated_data):
        return MyUser.objects.create_user(**validated_data)


class CompanyRegisterSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password', 'secret_question', 'secret_answer', 'company']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        company_data = validated_data.pop('company')
        user = MyUser.objects.create_user(**validated_data)
        company = Company.objects.create(employer=user, **company_data)
        return user

    def update(self, instance, validated_data):
        company_data = validated_data.pop('company')
        company_serializer = self.fields['company']
        company_instance = instance.company

        if 'employer' in company_data:
            del company_data['employer']

        company_serializer.update(company_instance, company_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid username or password.")


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'token', 'role')

    def get_token(self, obj):  # get_token diyerek token alanını döndürüyoruz.
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
