from rest_framework import serializers
from .models import Activity, Category, ActivityUser
from address.serializers import AddressSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ActivityUserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ActivityUser
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    category = CategorySerializer()
    address = AddressSerializer()
    confirm = serializers.StringRelatedField(read_only=True)
    add_favourite = serializers.StringRelatedField(many=True)
    activity_user = ActivityUserSerializer(many=True)

    class Meta:
        model = Activity
        fields = '__all__'

    def get_confirm(self, obj):
        return obj.confirm.confirm_status