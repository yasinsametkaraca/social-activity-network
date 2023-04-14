from django.contrib import admin
from .models import Profile, Friendship


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'education_level', 'get_following_count', 'get_follower_count', 'created_at', 'last_modified_at')
    list_filter = ('gender', 'education_level', 'created_at')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'last_modified_at')
    filter_horizontal = ('following', 'follower', 'friends',)
    fieldsets = (
        ('User Info', {
            'fields': ('user', 'avatar')
        }),
        ('Profile Info', {
            'fields': ('about', 'birth_date', 'gender', 'education_level', 'website_url', 'linkedin_url', 'company_name', 'company_url', 'address')
        }),
        ('Friends', {
            'fields': ('following', 'follower', 'friends')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_modified_at')
        }),
    )


class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('from_id', 'to_id', 'status', 'created_at', 'last_modified_at')
    list_filter = ('status', 'created_at')
    search_fields = ('from_id__user__username', 'to_id__user__username', 'from_id__user__first_name', 'from_id__user__last_name', 'to_id__user__first_name', 'to_id__user__last_name')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'last_modified_at')


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Friendship, FriendshipAdmin)