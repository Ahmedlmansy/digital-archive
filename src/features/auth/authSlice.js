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
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ═══════════════════════════════════════════════════════════════
// THUNKS
// ═══════════════════════════════════════════════════════════════

export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const data = await registerUser(formData);

      let profile = null;
      if (data?.user?.id) {
        try {
          profile = await getProfile(data.user.id);
        } catch (err) {
          console.warn("Profile fetch after register:", err.message);
        }
      }

      return { ...data, profile };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const data = await loginUser(formData);

      let profile = null;
      if (data?.user?.id) {
        try {
          profile = await getProfile(data.user.id);
        } catch (err) {
          console.warn("Profile fetch after login:", err.message);
        }
      }

      return { ...data, profile };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutUser();
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// ← الحل الرئيسي: checkAuth يخلص حتى لو getProfile فشل
// في checkAuth thunk — تأكد إن الفنكشن دي موجودة
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const session = await getCurrentSession();
      
      if (!session) {
        return { user: null, session: null, profile: null };
      }

      let profile = null;
      try {
        profile = await getProfile(session.user.id);
      } catch (err) {
        console.warn("Profile fetch failed in checkAuth:", err.message);
      }

      return {
        session,
        user: session.user,
        profile,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// ═══════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload?.user ?? null;
      state.session = action.payload?.session ?? null;
      state.profile = action.payload?.profile ?? null;
      state.isAuthenticated = !!action.payload?.user;
    },

    updateProfileLocal: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    resetAuth: () => initialState,
  },

  extraReducers: (builder) => {
    // ── REGISTER ────────────────────────────────────────────────
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.session = action.payload.session;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ── LOGIN ───────────────────────────────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ← الحل: checkAuth لازم يخلص في كل الحالات
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false; // ← خلاص مش loading
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false; // ← خلاص مش loading
        state.error = action.payload;
        state.user = null;
        state.session = null;
        state.profile = null;
        state.isAuthenticated = false;
      });

    // ── LOGOUT ──────────────────────────────────────────────────
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        state.session = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, updateProfileLocal, clearError, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
