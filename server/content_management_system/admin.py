from django.contrib import admin
from .models import CourseCategory, CourseType, Course, CourseLesson, TopicType, LessonTopic

@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(CourseType)
class CourseTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'course_category', 'course_type', 'course_price', 'is_free_course', 'is_published', 'is_active')
    list_filter = ('course_category', 'course_type', 'is_free_course', 'is_published', 'is_active')
    search_fields = ('course_title', 'course_slug')
    prepopulated_fields = {'course_slug': ('course_title',)}
    date_hierarchy = 'created_at'
    list_editable = ('is_published', 'is_active')

@admin.register(CourseLesson)
class CourseLessonAdmin(admin.ModelAdmin):
    list_display = ('lesson_title', 'course', 'lesson_order', 'is_active')
    list_filter = ('course', 'is_active')
    search_fields = ('lesson_title', 'lesson_slug')
    prepopulated_fields = {'lesson_slug': ('lesson_title',)}
    list_editable = ('lesson_order', 'is_active')
    ordering = ('course', 'lesson_order')

@admin.register(TopicType)
class TopicTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'topic_slug', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('type_name', 'topic_slug')
    prepopulated_fields = {'topic_slug': ('type_name',)}

@admin.register(LessonTopic)
class LessonTopicAdmin(admin.ModelAdmin):
    list_display = ('topic_title', 'lesson', 'type', 'topic_order', 'is_active')
    list_filter = ('lesson__course', 'type', 'is_active')
    search_fields = ('topic_title', 'topic_slug')
    prepopulated_fields = {'topic_slug': ('topic_title',)}
    list_editable = ('topic_order', 'is_active')
    ordering = ('lesson', 'topic_order')