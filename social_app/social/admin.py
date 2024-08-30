from django.contrib import admin
from .models import UserProfile, Post, Like, Comment

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'created_at')
    search_fields = ('user__username', 'location', 'interests')
    list_filter = ('created_at',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'created_at', 'like_count', 'comment_count')
    search_fields = ('user__user__username', 'content')
    list_filter = ('created_at',)
    readonly_fields = ('like_count', 'comment_count')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('user__user__username', 'post__content')
    list_filter = ('created_at',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content', 'created_at')
    search_fields = ('user__user__username', 'post__content', 'content')
    list_filter = ('created_at',)

