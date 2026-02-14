from django.db import models
from django.utils.text import slugify


class AdinkraSymbol(models.Model):
    """
    Adinkra symbols used throughout the platform
    """

    name = models.CharField(max_length=100, unique=True)
    meaning = models.TextField()
    cultural_significance = models.TextField()
    image = models.ImageField(upload_to="adinkra_symbols/", blank=True, null=True)
    pronunciation = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Adinkra Symbol"
        verbose_name_plural = "Adinkra Symbols"


class Module(models.Model):
    """
    Learning modules (e.g., Gye Nyame - Cybersecurity)
    """

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    adinkra_symbol = models.ForeignKey(
        AdinkraSymbol, on_delete=models.SET_NULL, null=True, related_name="modules"
    )
    digital_literacy_topic = models.CharField(
        max_length=100, help_text="E.g., Cybersecurity, WhatsApp, Mobile Money"
    )
    order = models.IntegerField(default=0, help_text="Display order")
    estimated_duration_minutes = models.IntegerField(default=30)
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ],
        default="beginner",
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]
        verbose_name = "Module"
        verbose_name_plural = "Modules"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    """
    Individual lessons within a module
    """

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)
    order = models.IntegerField(default=0)
    content_type = models.CharField(
        max_length=20,
        choices=[
            ("text", "Text"),
            ("video", "Video"),
            ("interactive", "Interactive"),
            ("quiz", "Quiz"),
        ],
        default="text",
    )
    content = models.TextField(help_text="Main lesson content")
    video_url = models.URLField(blank=True, null=True)
    estimated_duration_minutes = models.IntegerField(default=10)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["module", "order"]
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"
        unique_together = ["module", "slug"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class ContentBlock(models.Model):
    """
    Individual content blocks within a lesson (for more granular control)
    """

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="blocks")
    order = models.IntegerField(default=0)
    block_type = models.CharField(
        max_length=20,
        choices=[
            ("heading", "Heading"),
            ("text", "Text"),
            ("image", "Image"),
            ("video", "Video"),
            ("tip", "Tip"),
            ("warning", "Warning"),
            ("example", "Example"),
        ],
    )
    content = models.TextField()
    image = models.ImageField(upload_to="lesson_images/", blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ["lesson", "order"]
        verbose_name = "Content Block"
        verbose_name_plural = "Content Blocks"

    def __str__(self):
        return f"{self.lesson.title} - {self.block_type} {self.order}"


class Quiz(models.Model):
    """
    Quiz associated with a lesson
    """

    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name="quiz")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    passing_score = models.IntegerField(
        default=70, help_text="Percentage required to pass"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return f"Quiz: {self.title}"


class Question(models.Model):
    """
    Questions for quizzes
    """

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    question_type = models.CharField(
        max_length=20,
        choices=[
            ("multiple_choice", "Multiple Choice"),
            ("true_false", "True/False"),
            ("short_answer", "Short Answer"),
        ],
        default="multiple_choice",
    )
    order = models.IntegerField(default=0)
    points = models.IntegerField(default=1)
    explanation = models.TextField(
        blank=True, help_text="Explanation shown after answering"
    )

    class Meta:
        ordering = ["quiz", "order"]
        verbose_name = "Question"
        verbose_name_plural = "Questions"

    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"


class Answer(models.Model):
    """
    Possible answers for quiz questions
    """

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["question", "order"]
        verbose_name = "Answer"
        verbose_name_plural = "Answers"

    def __str__(self):
        return f"{self.question} - {self.answer_text[:50]}"


class UserQuizAttempt(models.Model):
    """
    Records user attempts at quizzes
    """

    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="quiz_attempts"
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Quiz Attempt"
        verbose_name_plural = "Quiz Attempts"
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}%"
