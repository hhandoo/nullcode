from django.contrib import admin
from .models import (
    CourseCategory,
    CourseType,
    Course,
    CourseLesson,
    TopicType,
    LessonTopic,
    CourseComment
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
    list_display = ('topic_title', 'get_lesson_title', 'get_course_title', 'type', 'topic_order', 'is_active', 'created_at')
    search_fields = ('topic_title', 'topic_slug', 'topic_content')
    prepopulated_fields = {'topic_slug': ('topic_title',)}
    list_filter = ('is_active', 'lesson', 'type')
    ordering = ('topic_order',)

    def get_lesson_title(self, obj):
        return obj.lesson.lesson_title
    get_lesson_title.short_description = 'Lesson Title'

    def get_course_title(self, obj):
        return obj.lesson.course.course_title
    get_course_title.short_description = 'Course Title'


class ReplyInline(admin.TabularInline):
    model = CourseComment
    fk_name = 'parent'
    extra = 0
    verbose_name = "Reply"
    verbose_name_plural = "Replies"
    fields = ('content', 'created_at')
    readonly_fields = ('created_at',)
    can_delete = False
    show_change_link = False


@admin.register(CourseComment)
class CourseCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'content', 'parent', 'created_at')
    search_fields = ('content', 'user__username', 'course__course_title')
    list_filter = ('created_at', 'course')
    readonly_fields = ('created_at',)
    inlines = [ReplyInline]

    def save_model(self, request, obj, form, change):
        if not obj.user_id:
            obj.user = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'course', 'parent')
