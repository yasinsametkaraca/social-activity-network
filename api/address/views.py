from rest_framework import generics
from .models import Address
from .serializers import AddressSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS, \
    BasePermission


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class AddressList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated | ReadOnly]
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
