from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .models import MyUser
from userprofile.models import Profile


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_role(self, obj):
        return obj.role if obj.role in ['FRIEND', 'COMPANY_STAFF'] else None

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = MyUser(**validated_data)
        user.set_password(password)
        user.save()
        profile = Profile(user=user)
        profile.save()
        return user


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'token', 'role')

    def get_token(self, obj):  # get_token diyerek token alanını döndürüyoruz.
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

