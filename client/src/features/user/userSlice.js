import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "./userApi";

// ─────────────────────────────────────────────
// 👥 TOGGLE FOLLOW / UNFOLLOW
// ─────────────────────────────────────────────
export const toggleFollowing = createAsyncThunk(
  "users/toggleFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      return await userApi.toggleFollowing(userId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

// ─────────────────────────────────────────────
// 🧠 INITIAL STATE
// ─────────────────────────────────────────────
const initialState = {
  isFollowing: false,
  followersCount: 0,
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────
// 🧠 SLICE
// ─────────────────────────────────────────────
const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(toggleFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowing = action.payload.isFollowing;
        state.followersCount = action.payload.followersCount;
      })

      .addCase(toggleFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;