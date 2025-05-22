from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_link = request.build_absolute_uri(
        reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
    )
    send_mail(
        subject='Verify your email',
        message=f'Click the link to verify your email: {verification_link}',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email]
    )


def blacklist_user_tokens(user):
    tokens = OutstandingToken.objects.filter(user=user)
    for token in tokens:
        try:
            BlacklistedToken.objects.get_or_create(token=token)
        except Exception as e:
            print('error', e)