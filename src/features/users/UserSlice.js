import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  bulkDeleteUsers,
} from "./UserService";

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  users: [],
  listStatus: "idle", // idle | loading | succeeded | failed
  listError: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,

  filters: {
    query: "",
    role: null,
    status: null,
  },

  selectedIds: [],

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,
};

// THUNKS


// 1. Load users
export const loadUsers = createAsyncThunk(
  "users/loadUsers",
  async (_, thunkAPI) => {
    try {
      const { users: state } = thunkAPI.getState();
      return await fetchUsers({
        query: state.filters.query,
        role: state.filters.role,
        status: state.filters.status,
        page: state.currentPage,
        limit: state.itemsPerPage,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 2. Change page
export const changePage = createAsyncThunk(
  "users/changePage",
  async (page, thunkAPI) => {
    try {
      const { users: state } = thunkAPI.getState();
      const result = await fetchUsers({
        query: state.filters.query,
        role: state.filters.role,
        status: state.filters.status,
        page,
        limit: state.itemsPerPage,
      });
      return { ...result, page };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 3. Search users
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, thunkAPI) => {
    try {
      const { users: state } = thunkAPI.getState();
      const result = await fetchUsers({
        query,
        role: state.filters.role,
        status: state.filters.status,
        page: 1,
        limit: state.itemsPerPage,
      });
      return { ...result, query };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 4. Apply filter
export const applyFilter = createAsyncThunk(
  "users/applyFilter",
  async (filterUpdate, thunkAPI) => {
    try {
      const { users: state } = thunkAPI.getState();
      const newFilters = { ...state.filters, ...filterUpdate };
      const result = await fetchUsers({
        query: newFilters.query,
        role: newFilters.role,
        status: newFilters.status,
        page: 1,
        limit: state.itemsPerPage,
      });
      return { ...result, filters: newFilters };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 5. Update role
export const setUserRole = createAsyncThunk(
  "users/setUserRole",
  async ({ userId, role }, thunkAPI) => {
    try {
      return await updateUserRole(userId, role);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 6. Update status
export const setUserStatus = createAsyncThunk(
  "users/setUserStatus",
  async ({ userId, status }, thunkAPI) => {
    try {
      return await updateUserStatus(userId, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 7. Remove single user
export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (userId, thunkAPI) => {
    try {
      await deleteUser(userId);
      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 8. Remove bulk users
export const removeBulkUsers = createAsyncThunk(
  "users/removeBulkUsers",
  async (userIds, thunkAPI) => {
    try {
      await bulkDeleteUsers(userIds);
      return userIds;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);


// SLICE
const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    resetUserState: () => initialState,

    setSearchQuery: (state, action) => {
      state.filters.query = action.payload;
    },

    clearFilters: (state) => {
      state.filters = { query: "", role: null, status: null };
      state.currentPage = 1;
    },

    toggleSelection: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },

    toggleAllSelection: (state, action) => {
      const ids = action.payload;
      if (state.selectedIds.length === ids.length && ids.length > 0) {
        state.selectedIds = [];
      } else {
        state.selectedIds = ids;
      }
    },

    clearSelection: (state) => {
      state.selectedIds = [];
    },
  },

  extraReducers: (builder) => {
    //  loadUsers 
    builder
      .addCase(loadUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── changePage 
    builder
      .addCase(changePage.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(changePage.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(changePage.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── searchUsers 
    builder
      .addCase(searchUsers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = 1;
        state.filters.query = action.payload.query;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── applyFilter 
    builder
      .addCase(applyFilter.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(applyFilter.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = 1;
        state.filters = action.payload.filters;
      })
      .addCase(applyFilter.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── setUserRole 
    builder.addCase(setUserRole.fulfilled, (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload };
      }
    });

    // ── setUserStatus 
    builder.addCase(setUserStatus.fulfilled, (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload };
      }
    });

    // ── removeUser 
    builder
      .addCase(removeUser.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.selectedIds = state.selectedIds.filter(
          (id) => id !== action.payload,
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });

    // ── removeBulkUsers 
    builder
      .addCase(removeBulkUsers.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(removeBulkUsers.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const deletedIds = action.payload;
        state.users = state.users.filter((u) => !deletedIds.includes(u.id));
        state.selectedIds = [];
        state.totalCount = Math.max(0, state.totalCount - deletedIds.length);
      })
      .addCase(removeBulkUsers.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export const {
  resetUserState,
  setSearchQuery,
  clearFilters,
  toggleSelection,
  toggleAllSelection,
  clearSelection,
} = userSlice.actions;

export default userSlice.reducer;
