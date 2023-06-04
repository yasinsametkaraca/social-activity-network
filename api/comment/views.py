import uuid

from django.core.files.storage import default_storage
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Comment
from .serializers import CommentReadSerializer, CommentWriteSerializer
from api.permissions import CanCrudPrivateComments, CanCrudPrivateCommentDetail, IsFriend


class CommentList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, CanCrudPrivateComments, IsFriend]

    def get_queryset(self):
        activity_id = self.request.GET.get('activity')
        is_public = self.request.GET.get('is_public', True)  # /comments/activity/?is_public=true
        if is_public.lower() == 'false':
            return Comment.objects.filter(activity_id=activity_id)
        return Comment.objects.filter(activity_id=activity_id, is_public=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CommentReadSerializer
        return CommentWriteSerializer


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, CanCrudPrivateCommentDetail, IsFriend]
    queryset = Comment.objects.all()

    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.owner != self.request.user:
            raise PermissionDenied()
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied()
        instance.delete()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CommentReadSerializer
        return CommentWriteSerializer


class UploadCommentImageView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, format=None):
        image_file = request.FILES.get('image')
        activity_id = request.POST.get('activity_id')
        username = request.user.username
        ext = image_file.name.split('.')[-1]
        fn = uuid.uuid4().hex
        file_path = f'activity_files/comment_files/photos_{username}/{activity_id}_{fn}.{ext}'

        # Save the file using default_storage
        default_storage.save(file_path, image_file)

        return Response({'message': 'Dosya başarıyla yüklendi', 'image': file_path})