from django.contrib import admin
from .models import (
    CourseCategory,
    CourseType,
    Course,
    CourseLesson,
    TopicType,
    LessonTopic
)

@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'category_slug', 'is_active')
    search_fields = ('category_name', 'category_slug')
    prepopulated_fields = {'category_slug': ('category_name',)}
    list_filter = ('is_active',)

@admin.register(CourseType)
class CourseTypeAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'course_slug', 'is_active')
    search_fields = ('course_name', 'course_slug')
    prepopulated_fields = {'course_slug': ('course_name',)}
    list_filter = ('is_active',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'course_category', 'course_type', 'is_free_course', 'course_price', 'is_published', 'is_active', 'created_at')
    search_fields = ('course_title', 'course_slug', 'course_description')
    prepopulated_fields = {'course_slug': ('course_title',)}
    list_filter = ('is_active', 'is_published', 'is_free_course', 'course_category', 'course_type')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(CourseLesson)
class CourseLessonAdmin(admin.ModelAdmin):
    list_display = ('lesson_title', 'course', 'lesson_order', 'is_active', 'created_at')
    search_fields = ('lesson_title', 'lesson_slug', 'lesson_description')
    prepopulated_fields = {'lesson_slug': ('lesson_title',)}
    list_filter = ('is_active', 'course')
    ordering = ('lesson_order',)

@admin.register(TopicType)
class TopicTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'topic_slug', 'is_active', 'created_at')
    search_fields = ('type_name', 'topic_slug')
    prepopulated_fields = {'topic_slug': ('type_name',)}
    list_filter = ('is_active',)

@admin.register(LessonTopic)
class LessonTopicAdmin(admin.ModelAdmin):
    list_display = ('topic_title', 'lesson', 'type', 'topic_order', 'is_active', 'created_at')
    search_fields = ('topic_title', 'topic_slug', 'topic_content')
    prepopulated_fields = {'topic_slug': ('topic_title',)}
    list_filter = ('is_active', 'lesson', 'type')
    ordering = ('topic_order',)
