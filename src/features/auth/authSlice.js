import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentSession,
  getProfile,
} from "./authService";

const initialState = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      return await registerUser(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      return await loginUser(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutUser();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const session = await getCurrentSession();
      if (!session) return null;

      // جربي تجيبي الـ profile، لو فشل مش مشكلة
      let profile = null;
      try {
        profile = await getProfile(session.user.id);
      } catch {
        console.warn("Could not fetch profile");
      }

      return {
        session,
        user: session.user,
        profile,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.session = action.payload.session;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.user = action.payload.user;

          state.session = action.payload.session;

          state.profile = action.payload.profile;
        }
      })

      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
      });
  },
});

export default authSlice.reducer;
