from django.contrib import admin
from django.urls import path, include, re_path
from django.urls import path, include
from rest_framework import routers, serializers, viewsets
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView,
)
from account.models import MyUser
from django.conf.urls.static import static
from django.conf import settings
from api.serializers import CustomTokenObtainPairSerializer


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MyUser
        fields = ['url', 'username', 'email', 'is_staff']


class UserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


schema_view = get_schema_view(
   openapi.Info(
      title="Social Activity Network API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/v1/token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/addresses/', include('address.urls'), name='address'),
    path('api/v1/accounts/', include('account.urls'), name='account'),
    path('api/v1/profiles/', include('userprofile.urls'), name='userprofile'),
    path('api/v1/notifications/', include('notification.urls'), name='notification'),
    path('api/v1/activities/', include('activity.urls'), name='activity'),
    path('api/v1/comments/', include('comment.urls'), name='comment'),
    path('api/v1/advertisements/', include('advertisement.urls'), name='advertisement'),
    path('api/v1/companies/', include('company.urls'), name='company'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Social Activity Network Panel"
admin.site.site_title = "Social Activity Network Portal"
admin.site.index_title = "Welcome to Social Activity Network Portal"
