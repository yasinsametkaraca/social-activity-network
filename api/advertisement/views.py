from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView

from api.pagination import CustomPagination
from .serializers import AdvertisementPostSerializer, AdvertisementGetSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Advertisement
from api.permissions import IsCompanyStaff


class AdvertisementList(generics.ListCreateAPIView):
    pagination_class = CustomPagination

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
    queryset = Advertisement.objects.all()

    def perform_update(self, serializer):
        serializer.is_valid(raise_exception=True)
        instance = serializer.instance
        if instance.employer != self.request.user:
            raise PermissionDenied("You do not have permission to update this advertisement.")
        if not instance.advertisement_status:
            raise PermissionDenied("Advertisement in approval status cannot be updated.")
        serializer.save(employer=self.request.user)

    def perform_destroy(self, instance):
        if instance.employer != self.request.user:
            raise PermissionDenied("You do not have permission to delete this advertisement.")
        if not instance.advertisement_status:
            raise PermissionDenied("Advertisement in approval status cannot be updated")
        instance.delete()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AdvertisementGetSerializer
        return AdvertisementPostSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (IsAuthenticated, IsCompanyStaff)
        return super().get_permissions()


class AdvertisementListByUsername(ListAPIView):
    serializer_class = AdvertisementGetSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        serializer = self.get_serializer(context=self.get_serializer_context())
        queryset = serializer.get_advertisement_by_username(username)
        return queryset


class GetRandomAdvertisement(generics.ListAPIView):
    queryset = Advertisement.objects.order_by('?')[:1]
    serializer_class = AdvertisementGetSerializer
    permission_classes = [IsAuthenticated]


