from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from user_management_system.models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)

    # Customize which fields to show
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Admins can see all users; others can only see themselves
        if request.user.is_staff:
            return qs
        return qs.filter(id=request.user.id)

    def has_change_permission(self, request, obj=None):
        if request.user.is_staff:
            return True
        if obj is None:
            return True  # Allow listing own object
        return obj.id == request.user.id

    def has_delete_permission(self, request, obj=None):
        # Only staff can delete
        return request.user.is_staff

    def has_add_permission(self, request):
        # Only staff can add users
        return request.user.is_staff
