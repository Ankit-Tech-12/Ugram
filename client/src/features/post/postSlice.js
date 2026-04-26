import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";

// 🔥 FETCH FEED POSTS
export const fetchFeedPosts = createAsyncThunk(
  "post/fetchFeedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts");
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load posts"
      );
    }
  }
);

// ❤️ TOGGLE LIKE (API)
export const toggleLikePost = createAsyncThunk(
  "post/toggleLikePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);

      return {
        postId,
        liked: res.data.data.liked,
        likesCount: res.data.data.likesCount,
      };
    } catch (err) {
      return rejectWithValue({
        postId,
        message: err.response?.data?.message || "Like failed",
      });
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },

  reducers: {
    // ⚡ OPTIMISTIC LIKE
    toggleLikeLocal: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload);

      if (!post) return;

      const newLiked = !post.isLiked;

      post.isLiked = newLiked;
      post.likesCount += newLiked ? 1 : -1;
    },
  },

  extraReducers: (builder) => {
    builder

      // 📥 FETCH POSTS
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❤️ LIKE SUCCESS (SYNC WITH BACKEND)
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, liked, likesCount } = action.payload;

        const post = state.posts.find((p) => p._id === postId);

        if (!post) return;

        post.isLiked = liked;
        post.likesCount = likesCount;
      })

      // ❌ LIKE FAILED → REVERT OPTIMISTIC
      .addCase(toggleLikePost.rejected, (state, action) => {
        const { postId } = action.payload || {};

        const post = state.posts.find((p) => p._id === postId);

        if (!post) return;

        const revertedLiked = !post.isLiked;

        post.isLiked = revertedLiked;
        post.likesCount += revertedLiked ? 1 : -1;
      });
  },
});

export const { toggleLikeLocal } = postSlice.actions;
export default postSlice.reducer;