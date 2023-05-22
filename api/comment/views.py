from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import CommentReadSerializer, CommentWriteSerializer
from api.permissions import CanCrudPrivateComments, CanCrudPrivateCommentDetail, IsFriend


class CommentList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, CanCrudPrivateComments, IsFriend]

    def get_queryset(self):
        activity_id = self.request.GET.get('activity')
        is_public = self.request.GET.get('is_public', 'true')  # /comments/activity/?is_public=true
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
    permission_classes = [permissions.IsAuthenticated, CanCrudPrivateCommentDetail]
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
