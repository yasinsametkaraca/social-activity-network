from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import MyUser
from .serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer
from rest_framework import status
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from api.permissions import IsFriend
from api.serializers import CustomTokenObtainPairSerializer

from userprofile.serializers import UserProfileSerializer


class UserRegister(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(role=request.data.get('role'))
        login(request, user)
        token_serializer = CustomTokenObtainPairSerializer(data={
            'username': user.username,
            'role': user.role,
            'id': user.id,
            'password': request.data.get('password')
        })
        token_serializer.is_valid(raise_exception=True)
        token = token_serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response(
            {'user': serializer.data, 'token': token},
            status=status.HTTP_201_CREATED)


class UserLogin(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = UserProfileSerializer(user.profile)     #  serializer = UserSerializer(user)

        token_serializer = CustomTokenObtainPairSerializer(data={
            'username': user.username,
            'role': user.role,
            'id': user.id,
            'password': request.data.get('password')
        })
        token_serializer.is_valid(raise_exception=True)
        token = token_serializer.validated_data
        return Response({'user': serializer.data, 'token': token},
                        status=status.HTTP_200_OK)


class UserLogout(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserAPI(RetrieveUpdateAPIView):  # Bir Kullanıcı bilgisini güncelleme ve görüntüleme

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserDetailAPI(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, pk):
        try:  # Kullanıcının istediği kullanıcıyı görüntüleme yetkisi olup olmadığını kontrol et
            user = MyUser.objects.get(id=pk)
        except MyUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != user:
            return Response({"error": "Unauthorized access."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(user)
        return Response(serializer.data)
