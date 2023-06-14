from django.urls import path
from company.views import CompanyDescriptionUpdate, CompanyList

urlpatterns = [
    path('', CompanyDescriptionUpdate.as_view()),
    path('suggestions/', CompanyList.as_view()),
]