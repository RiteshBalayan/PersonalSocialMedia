import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import Post from '../components/Post';
import NewPost from '../components/NewPost';
import Sidebar from '../components/Sidebar';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('posts/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setPosts([]);
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePostAdded = (newPost) => {
    setPosts([newPost, ...posts]);  // Prepend the new post to the list
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5">{error}</div>;
  }



  return (
    <div style={{ display: 'flex' }}>
      <Sidebar/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
        <NewPost onPostAdded={handlePostAdded} />
        <div style={{ height: '4px' }} />  {/* Spacer with minimal height */}
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map(post => (
            <Post key={post.id} post={post} style={{ marginBottom: '4px' }} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
