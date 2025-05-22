from rest_framework import serializers
from content_management_system.models import CourseComment

class CourseCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = CourseComment
        fields = ['id', 'course', 'username', 'content', 'created_at', 'parent', 'replies']
        read_only_fields = ['id', 'username', 'created_at', 'replies']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CourseCommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []
