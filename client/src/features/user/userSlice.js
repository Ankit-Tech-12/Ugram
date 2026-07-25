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

// Getting profile of target user

export const getTargetUser = createAsyncThunk(
  "users/getUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      return await userApi.getTargetUser(userId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// ─────────────────────────────────────────────
// 🧠 INITIAL STATE
// ─────────────────────────────────────────────
const initialState = {
  profile: null,
  // isFollowing: false,
  // followersCount: 0,
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

        if (state.profile) {
          state.profile.isFollowing = action.payload.isFollowing;
          state.profile.followersCount = action.payload.followersCount;
        }
      })

      .addCase(toggleFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    .addCase(getTargetUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getTargetUser.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    })
    .addCase(getTargetUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
},
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;