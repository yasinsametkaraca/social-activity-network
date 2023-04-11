from django.urls import path

from address import views

urlpatterns = [
   path('', views.AddressList.as_view(), name='address-list'),
   path('<str:pk>/', views.AddressDetail.as_view(), name='address-detail'),
]