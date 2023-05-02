from rest_framework import generics
from rest_framework.generics import ListAPIView
from .serializers import AdvertisementPostSerializer, AdvertisementGetSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Advertisement
from api.permissions import IsCompanyStaff


class AdvertisementList(generics.ListCreateAPIView):
    def get_queryset(self):
        if self.request.method == 'GET':
            category = self.request.GET.get('category')
            if category:
                queryset = Advertisement.objects.filter(category=category, advertisement_status=True)
            else:
                queryset = Advertisement.objects.filter(advertisement_status=True)
        else:
            queryset = Advertisement.objects.all()
        return queryset

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        serializer.save(employer=self.request.user, advertisement_status=False)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsCompanyStaff)
        else:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AdvertisementGetSerializer
        return AdvertisementPostSerializer


class AdvertisementDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsCompanyStaff]

    def get_queryset(self):
        return Advertisement.objects.get_advertisement_by_username(self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(employer=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AdvertisementGetSerializer
        return AdvertisementPostSerializer


class AdvertisementListByUsername(ListAPIView):
    serializer_class = AdvertisementGetSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        queryset = Advertisement.objects.get_advertisement_by_username(username)
        return queryset

