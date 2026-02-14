from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django.utils import timezone

from learning.models import Module, Lesson, AdinkraSymbol, Quiz, UserQuizAttempt
from users.models import User, UserProgress, UserAchievement
from .serializers import (
    ModuleSerializer, ModuleListSerializer, LessonSerializer,
    AdinkraSymbolSerializer, QuizSerializer, UserSerializer,
    UserProgressSerializer, UserAchievementSerializer, UserQuizAttemptSerializer
)


class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for modules
    """
    queryset = Module.objects.filter(is_published=True).prefetch_related('lessons', 'adinkra_symbol')
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    pagination_class = None  # Disable pagination for modules
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ModuleListSerializer
        return ModuleSerializer
    
    @action(detail=True, methods=['get'])
    def progress(self, request, slug=None):
        """Get user's progress for this module"""
        module = self.get_object()
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        progress = UserProgress.objects.filter(user=request.user, module=module)
        serializer = UserProgressSerializer(progress, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for lessons
    """
    queryset = Lesson.objects.filter(is_published=True).select_related('module').prefetch_related('blocks')
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = LessonSerializer
    lookup_field = 'slug'
    pagination_class = None  # Disable pagination for lessons
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, slug=None):
        """Mark a lesson as complete"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        lesson = self.get_object()
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            module=lesson.module,
            lesson=lesson,
            defaults={'status': 'completed', 'progress_percentage': 100, 'completed_at': timezone.now()}
        )
        
        if not created and progress.status != 'completed':
            progress.status = 'completed'
            progress.progress_percentage = 100
            progress.completed_at = timezone.now()
            progress.save()
        
        return Response({'status': 'completed'}, status=status.HTTP_200_OK)


class AdinkraSymbolViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for Adinkra symbols
    """
    queryset = AdinkraSymbol.objects.all()
    serializer_class = AdinkraSymbolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None  # Disable pagination


class UserProgressViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user progress tracking
    """
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user).select_related('module', 'lesson')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user's overall progress statistics"""
        user = request.user
        
        # Get progress data
        completed_lessons = UserProgress.objects.filter(
            user=user, 
            status='completed'
        ).count()
        
        in_progress_lessons = UserProgress.objects.filter(
            user=user, 
            status='in_progress'
        ).count()
        
        # Get quiz attempts
        total_quizzes = UserQuizAttempt.objects.filter(user=user).count()
        passed_quizzes = UserQuizAttempt.objects.filter(user=user, passed=True).count()
        
        # Get module progress
        modules_progress = []
        for module in Module.objects.filter(is_published=True).prefetch_related('lessons'):
            total_lessons = module.lessons.filter(is_published=True).count()
            completed_in_module = UserProgress.objects.filter(
                user=user,
                module=module,
                status='completed'
            ).count()
            
            if total_lessons > 0:
                progress_percentage = int((completed_in_module / total_lessons) * 100)
            else:
                progress_percentage = 0
            
            modules_progress.append({
                'module_id': module.id,
                'module_title': module.title,
                'module_slug': module.slug,
                'total_lessons': total_lessons,
                'completed_lessons': completed_in_module,
                'progress_percentage': progress_percentage
            })
        
        # Get recent activity
        recent_progress = UserProgress.objects.filter(user=user).select_related('lesson', 'module').order_by('-last_accessed')[:5]
        recent_activity = []
        for progress in recent_progress:
            if progress.lesson and progress.module:
                recent_activity.append({
                    'lesson_title': progress.lesson.title,
                    'module_title': progress.module.title,
                    'status': progress.status,
                    'updated_at': progress.last_accessed.isoformat()
                })
        
        return Response({
            'total_points': user.total_points,
            'completed_lessons': completed_lessons,
            'in_progress_lessons': in_progress_lessons,
            'total_quiz_attempts': total_quizzes,
            'passed_quizzes': passed_quizzes,
            'modules_progress': modules_progress,
            'recent_activity': recent_activity
        })


class UserAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for user achievements
    """
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for quizzes
    """
    queryset = Quiz.objects.all().prefetch_related('questions__answers')
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None  # Disable pagination
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit quiz answers and calculate score"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        
        # Calculate score
        total_questions = quiz.questions.count()
        correct_answers = 0
        total_points = 0
        earned_points = 0
        
        for question in quiz.questions.all():
            total_points += question.points
            user_answer_id = answers.get(str(question.id))
            
            if user_answer_id:
                try:
                    user_answer = question.answers.get(id=user_answer_id)
                    if user_answer.is_correct:
                        earned_points += question.points
                        correct_answers += 1
                except:
                    pass
        
        percentage = int((earned_points / total_points) * 100) if total_points > 0 else 0
        passed = percentage >= quiz.passing_score
        
        # Record attempt
        attempt = UserQuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=percentage,
            passed=passed,
            completed_at=timezone.now()
        )
        
        # Award points if passed
        if passed:
            request.user.total_points += earned_points
            request.user.save()
        
        return Response({
            'score': correct_answers,
            'total_questions': total_questions,
            'percentage': percentage,
            'passed': passed,
            'earned_points': earned_points if passed else 0,
            'total_points': total_points
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for user profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def platform_stats(request):
    """
    Get platform-wide statistics
    """
    from django.db.models import Count, Sum
    
    # Count total active learners (users who have made progress)
    active_learners = User.objects.filter(
        progress__isnull=False
    ).distinct().count()
    
    # If no progress yet, show total registered users
    if active_learners == 0:
        active_learners = User.objects.count()
    
    # Count published modules
    total_modules = Module.objects.filter(is_published=True).count()
    
    # Count published lessons
    total_lessons = Lesson.objects.filter(is_published=True).count()
    
    # Count total quiz attempts (engagement metric)
    total_quiz_attempts = UserQuizAttempt.objects.count()
    
    # Count completed lessons (achievement metric)
    completed_lessons = UserProgress.objects.filter(status='completed').count()
    
    return Response({
        'active_learners': active_learners,
        'total_modules': total_modules,
        'total_lessons': total_lessons,
        'total_quiz_attempts': total_quiz_attempts,
        'completed_lessons': completed_lessons,
    })
