from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from .models import Comment
from .serializers import CommentWriteSerializer, CommentReadSerializer
from api.permissions import IsOwnerOrReadOnly


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()

    def get_queryset(self):
        res = super().get_queryset()
        activity_id = self.kwargs.get("activity_id")
        return res.filter(activity_comment__id=activity_id)

    def get_permissions(self):
        if self.action in ("create",):
            self.permission_classes = (IsAuthenticated,)
        elif self.action in ("update", "partial_update", "destroy"):
            self.permission_classes = (IsOwnerOrReadOnly,)
        else:
            self.permission_classes = (AllowAny,)

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ("create", "destroy", "update", "partial_update",):
            return CommentWriteSerializer

        return CommentReadSerializer

