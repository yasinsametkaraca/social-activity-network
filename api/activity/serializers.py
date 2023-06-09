from rest_framework import serializers
from comment.models import Comment
from .models import Activity, ActivityUser
from address.serializers import AddressSerializer


class ActivityUserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    participantId = serializers.CharField(source='user.profile.id', read_only=True)
    avatar = serializers.CharField(source='user.profile.avatar', read_only=True)

    class Meta:
        model = ActivityUser
        fields = ('username', 'participate_status', 'description', 'participantId', 'avatar')

    def get_username(self, obj):
        return obj.user.username

    # def get_profile(self, obj):
    #     try:
    #         profile = Profile.objects.get(user=obj.user)
    #         return ProfileAvatarSerializer(profile).data
    #     except Profile.DoesNotExist:
    #         return None


class UserActivitySerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    participate_status = serializers.CharField(read_only=True)

    class Meta:
        model = ActivityUser
        fields = ('username', 'participate_status', 'description')

    def get_username(self, obj):
        return obj.username


class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    address = AddressSerializer()
    add_favourite = serializers.StringRelatedField(many=True, read_only=True)
    activity_user = serializers.SerializerMethodField(read_only=True)
    avatar = serializers.CharField(source='owner.profile.avatar', read_only=True)
    role = serializers.CharField(source='owner.role', read_only=True)
    userId = serializers.CharField(source='owner.id', read_only=True)
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    comment_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Activity
        exclude = ['confirm', ]

    def get_add_favorite(self, obj):
        add_favourites = list(
            add_favourite.username for add_favourite in obj.add_favourites.get_queryset().only("username")
        )
        return obj.add_favourites

    def get_comment_count(self, obj):
        return Comment.objects.filter(activity=obj).count()

    def get_activity_user(self, obj):
        if self.context.get('request').user == obj.owner:
            activity_users = ActivityUser.objects.filter(activity=obj)
            return ActivityUserSerializer(activity_users, many=True).data
        else:
            activity_users = ActivityUser.objects.filter(activity=obj)
            return ActivityUserSerializer(activity_users, many=True).data

    def get_activities_by_username(self, username):
        user = self.context['request'].user
        if user.username == username:
            activities = Activity.objects.filter(owner__username=username)
        else:
            if Activity.objects.filter(owner__username=username, activity_user=user).exists():
                activities = Activity.objects.filter(owner__username=username)
            else:
                activities = Activity.objects.filter(owner__username=username, activity_status=True)
        return activities


class ActivityCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    address = AddressSerializer()
    add_favourite = serializers.StringRelatedField(many=True, read_only=True)
    activity_user = serializers.SerializerMethodField(read_only=True)
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    role = serializers.CharField(source='owner.role', read_only=True)
    userId = serializers.CharField(source='owner.id', read_only=True)
    avatar = serializers.CharField(source='owner.profile.avatar', read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        exclude = ['confirm', ]

    def get_comment_count(self, obj):
        return Comment.objects.filter(activity=obj).count()

    def get_activity_user(self, obj):
        activity_users = ActivityUser.objects.filter(activity=obj)
        return ActivityUserSerializer(activity_users, many=True).data

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)
        address_serializer.is_valid(raise_exception=True)
        address = address_serializer.save()

        activity = Activity.objects.create(
            address=address,
            **validated_data
        )
        ActivityUser.objects.create(user=self.context['request'].user, activity=activity, participate_status="Accepted")
        return activity

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            address_serializer.is_valid(raise_exception=True)
            address_serializer.save()

        instance.title = validated_data.get('title', instance.title)
        instance.image = validated_data.get('image', instance.image)
        instance.description = validated_data.get('description', instance.description)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.activity_price = validated_data.get('activity_price', instance.activity_price)
        instance.category = validated_data.get('category', instance.category)
        instance.total_player_count = validated_data.get('total_player_count', instance.total_player_count)

        instance.save()
        return instance
