from django.http import Http404
from rest_framework import generics, permissions

from api.pagination import CustomPagination
from api.permissions import IsCompanyEmployer
from .models import Company
from .serializers import CompanySerializer


class CompanyList(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPagination


class CompanyDescriptionUpdate(generics.UpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyEmployer]

    def get_object(self):
        try:
            return Company.objects.get(employer=self.request.user)
        except Company.DoesNotExist:
            raise Http404("Company does not exist.")

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)



