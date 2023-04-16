from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet

app_name = "posts"

router = DefaultRouter()
router.register(r"^(?P<activity_id>\d+)/comment", CommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]