from rest_framework import serializers
from content_management_system.models import CourseComment

class CourseCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = CourseComment
        fields = ['id', 'course', 'username', 'avatar', 'content', 'created_at', 'parent', 'replies']
        read_only_fields = ['id', 'username', 'avatar', 'created_at', 'replies']

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and request:
            return request.build_absolute_uri(obj.user.avatar.url)
        return None

    def get_replies(self, obj):
        if obj.replies.exists():
            return CourseCommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []