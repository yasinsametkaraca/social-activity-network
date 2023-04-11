from django.contrib import admin

from account.models import MyUser
from django.contrib.auth.admin import UserAdmin


# Register your models here.

@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'identification_number', 'email')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'role', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_superuser', 'is_active')}
         ),
    )
