from django.contrib import admin
from .models import Notification


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'type', 'created_at', 'is_read')
    list_filter = ('type', 'created_at', 'is_read')
    search_fields = ('receiver__username', 'type')
    date_hierarchy = 'created_at'


admin.site.register(Notification, NotificationAdmin)
