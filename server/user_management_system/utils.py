from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.sites.shortcuts import get_current_site


# def send_verification_email(user, request):
#     uid = urlsafe_base64_encode(force_bytes(user.pk))
#     token = default_token_generator.make_token(user)
#     verification_link = request.build_absolute_uri(
#         reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
#     )
#     send_mail(
#         subject='Verify your email',
#         message=f'Click the link to verify your email: {verification_link}',
#         from_email=settings.EMAIL_HOST_USER,
#         recipient_list=[user.email]
#     )

# utils.py

def send_verification_email(user, request, use_pending=False):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    domain = get_current_site(request).domain
    path = reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
    verify_url = f"http://{domain}{path}"

    to_email = user.pending_email if use_pending else user.email

    subject = "Verify your new email address"
    message = f"Hi {user.username},\n\nClick the link below to verify your new email:\n{verify_url}"

    send_mail(subject, message, "no-reply@yalsworld.com", [to_email])



def send_password_reset_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = request.build_absolute_uri(
        reverse('reset-password-confirm', kwargs={'uidb64': uid, 'token': token})
    )
    send_mail(
        subject='Reset your password',
        message=f'Click the link to reset your password: {reset_link}',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email]
    )
    print("Reset Password Link:", reset_link)


def blacklist_user_tokens(user):
    tokens = OutstandingToken.objects.filter(user=user)
    for token in tokens:
        try:
            BlacklistedToken.objects.get_or_create(token=token)
        except Exception as e:
            print('error', e)



def send_email_change_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    domain = get_current_site(request).domain
    path = reverse('confirm-email-change', kwargs={'uidb64': uid, 'token': token})
    verify_url = f"http://{domain}{path}"

    subject = "Confirm your email change"
    message = f"Click the link below to confirm your new email address:\n{verify_url}"
    send_mail(subject, message, "no-reply@yalsworld.com", [user.pending_email])
