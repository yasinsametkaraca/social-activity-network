from rest_framework import serializers
from advertisement.models import Advertisement
from address.serializers import AddressSerializer
from company.models import Company
from company.serializers import CompanyAdvertisementSerializer


class AdvertisementGetSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    company = serializers.SerializerMethodField(read_only=True)
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Advertisement
        exclude = ['confirm', 'employer']

    def get_company(self, obj):
        employer = obj.employer
        if employer:
            company = Company.objects.filter(employer=employer).first()
            if company:
                return CompanyAdvertisementSerializer(company).data
        return None

    def get_advertisement_by_username(self, username):
        user = self.context['request'].user
        if user.username == username:
            advertisements = Advertisement.objects.filter(employer__username=username)
        else:
            advertisements = Advertisement.objects.filter(employer__username=username, advertisement_status=True)
        return advertisements


class AdvertisementPostSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    company = serializers.StringRelatedField(read_only=True)
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    company = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Advertisement
        exclude = ['confirm', ]
        read_only_fields = ('id', 'employer')

    def get_company(self, obj):
        employer = obj.employer
        if employer:
            company = Company.objects.filter(employer=employer).first()
            if company:
                return CompanyAdvertisementSerializer(company).data
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)
        address_serializer.is_valid(raise_exception=True)
        address = address_serializer.save()
        validated_data['advertisement_status'] = False
        validated_data['employer'] = request.user
        activity = Advertisement.objects.create(
            address=address,
            **validated_data
        )
        return activity

    def update(self, instance, validated_data):
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.title = validated_data.get('title', instance.title)
        instance.advertisement_price = validated_data.get('advertisement_price', instance.advertisement_price)
        instance.category = validated_data.get('category', instance.category)
        instance.total_user_count = validated_data.get('total_user_count', instance.total_user_count)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.advertisement_url = validated_data.get('advertisement_url', instance.advertisement_url)
        instance.advertisement_company = validated_data.get('advertisement_company', instance.advertisement_company)
        instance.advertisement_status = False

        address_data = validated_data.pop('address')
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        instance.save()
        return instance

    def delete(self, instance):
        instance.delete()
