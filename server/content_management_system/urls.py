from django.urls import path, include
from rest_framework.routers import DefaultRouter
from content_management_system.views import (
    CourseCategoryViewSet,
    CourseTypeViewSet,
    CourseViewSet,
    CourseLessonViewSet,
    TopicTypeViewSet,
    LessonTopicViewSet,
    CourseCommentViewSet
)

# Create a router and register the ViewSets
router = DefaultRouter()
router.register(r'course-categories', CourseCategoryViewSet, basename='course-category')
router.register(r'course-types', CourseTypeViewSet, basename='course-type')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'course-lessons', CourseLessonViewSet, basename='course-lesson')
router.register(r'topic-types', TopicTypeViewSet, basename='topic-type')
router.register(r'lesson-topics', LessonTopicViewSet, basename='lesson-topic')
router.register(r'comments', CourseCommentViewSet, basename='course-comment')

# Define the URL patterns
urlpatterns = [
    path('', include(router.urls)),
]