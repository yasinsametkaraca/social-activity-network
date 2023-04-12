from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Profile
from .serializers import ProfileSerializer, ProfileDetailSerializer


class ProfileList(generics.ListCreateAPIView):
    serializer_class = ProfileDetailSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated & IsAdminUser]


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]


@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
@authentication_classes([JWTAuthentication])
def getProfileByUser(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    serializer = ProfileDetailSerializer(profile, many=False)
    return Response(serializer.data)

