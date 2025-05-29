# models.py
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class CourseCategory(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    category_slug = models.SlugField(max_length=100, unique=True)
    category_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course Category"
        verbose_name_plural = "Course Categories"

    def __str__(self):
        return self.category_name


class CourseType(models.Model):
    course_name = models.CharField(max_length=100, unique=True)
    course_slug = models.SlugField(max_length=100, unique=True)
    course_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course Type"
        verbose_name_plural = "Course Types"

    def __str__(self):
        return self.course_name


class Course(models.Model):
    course_category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    course_type = models.ForeignKey(CourseType, on_delete=models.CASCADE)
    course_title = models.CharField(max_length=200)
    course_slug = models.SlugField(max_length=200, unique=True, blank=True)
    course_description = models.TextField()
    course_banner = models.ImageField(upload_to='course_banners/', blank=True, null=True)
    course_views = models.IntegerField(default=0)
    is_free_course = models.BooleanField(default=True)
    course_price = models.DecimalField(max_digits=10, decimal_places=2)
    authors = models.ManyToManyField(
        'user_management_system.CustomUser',
        through='AuthorDetails',
        related_name='authored_courses'
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_courses'
    )
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        indexes = [
            models.Index(fields=['course_title']),
            models.Index(fields=['course_description']),
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
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()  # Typically 1-5
    review = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Course Rating"
        verbose_name_plural = "Course Ratings"
        unique_together = ('course', 'user')

    def __str__(self):
        return f"{self.user.username} rated {self.course.course_title} - {self.rating}"


class AuthorDetails(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="co_authors")
    designation = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    consent_given = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    consent_date = models.DateTimeField(null=True, blank=True)


    def save(self, *args, **kwargs):
        # Automatically update consent_date when consent_given changes
        if self.pk is not None:
            original = AuthorDetails.objects.get(pk=self.pk)
            if not original.consent_given and self.consent_given:
                self.consent_date = timezone.now()
        elif self.consent_given:
            self.consent_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.designation}"



class ContactDetails(models.Model):
    author = models.ForeignKey(AuthorDetails, on_delete=models.CASCADE, related_name='contact_details')
    contact_type = models.CharField(max_length=100)  # e.g., "Email", "LinkedIn", "Phone"
    contact_value = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contact_details'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Contact Detail"
        verbose_name_plural = "Contact Details"

    def __str__(self):
        return f"{self.contact_type}: {self.contact_value}"


class CourseComment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Course Comment"
        verbose_name_plural = "Course Comments"
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.content[:30]}'


class CourseLesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    lesson_title = models.CharField(max_length=200)
    lesson_slug = models.SlugField(max_length=200)
    lesson_description = models.TextField()
    lesson_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_lesson'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Course Lesson"
        verbose_name_plural = "Course Lessons"
        ordering = ['lesson_order']

    def __str__(self):
        return f"{self.course.course_title} - {self.lesson_title}"


class TopicType(models.Model):
    type_name = models.CharField(max_length=200)
    topic_slug = models.SlugField(max_length=200)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='topic_type'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Topic Type"
        verbose_name_plural = "Topic Types"

    def __str__(self):
        return self.type_name


class LessonTopic(models.Model):
    lesson = models.ForeignKey(CourseLesson, on_delete=models.CASCADE)
    type = models.ForeignKey(TopicType, on_delete=models.CASCADE)
    topic_order = models.IntegerField(default=0)
    topic_title = models.CharField(max_length=200)
    topic_slug = models.SlugField(max_length=200)
    topic_content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_topic'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Lesson Topic"
        verbose_name_plural = "Lesson Topics"
        ordering = ['topic_order']

    def __str__(self):
        return self.topic_title
