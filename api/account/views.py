from typing import Dict, Any
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import MyUser
from .serializers import UserSerializerWithToken, UserSerializer
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
def getMyUser(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
def getUserById(request, pk):
    if request.user != MyUser.objects.get(id=pk):
        return Response(status=status.HTTP_403_FORBIDDEN)

    user = MyUser.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
