import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Button, TextField } from '@mui/material';
import { Favorite, Comment as CommentIcon } from '@mui/icons-material';
import axiosInstance from '../axiosConfig';

const Post = ({ post }) => {
  const navigate = useNavigate();
  
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const authToken = useSelector(state => state.auth.token);
  const [likes, setLikes] = useState(post.like_count);
  const [comments, setComments] = useState(post.comments || []);  // Initialize with post comments
  const [newComment, setNewComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false); // Track if the user has liked this post

  const handleLike = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      axiosInstance.post(`posts/${post.id}/like/`)
        .then(response => {
          if (hasLiked) {
            setLikes(likes - 1);
          } else {
            setLikes(likes + 1);
          }
          setHasLiked(!hasLiked);
        })
        .catch(error => {
          console.error('Error toggling like:', error);
        });
    }
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      axiosInstance.post(
        `posts/${post.id}/comment/`,
        { content: newComment },
        { headers: { Authorization: `Token ${authToken}` } } // Include the Authorization header with the token from Redux
      )
      .then(response => {
        setComments([...comments, response.data]);  // Update the comments array with the new comment
        setNewComment('');  // Clear the input field
      })
      .catch(error => {
        console.error('Error posting comment:', error.response.data); // Log detailed error from backend
      });
    }
  };

  return (
    <Card className="mb-3">
      <CardHeader
        avatar={
          post.user.profile_pic ? (
            <Avatar src={post.user.profile_pic} />
          ) : (
            <Avatar>{post.user.name[0]}</Avatar>
          )
        }
        title={post.user.user}
        subheader={new Date(post.created_at).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1" color="textPrimary" component="p">
          {post.content}
        </Typography>
        {post.image && (
          <img src={post.image} alt="Post" className="img-fluid" style={{ marginTop: '15px', maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like post" onClick={handleLike}>
          <Favorite color={hasLiked ? "error" : "default"} />
          <Typography variant="body2" color="textSecondary" component="span" style={{ marginLeft: '5px' }}>
            {likes}
          </Typography>
        </IconButton>
        <IconButton aria-label="comment on post">
          <CommentIcon color="primary" />
          <Typography variant="body2" color="textSecondary" component="span" style={{ marginLeft: '5px' }}>
            {comments.length}
          </Typography>
        </IconButton>
      </CardActions>
      <CardContent>
        {comments.map((comment, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <Typography variant="body2" color="textPrimary" component="p">
              <strong>{comment.user.user}</strong>: {comment.content}
            </Typography>
          </div>
        ))}
        {isLoggedIn && (
          <div>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ marginTop: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
              onClick={handleCommentSubmit}
            >
              Post Comment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Post;
