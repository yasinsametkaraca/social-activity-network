from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import MyUser
from .serializers import UserSerializerWithToken, UserSerializer
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView


class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.role = request.data.get('role')
            login(request._request, user)
            refresh = RefreshToken.for_user(user)
            return Response(
                {'user': UserSerializer(user).data, 'refresh': str(refresh), 'access': str(refresh.access_token)},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request._request, username=username, password=password)

        if user is not None:
            login(request._request, user)
            serializer = UserSerializer(user)
            refresh = RefreshToken.for_user(user)
            return Response({'user': serializer.data, 'refresh': str(refresh), 'access': str(refresh.access_token)},
                            status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)


class GetMyUser(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)


class UserDetailAPI(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, pk):
        # Kullanıcının istediği kullanıcıyı görüntüleme yetkisi olup olmadığını kontrol et
        try:
            user = MyUser.objects.get(id=pk)
        except MyUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != user:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(user)
        return Response(serializer.data)


