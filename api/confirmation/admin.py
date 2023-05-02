from django.contrib import admin
from .models import Confirmation, AdvertisementConfirmation


class ConfirmationAdmin(admin.ModelAdmin):
    list_display = ('activity', 'confirm_status', 'confirm_type', 'created_at', 'employee')
    readonly_fields = ('employee',)
    list_filter = ('confirm_status', 'confirm_type')
    search_fields = ('employee__email', 'activity__title', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    def save_model(self, request, obj, form, change):
        obj.employee = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Confirmation, ConfirmationAdmin)


class AdvertisementConfirmationAdmin(admin.ModelAdmin):
    list_display = ('advertisement', 'confirm_status', 'confirm_type', 'created_at', 'employee')
    list_filter = ('confirm_status', 'confirm_type')
    search_fields = ('employee__email', 'advertisement__title', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('employee', )

    def save_model(self, request, obj, form, change):
        obj.employee = request.user
        super().save_model(request, obj, form, change)


admin.site.register(AdvertisementConfirmation, AdvertisementConfirmationAdmin)

