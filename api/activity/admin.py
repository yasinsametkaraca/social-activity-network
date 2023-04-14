from django.contrib import admin
from .models import Activity, Category, ActivityUser


class ActivityUserInline(admin.TabularInline):
    model = ActivityUser
    extra = 1


class ActivityAdmin(admin.ModelAdmin):
    inlines = [ActivityUserInline]
    list_display = ('title', 'owner', 'category', 'total_player_count', 'missing_player_count', 'activity_status')
    list_filter = ('owner', 'category', 'activity_status')
    search_fields = ('title', 'owner__username', 'category__name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'owner', 'category', 'description', 'address', 'image', 'start_date', 'end_date', 'activity_price', 'activity_status', 'confirm', 'add_favourite')
        }),
        ('Advanced Options', {
            'classes': ('collapse',),
            'fields': ('total_player_count', 'missing_player_count')
        }),
    )
    readonly_fields = ('missing_player_count',)

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.activity_status:
            return ('missing_player_count',)
        return super().get_readonly_fields(request, obj)

    def get_inline_instances(self, request, obj=None):
        if obj:
            return []
        return super().get_inline_instances(request, obj)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


class ActivityUserAdmin(admin.ModelAdmin):
    list_display = ('activity', 'user', 'status', 'apply_date')
    list_filter = ('activity__title', 'user__username', 'status')
    search_fields = ('activity__title', 'user__username')
    date_hierarchy = 'apply_date'
    ordering = ('-apply_date',)


admin.site.register(Category, CategoryAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(ActivityUser, ActivityUserAdmin)