from django.urls import path
from company.views import CompanyDescriptionUpdate

urlpatterns = [
    path('', CompanyDescriptionUpdate.as_view()),
]