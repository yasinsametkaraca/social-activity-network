from django.urls import path
from .views import CommentList, CommentDetail


urlpatterns = [
    path('', CommentList.as_view(), name='comment_list_create'),
    path('<int:pk>/', CommentDetail.as_view(), name='comment_retrieve_update_destroy')
]