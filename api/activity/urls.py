from django.urls import path
from .views import ActivityUserStatusUpdateView, ActivityJoinView, ActivityCreateView, ActivityList

urlpatterns = [
    path('', ActivityList.as_view(), name='activity_list'),
    path('create', ActivityCreateView.as_view(), name='activity_create'),
    path('<str:activity_id>/join', ActivityJoinView.as_view(), name='activity_join'),
    path('<str:activity_id>/status', ActivityUserStatusUpdateView.as_view(), name='activity_user_status_update'),
]
