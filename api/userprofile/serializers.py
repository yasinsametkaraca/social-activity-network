from rest_framework import serializers
from .models import Profile
from address.serializers import AddressSerializer
from account.serializers import UserSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ProfileDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

    def get_address(self, obj):
        address = obj.address
        serializer = AddressSerializer(address, many=False)
        return serializer.data
