# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a course to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE methods like GET are allowed for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the course creator
        return obj.created_by == request.user
