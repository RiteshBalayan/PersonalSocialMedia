import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
import Post from '../components/Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('posts/')
      .then(response => {
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setPosts([]);  // Set posts to an empty array if the response is not an array
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Feed</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map(post => (
          <Post key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default Feed;
