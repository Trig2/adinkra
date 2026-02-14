from django.contrib import admin
from .models import (
    AdinkraSymbol, Module, Lesson, ContentBlock, 
    Quiz, Question, Answer, UserQuizAttempt
)


@admin.register(AdinkraSymbol)
class AdinkraSymbolAdmin(admin.ModelAdmin):
    list_display = ['name', 'pronunciation']
    search_fields = ['name', 'meaning']


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'content_type', 'estimated_duration_minutes', 'is_published']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'adinkra_symbol', 'digital_literacy_topic', 'difficulty_level', 'order', 'is_published']
    list_filter = ['difficulty_level', 'is_published']
    search_fields = ['title', 'description', 'digital_literacy_topic']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline]


class ContentBlockInline(admin.TabularInline):
    model = ContentBlock
    extra = 1
    fields = ['order', 'block_type', 'content']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'content_type', 'estimated_duration_minutes', 'is_published']
    list_filter = ['module', 'content_type', 'is_published']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ContentBlockInline]


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'order', 'block_type']
    list_filter = ['block_type', 'lesson__module']


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ['question_text', 'question_type', 'order', 'points']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'passing_score']
    search_fields = ['title', 'description']
    inlines = [QuestionInline]


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 3
    fields = ['answer_text', 'is_correct', 'order']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'question_text', 'question_type', 'order', 'points']
    list_filter = ['question_type', 'quiz__lesson__module']
    inlines = [AnswerInline]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'answer_text', 'is_correct']
    list_filter = ['is_correct']


@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'passed', 'started_at', 'completed_at']
    list_filter = ['passed', 'quiz']
    search_fields = ['user__username', 'quiz__title']
    date_hierarchy = 'started_at'
