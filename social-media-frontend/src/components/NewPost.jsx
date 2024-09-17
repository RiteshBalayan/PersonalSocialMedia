import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, TextField, IconButton, Box, Typography } from '@mui/material';
import { PhotoCamera, Send } from '@mui/icons-material';
import axiosInstance from '../axiosConfig';

const NewPost = ({ onPostAdded }) => {
  const navigate = useNavigate();
  
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const authToken = useSelector(state => state.auth.token);

  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!content && !image) {
      setError('Post cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    axiosInstance.post('posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${authToken}`,
      },
    })
    .then(response => {
      setContent('');
      setImage(null);
      setError('');
      if (onPostAdded) {
        onPostAdded(response.data);
      }
    })
    .catch(error => {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
    });
  };

  return (
    <Card style={{ width: '100%', maxWidth: '600px', marginBottom: '8px', boxSizing: 'border-box' }}>
      <CardContent style={{ padding: '0.5rem' }}>
        <form onSubmit={handleSubmit} style={{ margin: '0' }}>
          <TextField
            label="What's on your mind?"
            variant="outlined"
            fullWidth
            value={content}
            onChange={handleContentChange}
            multiline
            minRows={2}  // Reduce the minimum rows to make it thinner
            style={{ marginBottom: '0.5rem' }}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <IconButton color="primary" aria-label="upload picture" component="span" size="small">
                <PhotoCamera />
              </IconButton>
            </label>
            {image && (
              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px', flexGrow: 1 }}>
                {image.name}
              </Typography>
            )}
            <IconButton color="primary" type="submit" size="small">
              <Send />
            </IconButton>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPost;
