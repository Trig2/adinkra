from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ModuleViewSet, LessonViewSet, AdinkraSymbolViewSet,
    UserProgressViewSet, UserAchievementViewSet, QuizViewSet, UserViewSet,
    platform_stats
)

router = DefaultRouter()
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'adinkra-symbols', AdinkraSymbolViewSet, basename='adinkra-symbol')
router.register(r'progress', UserProgressViewSet, basename='user-progress')
router.register(r'achievements', UserAchievementViewSet, basename='user-achievement')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', platform_stats, name='platform-stats'),
]