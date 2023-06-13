from django.urls import path
from .views import ShowNotifications, NotificationRead

urlpatterns = [
    path('', ShowNotifications.as_view(), name='show_notifications'),
    path('<str:pk>/', NotificationRead.as_view(), name='notification_read'),
]