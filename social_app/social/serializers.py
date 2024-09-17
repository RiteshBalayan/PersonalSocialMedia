from rest_framework import serializers
from .models import UserProfile, Post, Like, Comment

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Include the username
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'profile_pic', 'bio', 'location', 'interests', 'website', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Include the user details in the response
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), write_only=True, required=False)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'content', 'user', 'created_at']  # Include user and created_at

    def create(self, validated_data):
        user_profile = self.context['request'].user.userprofile  # Get the authenticated user's profile
        comment = Comment.objects.create(user=user_profile, **validated_data)  # Create the comment with the associated user
        post = self.context['view'].get_object()  # Get the post from the view context
        return comment


class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    comments = CommentSerializer(many=True, read_only=True)
    liked_users = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'created_at', 'updated_at', 'like_count', 'comment_count', 'comments', 'liked_users']

    def get_liked_users(self, obj):
        return obj.likes.values_list('user_id', flat=True)  # Return only the IDs of users who liked the post

    def create(self, validated_data):
        # Remove user from validated_data to avoid passing it twice
        validated_data.pop('user', None)

        request = self.context.get('request')
        user_profile = request.user.userprofile
        post = Post.objects.create(user=user_profile, **validated_data)
        return post

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['post']  # Only show the post field

    def create(self, validated_data):
        user_profile = self.context['request'].user.userprofile
        post = validated_data['post']

        # Toggle like functionality
        existing_like = Like.objects.filter(user=user_profile, post=post)
        if existing_like.exists():
            # If the like exists, delete it and return the post or a specific response
            existing_like.delete()
            return validated_data  # Return validated_data or any meaningful response
        else:
            # If the like does not exist, create it
            return Like.objects.create(user=user_profile, post=post)


