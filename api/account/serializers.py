from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from account.models import MyUser


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

    def get_role(self, obj):
        return obj.role


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'token', 'role')

    def get_token(self, obj):  # get_token diyerek token alanını döndürüyoruz.
        token = RefreshToken.for_user(obj)
        return str(token.access_token)



