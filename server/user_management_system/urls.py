# # accounts/urls.py
# from django.urls import path
# from .views import RegisterView, UserDetailView, VerifyEmailView

# urlpatterns = [
#     path('register/', RegisterView.as_view(), name='register'),
#     path('user/', UserDetailView.as_view(), name='user_detail'),
#     path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
# ]




# from django.urls import path
# from .views import (
#     RegisterView, VerifyEmailView, CustomTokenObtainPairView, UserDetailView,
#     UpdateProfileView, ChangePasswordView, ChangeEmailView, VerifyNewEmailView, ChangeUsernameView
# )

# urlpatterns = [
#     path('register/', RegisterView.as_view()),
#     path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view()),
#     path('token/', CustomTokenObtainPairView.as_view()),
#     path('me/', UserDetailView.as_view()),
#     path('update-profile/', UpdateProfileView.as_view()),
#     path('change-password/', ChangePasswordView.as_view()),
#     path('change-email/', ChangeEmailView.as_view()),
#     path('verify-new-email/<uidb64>/<token>/<new_email>/', VerifyNewEmailView.as_view()),
#     path('change-username/', ChangeUsernameView.as_view()),
# ]



# user_management_system/urls.py
# from django.urls import path
# from .views import (
#     RegisterView, VerifyEmailView, UserDetailView,
#     UpdateNameView, UpdatePasswordView, UpdateEmailView,
#     UpdateUsernameView, AvatarUploadView,
# )
# from rest_framework_simplejwt.views import TokenRefreshView
# from .views import CustomTokenObtainPairView

# urlpatterns = [
#     path('register/', RegisterView.as_view(), name='register'),
#     path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
#     path('user/', UserDetailView.as_view(), name='user-detail'),
#     path('user/name/', UpdateNameView.as_view(), name='update-name'),
#     path('user/password/', UpdatePasswordView.as_view(), name='update-password'),
#     path('user/email/', UpdateEmailView.as_view(), name='update-email'),
#     path('user/username/', UpdateUsernameView.as_view(), name='update-username'),
#     path('user/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
# ]



# user_management_system/urls.py

from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('update-username/', UpdateUsernameView.as_view(), name='update-username'),
    path('update-avatar/', UpdateAvatarView.as_view(), name='update-avatar'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('change-email/', ChangeEmailView.as_view(), name='change-email'),
]
