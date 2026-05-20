import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerNewUser } from "./AddUserService";

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  successMessage: null,
};

// ── Thunk ─────────────────────────────────────────────────────────────────────
export const addUser = createAsyncThunk(
  "addUser/addUser",
  async (userData, thunkAPI) => {
    try {
      return await registerNewUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const addUserSlice = createSlice({
  name: "addUser",
  initialState,

  reducers: {
    resetAddUserState: (state) => {
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },

    clearAddUserError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
        state.successMessage = "تم إنشاء المستخدم بنجاح";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { resetAddUserState, clearAddUserError } = addUserSlice.actions;

export default addUserSlice.reducer;
