from django.urls import path
from .views import CommentList, CommentDetail, UploadCommentImageView

urlpatterns = [
    path('', CommentList.as_view(), name='comment_list_create'),
    path('<int:pk>/', CommentDetail.as_view(), name='comment_retrieve_update_destroy'),
    path('upload-image/', UploadCommentImageView.as_view(), name='upload_comment_image'),

]