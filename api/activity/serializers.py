from rest_framework import serializers
from .models import Activity, ActivityUser
from address.serializers import AddressSerializer


class ActivityUserSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ActivityUser
        fields = ('user', 'participate_status')

    def get_user(self, obj):
        return obj.username


class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    address = AddressSerializer()
    confirm = serializers.StringRelatedField(read_only=True)
    add_favourite = serializers.StringRelatedField(many=True, read_only=True)
    activity_user = serializers.StringRelatedField(many=True)

    class Meta:
        model = Activity
        fields = '__all__'

    def get_confirm(self, obj):
        return obj.confirm.confirm_status

    def get_add_favorite(self, obj):
        add_favourites = list(
            add_favourite.username for add_favourite in obj.add_favourites.get_queryset().only("username")
        )
        return obj.add_favourites

    def get_activity_user(self, obj):
        activity_users = list(
            activity_user.username for activity_user in obj.activity_users.get_queryset(filter(participate_status = True))
        )
        return obj.activity_users


class ActivityCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    address = AddressSerializer()

    class Meta:
        model = Activity
        fields = '__all__'

    def create(self, validated_data):
        address_data = validated_data.pop('address')

        address_serializer = AddressSerializer(data=address_data)
        address_serializer.is_valid(raise_exception=True)
        address = address_serializer.save()

        activity = Activity.objects.create(
            address=address,
            **validated_data
        )
        ActivityUser.objects.create(user=self.context['request'].user, activity=activity, participate_status=True)

        return activity

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_datetime', instance.start_date)
        instance.end_date = validated_data.get('end_datetime', instance.end_date)
        instance.activity_price = validated_data.get('activity_price', instance.activity_price)
        instance.category = validated_data.get('category', instance.category)
        instance.total_player_count = validated_data.get('total_player_count', instance.total_player_count)
        instance.activity_status = False
        instance.save()

        return instance

    def delete(self, instance):
        instance.delete()
