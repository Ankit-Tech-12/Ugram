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

// FETCH USER POST
export const fetchProfilePosts = createAsyncThunk(
  "post/fetchProfilePosts",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/profile?userId=${userId}`);
      return res.data.data;
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

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/deletePost`);
      return postId;
    } catch (err) {
      return rejectWithValue({
        postId,
        message: err.response?.data?.message || "Post deletion failed",
      });
    }
  });


const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    profilePosts: [],
    loading: false,
    deleting: false,
    error: null,
  },

  reducers: {
    // ⚡ OPTIMISTIC LIKE
    toggleLikeLocal: (state, action) => {
      const post =
        state.posts.find((p) => p._id === action.payload) ||
        state.profilePosts.find((p) => p._id === action.payload);

      if (!post) return;

      const newLiked = !post.isLiked;

      post.isLiked = newLiked;
      post.likesCount += newLiked ? 1 : -1;
    },
    toggleFollowLocal: (state, action) => {
      const userId = action.payload;

      state.posts.forEach((post) => {
        if (post.owner?._id === userId) {
          post.owner.isFollowing = !post.owner.isFollowing;
        }
      });

      state.profilePosts.forEach((post) => {
        if (post.owner?._id === userId) {
          post.owner.isFollowing = !post.owner.isFollowing;
        }
      })
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

      //USER PROFILE POST
      .addCase(fetchProfilePosts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.loading = false
        state.profilePosts = action.payload;
      })

      .addCase(fetchProfilePosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload;
      })

      // ❤️ LIKE SUCCESS (SYNC WITH BACKEND)
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, liked, likesCount } = action.payload;

        const post =
          state.posts.find((p) => p._id === postId) ||
          state.profilePosts.find((p) => p._id === postId);

        if (!post) return;

        post.isLiked = liked;
        post.likesCount = likesCount;
      })

      // ❌ LIKE FAILED → REVERT OPTIMISTIC
      .addCase(toggleLikePost.rejected, (state, action) => {
        const { postId } = action.payload || {};

        const post = 
        state.posts.find((p) => p._id === postId) ||
        state.profilePosts.find((p) => p._id === postId);

        if (!post) return;

        const revertedLiked = !post.isLiked;

        post.isLiked = revertedLiked;
        post.likesCount += revertedLiked ? 1 : -1;
      })

      // Deleting post
      .addCase(deletePost.pending, (state) => {
        state.deleting = true;
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleting = false;

        state.posts = state.posts.filter(
          (post) => post._id !== action.payload
        );

        state.profilePosts = state.profilePosts.filter(
          (post) => post._id !== action.payload
        );
      })

      .addCase(deletePost.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload?.message || "Failed to delete post";
      });
  },
});

export const {
  toggleLikeLocal,
  toggleFollowLocal
} = postSlice.actions;
export default postSlice.reducer;