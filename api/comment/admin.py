from django.contrib import admin

from .models import Comment


class CommentAdmin(admin.ModelAdmin):
    list_display = ('owner', 'get_activity_title', 'get_activity_owner', 'created_at')
    list_filter = ('is_public', 'created_at', 'last_modified_at')
    search_fields = ('owner__username', 'activity__title', 'activity__owner__username')
    readonly_fields = ('created_at', 'last_modified_at')

    def get_activity_title(self, obj):
        return obj.get_activity_title()

    get_activity_title.short_description = 'Activity Title'
    get_activity_title.admin_order_field = 'activity__title'

    def get_activity_owner(self, obj):
        return obj.get_activity_owner()

    get_activity_owner.short_description = 'Activity Owner'
    get_activity_owner.admin_order_field = 'activity__owner__username'


admin.site.register(Comment, CommentAdmin)