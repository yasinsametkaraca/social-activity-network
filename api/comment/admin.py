from django.contrib import admin

from .models import Comment


class CommentAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'get_activity_title', 'get_activity_owner', 'created_at', 'last_modified_at', 'is_public')
    list_filter = ('is_public',)
    search_fields = ('user_id__username', 'activity_comment__title')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'last_modified_at')
    raw_id_fields = ('user_id', 'activity_comment')
    autocomplete_fields = ['user_id', 'activity_comment']
    fieldsets = (
        ('Comment Information', {
            'fields': ('user_id', 'activity_comment', 'comment', 'is_public')
        }),
        ('System Information', {
            'fields': ('created_at', 'last_modified_at'),
            'classes': ('collapse',)
        })
    )


admin.site.register(Comment, CommentAdmin)
