from rest_framework import serializers, viewsets, pagination, filters
from rest_framework.response import Response
from content_management_system.models import (
    CourseCategory, CourseType, Course, CourseLesson, TopicType, LessonTopic, CourseComment
)
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CourseCommentSerializer


# Custom Pagination Class
class CustomPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'total_items': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'items_per_page': self.page.paginator.per_page,
            'next_page_link': self.get_next_link(),
            'previous_page_link': self.get_previous_link(),
            'results': data
        })
    

class CourseCommentViewSet(viewsets.ModelViewSet):
    queryset = CourseComment.objects.filter(parent__isnull=True).select_related('user', 'course')
    serializer_class = CourseCommentSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['course']  # Enables filtering by course ID
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



# Serializers
class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ['id', 'category_name', 'category_slug', 'category_description', 'is_active']

    permission_classes = [AllowAny]

class CourseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseType
        fields = ['id', 'course_name', 'course_slug', 'course_description', 'is_active']
    permission_classes = [AllowAny]

class CourseSerializer(serializers.ModelSerializer):
    course_category = CourseCategorySerializer(read_only=True)
    course_type = CourseTypeSerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'course_category', 'course_type', 'course_title', 'course_slug',
            'course_description', 'is_free_course', 'course_price', 'is_published',
            'created_at', 'updated_at', 'is_active'
        ]
    permission_classes = [AllowAny]

class CourseLessonSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = CourseLesson
        fields = [
            'id', 'course', 'lesson_title', 'lesson_slug', 'lesson_description',
            'lesson_order', 'created_at', 'is_active'
        ]
    permission_classes = [AllowAny]

class TopicTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicType
        fields = ['id', 'type_name', 'topic_slug', 'created_at', 'is_active']
    permission_classes = [AllowAny]

class LessonTopicSerializer(serializers.ModelSerializer):
    lesson = CourseLessonSerializer(read_only=True)
    type = TopicTypeSerializer(read_only=True)

    class Meta:
        model = LessonTopic
        fields = [
            'id', 'lesson', 'type', 'topic_order', 'topic_title', 'topic_slug',
            'topic_content', 'created_at', 'is_active'
        ]
    permission_classes = [AllowAny]

# ViewSets
class CourseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CourseCategory.objects.filter(is_active=True)
    serializer_class = CourseCategorySerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['category_name', 'id']
    ordering = ['category_name']
    permission_classes = [AllowAny]

class CourseTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CourseType.objects.filter(is_active=True)
    serializer_class = CourseTypeSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['course_name', 'id']
    ordering = ['course_name']
    permission_classes = [AllowAny]

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['course_category', 'course_category__category_slug']
    ordering_fields = ['course_title', 'created_at', 'id']
    ordering = ['course_title']
    search_fields = ['course_title', 'course_description']
    permission_classes = [AllowAny]

class CourseLessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CourseLesson.objects.filter(is_active=True)
    serializer_class = CourseLessonSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['lesson_title', 'lesson_order', 'id']
    ordering = ['lesson_order']
    permission_classes = [AllowAny]


class TopicTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TopicType.objects.filter(is_active=True)
    serializer_class = TopicTypeSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['type_name', 'id']
    ordering = ['type_name']
    permission_classes = [AllowAny]


class LessonTopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LessonTopic.objects.filter(is_active=True)
    serializer_class = LessonTopicSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['topic_title', 'topic_order', 'id']
    ordering = ['topic_order']
    permission_classes = [AllowAny]
    

