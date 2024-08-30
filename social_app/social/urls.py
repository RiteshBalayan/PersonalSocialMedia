from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, UserProfileViewSet
from .views import CustomAuthToken

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'profiles', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', CustomAuthToken.as_view(), name='api_login'),
]
