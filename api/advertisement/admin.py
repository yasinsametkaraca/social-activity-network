from django.contrib import admin
from .models import Advertisement


class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'category', 'advertisement_status')
    list_filter = ('category', 'advertisement_status')
    search_fields = ('title', 'description', 'employer__username')


admin.site.register(Advertisement, AdvertisementAdmin)
