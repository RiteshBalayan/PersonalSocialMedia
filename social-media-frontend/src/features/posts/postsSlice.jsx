import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts: (state, action) => {
      return action.payload;
    },
    toggleLike: (state, action) => {
      const post = state.find(post => post.id === action.payload);
      if (post) {
        post.hasLiked = !post.hasLiked;
        post.like_count += post.hasLiked ? 1 : -1;
      }
    },
  },
});

export const { setPosts, toggleLike } = postsSlice.actions;
export default postsSlice.reducer;
