from django.urls import path
from .views import ActivityUserStatusUpdate, ActivityJoin, \
    ActivityListByUsername, ActivityDetail, FavouriteActivity, ActivityUserList, ActivityList

urlpatterns = [
    path('', ActivityList.as_view(), name='activity_list'),
    path('<int:pk>/', ActivityDetail.as_view(), name='activity_update_delete'),
    path('<str:username>/', ActivityListByUsername.as_view(), name='activity_list_by_username'),
    path('<str:activity_id>/join/', ActivityJoin.as_view(), name='activity_join'),
    path('<str:activity_id>/status/', ActivityUserStatusUpdate.as_view(), name='activity_user_status_update'),
    path('<str:activity_id>/user/', ActivityUserList.as_view(), name='activity_user_list'),
    path("<int:pk>/addfavourite/", FavouriteActivity.as_view(), name="add_favourite_activity"),
]
