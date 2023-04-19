from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet


router = DefaultRouter()
router.register(r"^(?P<activity_id>\d+)", CommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]