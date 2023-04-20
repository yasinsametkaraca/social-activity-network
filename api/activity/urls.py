from django.urls import path
from .views import ActivityUserStatusUpdateView, ActivityJoinView, \
    ActivityListByUsernameView, ActivityUpdateDeleteView, AddFavouriteAPIView, ActivityUserListView, ActivityListCreate

urlpatterns = [
    path('', ActivityListCreate.as_view(), name='activity_list'),
    path('<int:id>/', ActivityUpdateDeleteView.as_view(), name='activity_update_delete'),
    path('<str:username>/', ActivityListByUsernameView.as_view(), name='activity_list_by_username'),
    path('<str:activity_id>/join/', ActivityJoinView.as_view(), name='activity_join'),
    path('<str:activity_id>/status/', ActivityUserStatusUpdateView.as_view(), name='activity_user_status_update'),
    path('<str:activity_id>/user/', ActivityUserListView.as_view(), name='activity_user_list'),
    path("<int:pk>/addfavourite/", AddFavouriteAPIView.as_view(), name="add_favourite_activity"),
]
