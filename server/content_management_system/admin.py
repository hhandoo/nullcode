# admin.py
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet
from django.utils.translation import gettext_lazy as _
from django.db import models # You already have this

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


class ContactDetailsInline(admin.StackedInline):
    model = ContactDetails
    extra = 1
    verbose_name = "Contact Detail"
    verbose_name_plural = "Contact Details"
    fields = ('contact_type', 'contact_value', 'is_active', 'created_by')
    readonly_fields = ('created_by',)

    def get_formset(self, request, obj=None, **kwargs):
        self.request = request
        return super().get_formset(request, obj, **kwargs)

    def save_new(self, form, commit=True):
        obj = form.save(commit=False)
        if not obj.pk:
            obj.created_by = self.request.user
        if commit:
            obj.save()
        return obj

    def save_existing(self, form, obj, commit=True):
        if not obj.created_by:
            obj.created_by = self.request.user
        if commit:
            form.save()
        return obj




@admin.register(AuthorDetails)
class AuthorDetailsAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'designation', 'is_active', 'consent_given')
    search_fields = ('user__username', 'course__course_title', 'designation')
    list_filter = ('is_active', 'course')
    autocomplete_fields = ['user', 'course']
    inlines = [ContactDetailsInline]

    def get_fields(self, request, obj=None):
        if obj and obj.user == request.user:
            # Co-author logged in: only allow viewing fields + editing consent
            return ['user', 'course', 'designation', 'consent_given']
        elif obj:
            # Course creator or superuser editing: no consent editing
            return ['user', 'course', 'designation', 'is_active']
        else:
            # Creating new author detail
            return ['user', 'course', 'designation']

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.user == request.user:
            # Co-author: all readonly except consent
            return ['user', 'course', 'designation', 'created_at', 'consent_date']
        elif obj:
            # Creator: make most fields readonly
            return ['created_at', 'consent_date', 'consent_given']
        else:
            # On creation: only system fields readonly
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
            return  # Skip validation for unsaved Course

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
        if db_field.name == 'user' and request._obj_ is not None:
            # Exclude the course creator from the user queryset
            creator = request._obj_.created_by
            kwargs["queryset"] = CustomUser.objects.exclude(pk=creator.pk)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Exclude co-authors with same user as course creator
        return qs.exclude(user=models.F('course__created_by'))

    def get_formset(self, request, obj=None, **kwargs):
        # Save the obj in the request for use in formfield_for_foreignkey
        request._obj_ = obj
        return super().get_formset(request, obj, **kwargs)






@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_title', 'course_slug', 'created_by', 'is_published') # Added course_slug for visibility
    # Add 'created_by' to readonly_fields to prevent manual editing
    readonly_fields = ('created_by',)
    search_fields = ('course_title', 'course_slug') # Added course_slug to search
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
    readonly_fields = ('created_by',)  # <-- Make it non-editable

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)



@admin.register(TopicType)
class TopicTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'topic_slug', 'is_active', 'created_at')
    search_fields = ('type_name', 'topic_slug')
    prepopulated_fields = {'topic_slug': ('type_name',)}
    list_filter = ('is_active',)


    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(created_by=request.user)


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
    readonly_fields = ('created_by', 'get_lesson_title', 'get_course_title')  # Include lesson & course info

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