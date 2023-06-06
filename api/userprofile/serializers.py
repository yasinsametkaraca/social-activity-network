from rest_framework import serializers

from company.models import Company
from company.serializers import CompanySerializer, CompanyAdvertisementSerializer
from .models import Profile, Friendship
from address.serializers import AddressSerializer
from account.serializers import UserSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ProfileDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)
    follower = serializers.SerializerMethodField(read_only=True)
    following = serializers.SerializerMethodField(read_only=True)

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

    def get_follower(self, obj):
        followers = obj.follower.all()
        usernames = [follower.profile.user.username for follower in followers]
        return usernames

    def get_following(self, obj):
        followings = obj.follower.all()
        usernames = [following.profile.user.username for following in followings]
        return usernames


class ProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("avatar",)


class ProfileAboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("about",)


class ProfileSuggestionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'avatar']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    identification_number = serializers.CharField(source='user.identification_number')
    role = serializers.CharField(source='user.role', read_only=True)
    follower = serializers.StringRelatedField(many=True, read_only=True)
    following = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'identification_number',
            'role',
            'avatar',
            'about',
            'birth_date',
            'linkedin_url',
            'website_url',
            'friends',
            'gender',
            'education_level',
            'created_at',
            'last_modified_at',
            'company_url',
            'company_name',
            'follower',
            'following',
            'spotify_playlist'
        ]
        extra_kwargs = {
            'identification_number': {'write_only': True}
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.email = user_data.get('email', user.email)
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.identification_number = user_data.get('identification_number', user.identification_number)
        user.save()

        # TODO instance.about = validated_data.get('about', instance.about)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.linkedin_url = validated_data.get('linkedin_url', instance.linkedin_url)
        instance.website_url = validated_data.get('website_url', instance.website_url)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.education_level = validated_data.get('education_level', instance.education_level)
        instance.spotify_playlist = validated_data.get('spotify_playlist', instance.spotify_playlist)
        instance.company_url = validated_data.get('company_url', instance.company_url)
        instance.company_name = validated_data.get('company_name', instance.company_name)

        instance.save()
        return instance


class CompanyStaffProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    identification_number = serializers.CharField(source='user.identification_number')
    role = serializers.CharField(source='user.role', read_only=True)
    follower = serializers.StringRelatedField(many=True, read_only=True)
    company = serializers.SerializerMethodField(read_only=True)
    following = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'identification_number',
            'role',
            'avatar',
            'about',
            'birth_date',
            'linkedin_url',
            'website_url',
            'friends',
            'gender',
            'education_level',
            'created_at',
            'last_modified_at',
            'company_url',
            'company_name',
            'follower',
            'following',
            'spotify_playlist',
            'company',
        ]
        extra_kwargs = {
            'identification_number': {'write_only': True}
        }

    def get_company(self, obj):
        employer = obj.user
        if employer:
            company = Company.objects.filter(employer=employer).first()
            if company:
                return CompanyAdvertisementSerializer(company).data
        return None

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.email = user_data.get('email', user.email)
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.identification_number = user_data.get('identification_number', user.identification_number)
        user.save()

        # TODO instance.about = validated_data.get('about', instance.about)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.linkedin_url = validated_data.get('linkedin_url', instance.linkedin_url)
        instance.website_url = validated_data.get('website_url', instance.website_url)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.education_level = validated_data.get('education_level', instance.education_level)
        instance.spotify_playlist = validated_data.get('spotify_playlist', instance.spotify_playlist)
        instance.company_url = validated_data.get('company_url', instance.company_url)
        instance.company_name = validated_data.get('company_name', instance.company_name)

        instance.save()
        return instance