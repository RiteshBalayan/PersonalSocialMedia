import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`/api/profiles/${id}/`)
      .then(response => {
        setProfile(response.data.profile);
        setPosts(response.data.posts);
      })
      .catch(error => console.error('Error fetching profile:', error));
  }, [id]);

  return (
    <div className="container mt-5">
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.content}</p>
          {post.image && <img src={post.image} alt="Post" className="img-fluid" />}
        </div>
      ))}
      {id === 'me' && <button className="btn btn-primary">Edit Profile</button>}
    </div>
  );
};

export default Profile;
