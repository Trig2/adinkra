from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """

    phone_number = models.CharField(max_length=15, blank=True, null=True)
    community = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Community or association the user belongs to",
    )
    preferred_language = models.CharField(
        max_length=10,
        default="en",
        choices=[("en", "English"), ("tw", "Twi"), ("ga", "Ga")],
    )
    date_of_birth = models.DateField(blank=True, null=True)
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.username


class UserProgress(models.Model):
    """
    Tracks user progress through modules and lessons
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progress")
    module = models.ForeignKey("learning.Module", on_delete=models.CASCADE)
    lesson = models.ForeignKey(
        "learning.Lesson", on_delete=models.CASCADE, null=True, blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("not_started", "Not Started"),
            ("in_progress", "In Progress"),
            ("completed", "Completed"),
        ],
        default="not_started",
    )
    progress_percentage = models.IntegerField(default=0)
    time_spent_minutes = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "User Progress"
        verbose_name_plural = "User Progress Records"
        unique_together = ["user", "module", "lesson"]

    def __str__(self):
        return f"{self.user.username} - {self.module.title}"


class UserAchievement(models.Model):
    """
    Tracks badges and achievements earned by users
    """

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="achievements"
    )
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="Icon name or emoji")
    points_awarded = models.IntegerField(default=0)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Achievement"
        verbose_name_plural = "User Achievements"

    def __str__(self):
        return f"{self.user.username} - {self.title}"
