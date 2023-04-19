from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.ProfileList.as_view(), name='admin_profile_list'),
    path("<str:username>/", views.UserProfileByUsername.as_view(), name="user_profile_by_username"),
    path('follow/<str:username>/', views.FollowAndUnfollowView.as_view(), name='follow_and_unfollow'),
    path('follower/<str:username>', views.FollowerListAPIView.as_view(), name='followers_list'),
    path('following/<str:username>', views.FollowingListAPIView.as_view(), name='following_list'),
    path("avatar", views.UserAvatarAPIView.as_view(), name="user_avatar"),
]