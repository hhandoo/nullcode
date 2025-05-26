import re
import random
import time
import string
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from django.core.validators import validate_email
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import check_password



User = get_user_model()

def validate_username(value):
    # Only letters, numbers, underscores allowed
    if not re.match(r'^[A-Za-z0-9_]+$', value):
        raise ValidationError('Username can only contain letters, numbers, and underscores.')
    # Length must be between 8 and 32 (inclusive)
    if len(value) < 8 or len(value) > 32:
        raise ValidationError('Username must be at least 8 and at most 32 characters long.')
    return value





def generate_unique_username():
    timestamp_str = str(int(time.time()))
    random_str_len = 13
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=random_str_len))
    username = f"{random_str}-{timestamp_str}"
    while CustomUser.objects.filter(username=username).exists():
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=random_str_len))
        username = f"{random_str}-{timestamp_str}"
    return username

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")

        validate_email(data['email'])

        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['username'] = generate_unique_username()
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        return user






class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "detail": "Invalid email or password."
            })

        if not check_password(password, user.password):
            raise serializers.ValidationError({
                "detail": "Invalid email or password."
            })

        if not user.is_verified:
            raise serializers.ValidationError({
                "detail": "Email not verified. Please check your inbox to verify your email."
            })

        data = super().validate({self.username_field: email, 'password': password})
        return data
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username','first_name', 'last_name', 'email', 'avatar')


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name')


class UpdateUsernameSerializer(serializers.ModelSerializer):
    username = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('username',)

    def validate_username(self, value):
        # Use your standalone validate_username function
        validate_username(value)  # will raise ValidationError if invalid

        # Check uniqueness as well
        user = self.context['request'].user
        if CustomUser.objects.filter(username=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Username already taken.")

        return value


class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('avatar',)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_new_password = attrs.get('confirm_new_password')

        if new_password != confirm_new_password:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match"})

        try:
            # Validate password with Django's validators (checks min length, complexity, etc)
            validate_password(new_password, user=self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return attrs


class ChangeEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField()



class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()



class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        validate_password(data['new_password'])
        return data


class RequestEmailChangeSerializer(serializers.Serializer):
    new_email = serializers.EmailField()

    def validate_new_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value