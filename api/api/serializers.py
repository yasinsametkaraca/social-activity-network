from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super(CustomTokenObtainPairSerializer, self).__init__(*args, **kwargs)

    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        access_token = AccessToken.for_user(self.user)
        access_token['username'] = self.user.username
        access_token['role'] = self.user.role
        access_token['user_id'] = self.user.id
        refresh_token = RefreshToken.for_user(self.user)
        refresh_token['username'] = self.user.username
        refresh_token['role'] = self.user.role
        refresh_token['user_id'] = self.user.id
        data['access'] = str(access_token)
        data['refresh'] = str(refresh_token)
        return data