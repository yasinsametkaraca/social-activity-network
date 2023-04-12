from rest_framework import serializers
from .models import Profile
from account.serializers import UserSerializer
from address.serializers import AddressSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        profile = Profile.objects.create(user=user, **validated_data)
        return profile


class ProfileDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        profile = Profile.objects.create(user=user, **validated_data)
        return profile

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_address(self, obj):
        address = obj.address
        serializer = AddressSerializer(address, many=False)
        return serializer.data
