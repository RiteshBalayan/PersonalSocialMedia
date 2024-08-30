import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../components/Post';

const PostPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts/')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="container mt-5">
      <h1>All Posts</h1>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostPage;
