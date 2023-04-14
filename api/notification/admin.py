from django.contrib import admin
from .models import Notification


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'type', 'created_at', 'is_read')
    list_filter = ('type', 'created_at', 'is_read')
    search_fields = ('sender__username', 'receiver__username')
    date_hierarchy = 'created_at'


admin.site.register(Notification, NotificationAdmin)