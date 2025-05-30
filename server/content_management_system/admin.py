from django.contrib import admin
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.forms.models import BaseInlineFormSet
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils.html import format_html
from django.urls import reverse
from django.shortcuts import redirect, get_object_or_404
from django import forms
from .models import (
    CourseCategory, CourseType, Course, CourseLesson, TopicType, LessonTopic,
    CourseComment, AuthorDetails, ContactDetails, CourseRating
)
from user_management_system.models import CustomUser
from django.contrib import messages
from django.forms import ModelForm
from django.db import IntegrityError

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




class ContactDetailsInline(admin.StackedInline):
    model = ContactDetails
    extra = 1
    can_delete = True

@admin.register(AuthorDetails)
class AuthorDetailsAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'designation', 'is_active', 'consent_given')
    search_fields = ('user__username', 'course__course_title', 'designation')
    list_filter = ('is_active', 'course')
    autocomplete_fields = ['user', 'course']
    inlines = [ContactDetailsInline]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        # Save new or changed instances
        for instance in instances:
            if not instance.pk:
                instance.created_by = request.user
            instance.save()

        # Handle deletions
        for obj in formset.deleted_objects:
            obj.delete()

        formset.save_m2m()


    def get_fields(self, request, obj=None):
        if obj and obj.user == request.user:
            return ['user', 'course', 'designation', 'consent_given']
        elif obj:
            return ['user', 'course', 'designation', 'is_active']
        else:
            return ['user', 'course', 'designation']

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.user == request.user:
            return ['user', 'course', 'designation', 'created_at', 'consent_date']
        elif obj:
            return ['created_at', 'consent_date', 'consent_given']
        else:
            return ['created_at', 'consent_date']

    def has_change_permission(self, request, obj=None):
        if obj:
            return obj.user == request.user or request.user.is_superuser or obj.course.created_by == request.user
        return super().has_change_permission(request, obj)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(models.Q(user=request.user) | models.Q(course__created_by=request.user))

class AuthorDetailsInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if not self.instance or not self.instance.pk:
            return
        creator = self.instance.created_by
        for form in self.forms:
            if form.cleaned_data.get('DELETE'):
                continue
            user = form.cleaned_data.get('user')
            if user == creator:
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

    def get_fields(self, request, obj=None):
        return ['user', 'designation']

    def get_readonly_fields(self, request, obj=None):
        return []

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            try:
                creator = request._obj_.created_by
                kwargs["queryset"] = CustomUser.objects.exclude(pk=creator.pk)
            except AttributeError:
                kwargs["queryset"] = CustomUser.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(user=models.F('course__created_by'))

    def get_formset(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super().get_formset(request, obj, **kwargs)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'course_slug', 'created_by', 'is_published')
    readonly_fields = ('created_by',)
    search_fields = ('course_title', 'course_slug')
    inlines = [AuthorDetailsInline]
    prepopulated_fields = {'course_slug': ('course_title',)}

    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.created_by != request.user and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj=obj)

    def has_delete_permission(self, request, obj=None):
        if obj is not None and obj.created_by != request.user and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj=obj)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
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
    readonly_fields = ('created_by',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "course":
            if not request.user.is_superuser:
                kwargs["queryset"] = Course.objects.filter(created_by=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(TopicType)
class TopicTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'topic_slug', 'is_active', 'created_at')
    search_fields = ('type_name', 'topic_slug')
    prepopulated_fields = {'topic_slug': ('type_name',)}
    list_filter = ('is_active',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(is_active=True) 

@admin.register(LessonTopic)
class LessonTopicAdmin(admin.ModelAdmin):
    list_display = (
        'topic_title', 'get_lesson_title', 'get_course_title',
        'type', 'topic_order', 'is_active', 'created_at'
    )
    search_fields = ('topic_title', 'topic_slug', 'topic_content')
    prepopulated_fields = {'topic_slug': ('topic_title',)}
    list_filter = ('is_active', 'lesson', 'type')
    ordering = ('topic_order',)
    readonly_fields = ('created_by', 'get_lesson_title', 'get_course_title')

    def get_lesson_title(self, obj):
        return obj.lesson.lesson_title
    get_lesson_title.short_description = 'Lesson Title'

    def get_course_title(self, obj):
        return obj.lesson.course.course_title
    get_course_title.short_description = 'Course Title'

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "lesson":
            if not request.user.is_superuser:
                kwargs["queryset"] = CourseLesson.objects.filter(created_by=request.user)
        elif db_field.name == "type":
            # Remove the user filter for TopicType to show all active types
            kwargs["queryset"] = TopicType.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)



class CourseRatingForm(forms.ModelForm):
    class Meta:
        model = CourseRating
        fields = ['course', 'rating']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        course = cleaned_data.get('course')
        user = self.request.user if self.request else None

        if not self.instance.pk and course and user:
            if CourseRating.objects.filter(course=course, user=user).exists():
                raise ValidationError("You have already rated this course. Only one rating is allowed per course.")
        return cleaned_data


@admin.register(CourseRating)
class CourseRatingAdmin(admin.ModelAdmin):
    form = CourseRatingForm
    list_display = ('course', 'user', 'rating', 'created_at')
    search_fields = ('course__course_title', 'user__username')
    list_filter = ('rating', 'created_at')
    readonly_fields = ('created_at', 'user')

    def get_form(self, request, obj=None, **kwargs):
        AdminForm = super().get_form(request, obj, **kwargs)
        
        class WrappedForm(AdminForm):
            def __init__(inner_self, *args, **kwargs):
                kwargs['request'] = request
                super().__init__(*args, **kwargs)
        
        return WrappedForm

    def save_model(self, request, obj, form, change):
        if not change:
            obj.user = request.user
        try:
            super().save_model(request, obj, form, change)
        except IntegrityError:
            messages.error(request, "You have already rated this course. Only one rating is allowed per course.")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs if request.user.is_superuser else qs.filter(user=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "course" and not request.user.is_superuser:
            kwargs["queryset"] = Course.objects.filter(is_published=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def has_change_permission(self, request, obj=None):
        return obj.user == request.user or request.user.is_superuser if obj else super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return obj.user == request.user or request.user.is_superuser if obj else super().has_delete_permission(request, obj)