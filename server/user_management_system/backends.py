# user_management_system/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    """
    Authenticate using email instead of username.
    """

    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        # Support either email or username param for compatibility
        email = email or username
        if email is None or password is None:
            return None
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
            print("User cannot authenticate")
        return None
