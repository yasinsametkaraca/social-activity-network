from django.urls import path
from . import views


urlpatterns = [
    path('login', views.UserLogin.as_view(), name='user_login'),
    path('register', views.UserRegister.as_view(), name='register'),
    path("logout", views.UserLogout.as_view(), name="logout_user"),
    path('', views.UserAPI.as_view(), name='get_my_user'),
    path('<str:username>', views.UserDetailAPI.as_view(), name='get_user_by_id'),
    path('company/register', views.CompanyRegister.as_view()),
]