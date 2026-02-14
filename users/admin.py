from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProgress, UserAchievement


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'community', 'total_points', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'community', 'preferred_language']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'phone_number']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone_number', 'community', 'preferred_language', 'date_of_birth', 'total_points')
        }),
    )


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'module', 'lesson', 'status', 'progress_percentage', 'last_accessed']
    list_filter = ['status', 'module']
    search_fields = ['user__username', 'module__title', 'lesson__title']
    date_hierarchy = 'last_accessed'


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'points_awarded', 'earned_at']
    list_filter = ['earned_at']
    search_fields = ['user__username', 'title']
    date_hierarchy = 'earned_at'
