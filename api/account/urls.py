from django.urls import path
from . import views


urlpatterns = [
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register', views.register, name='register'),
    path('', views.getMyUser, name='users'),
    path('<str:pk>', views.getUserById, name='get_user_by_id'),
]