import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";
import { toggleFollowing } from "../user/userSlice";

// ─────────────────────────────────────────────
// 🔐 LOGIN
// ─────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", credentials);
      return res.data.data; // { user, accessToken }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// ─────────────────────────────────────────────
// 👤 FETCH CURRENT USER
// ─────────────────────────────────────────────
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// ─────────────────────────────────────────────
// 🚪 LOGOUT
// ─────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/users/logout");
      return true;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

// ─────────────────────────────────────────────
// 🧠 SLICE
// ─────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
    state.user = action.payload;
  },
  },

  extraReducers: (builder) => {
    builder

      // ─── LOGIN ─────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      // ─── FETCH USER ────────────────────────
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // Follow/following
      .addCase(toggleFollowing.fulfilled, (state, action) => {
        if (state.user) {
          state.user.followingCount = action.payload.followingCount;
        }
      })

      // ─── LOGOUT ────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;