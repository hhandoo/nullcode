import os
import time
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from .models import CustomUser
from .serializers import *
from .utils import send_verification_email
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.text import slugify
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import blacklist_user_tokens
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def perform_create(self, serializer):
        user = serializer.save()
        send_verification_email(user, self.request)



class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
            
            if user.is_verified:
                return Response({'message': 'Email already verified.'}, status=status.HTTP_200_OK)
            
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.is_verified = True
                user.save()
                return Response({'message': 'Email verified successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateUsernameView(UpdateProfileView):
    serializer_class = UpdateUsernameSerializer

class UpdateAvatarView(generics.UpdateAPIView):
    serializer_class = UpdateAvatarSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user
    def perform_update(self, serializer):
        user = self.get_object()
        old_avatar_path = user.avatar.path if user.avatar else None
        serializer.save()
        if user.avatar:
            ext = user.avatar.name.split('.')[-1]
            timestamp = int(time.time())
            new_filename = f"{user.pk}_{slugify(user.username)}_{timestamp}.{ext}"
            new_path = os.path.join('avatars', new_filename)
            full_new_path = os.path.join(user.avatar.storage.location, new_path)
            os.rename(user.avatar.path, full_new_path)
            user.avatar.name = new_path
            user.save()
        if old_avatar_path and os.path.exists(old_avatar_path):
            os.remove(old_avatar_path)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': 'Wrong password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        blacklist_user_tokens(user)

        return Response({
            'message': 'Password changed successfully. You have been logged out.'
        }, status=status.HTTP_200_OK)

class ChangeEmailView(generics.GenericAPIView):
    serializer_class = ChangeEmailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.email = serializer.validated_data['new_email']
        user.is_verified = False
        user.is_active = False
        user.save()

        blacklist_user_tokens(user)

        send_verification_email(user, request)
        return Response({'message': 'Verification email sent to new address. You have been logged out.'})

    

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            refresh_token = response.data['refresh']
            access_token = response.data['access']

            # Set refresh token in HttpOnly, Secure cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,  # Use True in production
                samesite='Strict',
                max_age=7 * 24 * 60 * 60  # 7 days
            )

            # Only return access token in response body
            response.data = {'access': access_token}
        return response
class CookieTokenRefreshView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'detail': 'Refresh token missing'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({'access': access_token})
        except Exception:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)




class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            
            refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'User account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)