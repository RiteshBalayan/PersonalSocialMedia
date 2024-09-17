import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Collapse, Box, Paper, Menu, MenuItem } from '@mui/material';
import { MoreVert, Favorite, Comment as CommentIcon, ExpandMore, Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../axiosConfig';

const ExpandMoreIconButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Post = ({ post }) => {
  const navigate = useNavigate();
  
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const authToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user ? state.auth.user.id : null);

  const [likes, setLikes] = useState(post.like_count);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const isUserPost = isLoggedIn ;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    navigate(`/edit-post/${post.id}`);
  };

  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Add any success or post removal logic here, such as reloading posts.
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && post.liked_users.includes(userId)) {
      setHasLiked(true);
    }
  }, [isLoggedIn, post.liked_users, userId]);

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
        { headers: { Authorization: `Token ${authToken}` } }
      )
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment('');
      })
      .catch(error => {
        console.error('Error posting comment:', error.response.data);
      });
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box', padding: '0rem', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: '600px', marginBottom: '4px', boxSizing: 'border-box' }}>
        <CardHeader
          avatar={
            post.user.profile_pic ? (
              <Avatar src={post.user.profile_pic} style={{ width: '60px', height: '60px' }} />
            ) : (
              <Avatar style={{ width: '60px', height: '60px' }}>{post.user.user[0]}</Avatar>
            )
          }
          title={<Typography variant="h6" fontWeight="bold">{post.user.user}</Typography>}
          subheader={<Typography variant="body2" color="textSecondary">{new Date(post.created_at).toLocaleString()}</Typography>}
          style={{ padding: '1rem' }}
          action={
            isUserPost && (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEditPost}>Edit</MenuItem>
                  <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                </Menu>
              </>
            )
          }
        />
        <CardContent style={{ padding: '1rem' }}>
        <Typography 
          variant="body1" 
          color="textPrimary" 
          component="p" 
          style={{ whiteSpace: 'pre-wrap' }}  // Preserve spaces and line breaks
           >
            {post.content}
          </Typography>
          {post.image && (
            <img src={post.image} alt="Post" style={{ marginTop: '15px', maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
          )}
        </CardContent>
        <CardActions disableSpacing style={{ padding: '1rem', boxSizing: 'border-box' }}>
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
          <ExpandMoreIconButton
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </ExpandMoreIconButton>
          <Typography variant="body2" color="textSecondary" component="span" style={{ marginLeft: '5px' }}>
            {expanded ? "Collapse" : "Expand"}
          </Typography>
        </CardActions>
        <CardContent style={{ padding: '1rem', boxSizing: 'border-box' }}>
          {comments.length > 0 && (
            <Paper elevation={1} style={{ padding: '6px', marginBottom: '4px', borderRadius: '12px', backgroundColor: '#fcfcfc', boxShadow: 'none', width: '100%', boxSizing: 'border-box', wordWrap: 'break-word' }}>
              <Box display="flex" alignItems="flex-start">
                <Avatar src={comments[0].user.profile_pic} sx={{ width: 30, height: 30 }}>{comments[0].user.user[0]}</Avatar>
                <Box marginLeft="10px">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {comments[0].user.user}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {comments[0].content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comments[0].created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {comments.slice(1).map((comment, index) => (
              <Paper elevation={1} key={index} style={{ padding: '6px', marginBottom: '4px', borderRadius: '12px', backgroundColor: '#fcfcfc', boxShadow: 'none', width: '100%', boxSizing: 'border-box', wordWrap: 'break-word' }}>
                <Box display="flex" alignItems="flex-start">
                  <Avatar src={comment.user.profile_pic} sx={{ width: 30, height: 30 }}>{comment.user.user[0]}</Avatar>
                  <Box marginLeft="10px">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {comment.user.user}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Collapse>
          {isLoggedIn && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}  // Handle Enter key press
                multiline  // Allow multiple lines
                minRows={2}  // Set minimum rows to make the box taller
              />
              <IconButton
                color="primary"
                style={{ marginLeft: '10px' }}
                onClick={handleCommentSubmit}
              >
                <Send />
              </IconButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Post;
