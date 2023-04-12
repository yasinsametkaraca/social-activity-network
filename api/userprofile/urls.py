from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProfileList.as_view(), name='profile'),
    path('user', views.getProfileByUser, name='get_my_profile'),
    path('<str:pk>', views.ProfileDetail.as_view(), name='profile_detail'),
]