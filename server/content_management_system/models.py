from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

User = get_user_model()

class CourseCategory(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    category_slug = models.SlugField(max_length=100, unique=True)
    category_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Course Category"
        verbose_name_plural = "Course Categories"
        ordering = ['category_name']

    def __str__(self):
        return self.category_name

    def save(self, *args, **kwargs):
        if not self.category_slug:
            self.category_slug = slugify(self.category_name)
        super().save(*args, **kwargs)

class CourseType(models.Model):
    course_name = models.CharField(max_length=100, unique=True)
    course_slug = models.SlugField(max_length=100, unique=True)
    course_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Course Type"
        verbose_name_plural = "Course Types"
        ordering = ['course_name']

    def __str__(self):
        return self.course_name

    def save(self, *args, **kwargs):
        if not self.course_slug:
            self.course_slug = slugify(self.course_name)
        super().save(*args, **kwargs)

class Course(models.Model):
    course_category = models.ForeignKey(
        CourseCategory, 
        on_delete=models.CASCADE,
        related_name='courses'
    )
    course_type = models.ForeignKey(
        CourseType, 
        on_delete=models.CASCADE,
        related_name='courses'
    )
    course_title = models.CharField(max_length=200)
    course_slug = models.SlugField(max_length=200, unique=True, blank=True)
    course_description = models.TextField(max_length=2000)
    course_banner = models.ImageField(
        upload_to='course_banners/', 
        blank=True, 
        null=True
    )
    course_views = models.PositiveIntegerField(default=0)
    is_free_course = models.BooleanField(default=True)
    course_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
    )
    authors = models.ManyToManyField(
        'user_management_system.CustomUser',
        through='AuthorDetails',
        related_name='authored_courses'
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_courses'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['course_title']),
            models.Index(fields=['course_description']),
            models.Index(fields=['is_published']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.course_title

    def save(self, *args, **kwargs):
        if not self.course_slug:
            base_slug = slugify(self.course_title)
            slug = base_slug
            counter = 1
            while Course.objects.filter(course_slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.course_slug = slug
        super().save(*args, **kwargs)

class CourseRating(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='ratings'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='course_ratings'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    review = models.TextField(blank=True, null=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Course Rating"
        verbose_name_plural = "Course Ratings"
        unique_together = ('course', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} rated {self.course.course_title} - {self.rating}"

class AuthorDetails(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='author_details'
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name="co_authors"
    )
    designation = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    consent_given = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    consent_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'course')
        verbose_name = "Author Detail"
        verbose_name_plural = "Author Details"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.consent_given and not self.consent_date:
            self.consent_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.designation}"

class ContactDetails(models.Model):
    CONTACT_TYPES = (
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('website', 'Website'),
        ('social', 'Social Media'),
    )
    
    author = models.ForeignKey(
        AuthorDetails, 
        on_delete=models.CASCADE, 
        related_name='contact_details'
    )
    contact_type = models.CharField(
        max_length=50,
        choices=CONTACT_TYPES
    )
    contact_value = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contact_details',
        editable=False
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Contact Detail"
        verbose_name_plural = "Contact Details"
        ordering = ['contact_type']

    def __str__(self):
        return f"{self.get_contact_type_display()}: {self.contact_value}"

class CourseComment(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='course_comments'
    )
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name='replies'
    )
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course Comment"
        verbose_name_plural = "Course Comments"
        ordering = ['-created_at']

    def __str__(self):
        prefix = "Reply" if self.parent else "Comment"
        return f"{prefix} by {self.user.username} on {self.course.course_title}"

class CourseLesson(models.Model):
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    lesson_title = models.CharField(max_length=200)
    lesson_slug = models.SlugField(max_length=200, blank=True)
    lesson_description = models.TextField()
    lesson_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_lessons'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course Lesson"
        verbose_name_plural = "Course Lessons"
        ordering = ['lesson_order']
        unique_together = ('course', 'lesson_slug')

    def __str__(self):
        return f"{self.course.course_title} - {self.lesson_title}"

    def save(self, *args, **kwargs):
        if not self.lesson_slug:
            base_slug = slugify(self.lesson_title)
            slug = base_slug
            counter = 1
            while CourseLesson.objects.filter(
                course=self.course, 
                lesson_slug=slug
            ).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.lesson_slug = slug
        super().save(*args, **kwargs)

class TopicType(models.Model):
    type_name = models.CharField(max_length=200, unique=True)
    topic_slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_topic_types'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Topic Type"
        verbose_name_plural = "Topic Types"
        ordering = ['type_name']

    def __str__(self):
        return self.type_name

    def save(self, *args, **kwargs):
        if not self.topic_slug:
            self.topic_slug = slugify(self.type_name)
        super().save(*args, **kwargs)

class LessonTopic(models.Model):
    lesson = models.ForeignKey(
        CourseLesson, 
        on_delete=models.CASCADE,
        related_name='topics'
    )
    type = models.ForeignKey(
        TopicType, 
        on_delete=models.CASCADE,
        related_name='lesson_topics'
    )
    topic_title = models.CharField(max_length=200)
    topic_slug = models.SlugField(max_length=200, blank=True)
    topic_content = models.TextField()
    topic_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_topics'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Lesson Topic"
        verbose_name_plural = "Lesson Topics"
        ordering = ['topic_order']
        unique_together = ('lesson', 'topic_slug')

    def __str__(self):
        return self.topic_title

    def save(self, *args, **kwargs):
        if not self.topic_slug:
            base_slug = slugify(self.topic_title)
            slug = base_slug
            counter = 1
            while LessonTopic.objects.filter(
                lesson=self.lesson, 
                topic_slug=slug
            ).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.topic_slug = slug
        super().save(*args, **kwargs)

# Signal handlers
@receiver(post_save, sender=CourseLesson)
@receiver(post_delete, sender=CourseLesson)
@receiver(post_save, sender=LessonTopic)
@receiver(post_delete, sender=LessonTopic)
@receiver(post_save, sender=AuthorDetails)
@receiver(post_delete, sender=AuthorDetails)
def update_course_modified_date(sender, instance, **kwargs):
    """Update parent course's modified date when related objects change"""
    course = None
    if hasattr(instance, 'course'):
        course = instance.course
    elif hasattr(instance, 'lesson'):
        course = instance.lesson.course
    
    if course:
        course.updated_at = timezone.now()
        course.save(update_fields=['updated_at'])