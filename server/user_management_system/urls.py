from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('update-username/', UpdateUsernameView.as_view(), name='update-username'),
    path('update-avatar/', UpdateAvatarView.as_view(), name='update-avatar'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('change-email/', ChangeEmailView.as_view(), name='change-email'),
    path('delete-account/', DeleteUserView.as_view(), name='delete-account'),

    path('resend-verification-email/', ResendVerificationEmailView.as_view()),
    path('request-password-reset/', RequestPasswordResetView.as_view()),
    path('reset-password/<uidb64>/<token>/', ResetPasswordConfirmView.as_view(), name='reset-password-confirm'),
]
