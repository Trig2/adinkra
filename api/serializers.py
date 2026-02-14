from rest_framework import serializers
from learning.models import (
    AdinkraSymbol, Module, Lesson, ContentBlock, 
    Quiz, Question, Answer, UserQuizAttempt
)
from users.models import User, UserProgress, UserAchievement


class AdinkraSymbolSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdinkraSymbol
        fields = '__all__'


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ['id', 'order', 'block_type', 'content', 'image', 'video_url']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'order', 'points', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'passing_score', 'questions']


class LessonSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True, read_only=True)
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'slug', 'order', 'content_type', 'content', 
                  'video_url', 'estimated_duration_minutes', 'blocks', 'quiz']


class LessonListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing lessons"""
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'slug', 'order', 'content_type', 'estimated_duration_minutes']


class ModuleSerializer(serializers.ModelSerializer):
    adinkra_symbol = AdinkraSymbolSerializer(read_only=True)
    lessons = LessonListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'slug', 'description', 'adinkra_symbol', 
                  'digital_literacy_topic', 'estimated_duration_minutes', 
                  'difficulty_level', 'lessons']


class ModuleListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing modules"""
    adinkra_symbol = AdinkraSymbolSerializer(read_only=True)
    lesson_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'slug', 'description', 'adinkra_symbol', 
                  'digital_literacy_topic', 'estimated_duration_minutes', 
                  'difficulty_level', 'lesson_count']
    
    def get_lesson_count(self, obj):
        return obj.lessons.filter(is_published=True).count()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'community', 'preferred_language', 
                  'total_points', 'date_joined']
        read_only_fields = ['total_points', 'date_joined']


class UserProgressSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = UserProgress
        fields = ['id', 'module', 'module_title', 'lesson', 'lesson_title', 
                  'status', 'progress_percentage', 'time_spent_minutes', 
                  'last_accessed', 'completed_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAchievement
        fields = ['id', 'title', 'description', 'icon', 'points_awarded', 'earned_at']


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'quiz', 'quiz_title', 'score', 'passed', 
                  'started_at', 'completed_at']
