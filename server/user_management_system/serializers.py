import re
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from django.core.validators import validate_email
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


def validate_username(value):
    if not re.match(r'^[A-Za-z0-9_]+$', value):
        raise ValidationError('Username can only contain letters, numbers, and underscores.')
    return value


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[validate_username])
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        validate_email(data['email'])
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # use email as the username field

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError('Invalid email or password.')

            if not user.is_verified:
                raise serializers.ValidationError('Email not verified. Please check your inbox to verify your email.')

        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        # Let SimpleJWT generate token pair
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
    username = serializers.CharField(validators=[validate_username])
    class Meta:
        model = CustomUser
        fields = ('username',)


class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('avatar',)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])


class ChangeEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField()
