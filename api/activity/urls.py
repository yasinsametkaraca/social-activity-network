from django.urls import path
from .views import ActivityUserStatusUpdateView, ActivityJoinView, ActivityCreateView, ActivityList, \
    ActivityListByUsernameView, ActivityUpdateDeleteView, AddFavouriteAPIView

urlpatterns = [
    path('', ActivityList.as_view(), name='activity_list'),
    path('create/', ActivityCreateView.as_view(), name='activity_create'),
    path('<str:username>', ActivityListByUsernameView.as_view(), name='activity_list_by_username'),
    path('activity/<str:id>/', ActivityUpdateDeleteView.as_view(), name='activity_update_delete'),
    path('<str:activity_id>/join/', ActivityJoinView.as_view(), name='activity_join'),
    path('<str:activity_id>/status/', ActivityUserStatusUpdateView.as_view(), name='activity_user_status_update'),
    path("addfavourite/<str:pk>/", AddFavouriteAPIView.as_view(), name="add_favourite_activity"),
]
