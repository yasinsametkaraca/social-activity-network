from django.contrib import admin
from .models import Confirmation


class ConfirmationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'activity', 'confirm_status', 'confirm_type', 'created_at')
    list_filter = ('confirm_status', 'confirm_type')
    search_fields = ('employee__email', 'activity__title', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'


admin.site.register(Confirmation, ConfirmationAdmin)