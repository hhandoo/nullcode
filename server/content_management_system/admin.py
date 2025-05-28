# admin.py
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet
from django.utils.translation import gettext_lazy as _
from django.db import models

from .models import (
    CourseCategory, CourseType, Course, CourseLesson, TopicType, LessonTopic,
    CourseComment, AuthorDetails, ContactDetails, CourseRating
)

from user_management_system.models import CustomUser


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




class ContactDetailsInline(admin.TabularInline):
    model = ContactDetails
    extra = 1
    verbose_name = "Contact Detail"
    verbose_name_plural = "Contact Details"


@admin.register(AuthorDetails)
class AuthorDetailsAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'designation', 'is_active', 'consent_given')
    search_fields = ('user__username', 'course__course_title', 'designation')
    list_filter = ('is_active', 'course')
    autocomplete_fields = ['user', 'course']
    inlines = [ContactDetailsInline]

    def get_readonly_fields(self, request, obj=None):
        if obj is not None:
            if request.user == obj.user:
                return []
            else:
                return ['is_active', 'consent_given']
        return ['is_active', 'consent_given']

    def has_change_permission(self, request, obj=None):
        if obj is not None:
            if request.user == obj.user or request.user.is_superuser:
                return True
            return False
        return super().has_change_permission(request, obj=obj)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Only show AuthorDetails where user = logged-in user
        return qs.filter(user=request.user)



class AuthorDetailsInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if not hasattr(self, 'instance') or not self.instance:
            return

        creator = self.instance.created_by
        for form in self.forms:
            if form.cleaned_data.get('DELETE'):
                continue
            user = form.cleaned_data.get('user')
            if user and user == creator:
                raise ValidationError(
                    _('The course creator is already the default author. Please do not add them as a co-author.'),
                    code='invalid_coauthor'
                )


class AuthorDetailsInline(admin.StackedInline):
    model = AuthorDetails
    formset = AuthorDetailsInlineFormSet
    extra = 1
    verbose_name = "Co-Author Detail"
    verbose_name_plural = "Co-Author Details"
    inlines = [ContactDetailsInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(user=models.F('course__created_by'))

    def get_readonly_fields(self, request, obj=None):
        # In inline editing from Course admin, make both fields readonly
        return ['is_active', 'consent_given']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'created_by', 'is_published')
    readonly_fields = ('created_by',)
    search_fields = ('course_title',)
    inlines = [AuthorDetailsInline]

    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.created_by != request.user:
            return False
        return super().has_change_permission(request, obj=obj)

    def has_delete_permission(self, request, obj=None):
        if obj is not None and obj.created_by != request.user:
            return False
        return super().has_delete_permission(request, obj=obj)

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Creating a new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)


@admin.register(CourseLesson)
class CourseLessonAdmin(admin.ModelAdmin):
    list_display = ('lesson_title', 'course', 'lesson_order', 'is_active', 'created_at')
    search_fields = ('lesson_title', 'lesson_slug', 'lesson_description')
    prepopulated_fields = {'lesson_slug': ('lesson_title',)}
    list_filter = ('is_active', 'course')
    ordering = ('lesson_order',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)



@admin.register(TopicType)
class TopicTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'topic_slug', 'is_active', 'created_at')
    search_fields = ('type_name', 'topic_slug')  # removed user__username
    prepopulated_fields = {'topic_slug': ('type_name',)}
    list_filter = ('is_active',)  # removed user


    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)




@admin.register(LessonTopic)
class LessonTopicAdmin(admin.ModelAdmin):
    list_display = ('topic_title', 'get_lesson_title', 'get_course_title', 'type', 'topic_order', 'is_active', 'created_at')
    search_fields = ('topic_title', 'topic_slug', 'topic_content')  # NO 'user__username'
    prepopulated_fields = {'topic_slug': ('topic_title',)}
    list_filter = ('is_active', 'lesson', 'type')  # NO 'user' here either
    ordering = ('topic_order',)

    def get_lesson_title(self, obj):
        return obj.lesson.lesson_title
    get_lesson_title.short_description = 'Lesson Title'

    def get_course_title(self, obj):
        return obj.lesson.course.course_title
    get_course_title.short_description = 'Course Title'


    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)



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
        if request.user.is_superuser:
            return qs
        # Only show AuthorDetails where user = logged-in user
        return qs.filter(user=request.user).select_related('user', 'course', 'parent')



@admin.register(CourseRating)
class CourseRatingAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'created_at')
    search_fields = ('course__course_title', 'user__username')
    list_filter = ('rating', 'created_at')
    readonly_fields = ('created_at',)
