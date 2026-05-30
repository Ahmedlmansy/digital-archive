import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  extractTextFromFile,
  analyzeDocumentWithAi,
  uploadDocument,
  fetchDocuments,
  deleteDocument,
  fetchCategories,
} from "./DocumentService";

// ── Initial State 
const initialState = {
  // ── Documents List 
  documents: [],
  listStatus: "idle", // idle | loading | succeeded | failed
  listError: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,

  //  Filters & Search 
  filters: {
    query: "",
    status: null, // 'active' | 'archived' | 'draft'
    categoryId: null,
    dateFrom: null,
    dateTo: null,
    sortBy: "created_at",
    sortOrder: "desc",
  },

  // ── Categories 
  categories: [],
  categoriesStatus: "idle",

  // ── OCR 
  ocrText: "",
  fileType: null,
  ocrStatus: "idle",
  ocrError: null,

  // ── AI Analysis 
  aiResult: null,
  aiStatus: "idle",
  aiError: null,

  // ── Upload 
  uploadStatus: "idle",
  uploadError: null,
  uploadedDoc: null,

  // ── Delete 
  deleteStatus: "idle",
  deleteError: null,
};

// THUNKS


// get documents with filters, search, pagination
export const loadDocuments = createAsyncThunk(
  "documents/loadDocuments",
  async (_, thunkAPI) => {
    try {
      const { documents: state } = thunkAPI.getState();
      const result = await fetchDocuments({
        query: state.filters.query,
        status: state.filters.status,
        categoryId: state.filters.categoryId,
        dateFrom: state.filters.dateFrom,
        dateTo: state.filters.dateTo,
        page: state.currentPage,
        limit: state.itemsPerPage,
        sortBy: state.filters.sortBy,
        sortOrder: state.filters.sortOrder,
      });
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Change Page
export const changePage = createAsyncThunk(
  "documents/changePage",
  async (page, thunkAPI) => {
    try {
      const { documents: state } = thunkAPI.getState();
      const result = await fetchDocuments({
        query: state.filters.query,
        status: state.filters.status,
        categoryId: state.filters.categoryId,
        dateFrom: state.filters.dateFrom,
        dateTo: state.filters.dateTo,
        page,
        limit: state.itemsPerPage,
        sortBy: state.filters.sortBy,
        sortOrder: state.filters.sortOrder,
      });
      return { ...result, page };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Search Documents
export const searchDocuments = createAsyncThunk(
  "documents/searchDocuments",
  async (query, thunkAPI) => {
    try {
      const { documents: state } = thunkAPI.getState();
      const result = await fetchDocuments({
        query,
        status: state.filters.status,
        categoryId: state.filters.categoryId,
        dateFrom: state.filters.dateFrom,
        dateTo: state.filters.dateTo,
        page: 1, 
        limit: state.itemsPerPage,
        sortBy: state.filters.sortBy,
        sortOrder: state.filters.sortOrder,
      });
      return { ...result, query };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Apply Filter
export const applyFilter = createAsyncThunk(
  "documents/applyFilter",
  async (filterUpdate, thunkAPI) => {
    try {
      const { documents: state } = thunkAPI.getState();
      const newFilters = { ...state.filters, ...filterUpdate };
      const result = await fetchDocuments({
        query: newFilters.query,
        status: newFilters.status,
        categoryId: newFilters.categoryId,
        dateFrom: newFilters.dateFrom,
        dateTo: newFilters.dateTo,
        page: 1,
        limit: state.itemsPerPage,
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder,
      });
      return { ...result, filters: newFilters };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Load Categories
export const loadCategories = createAsyncThunk(
  "documents/loadCategories",
  async (_, thunkAPI) => {
    try {
      return await fetchCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Extract Text (OCR)
export const extractText = createAsyncThunk(
  "documents/extractText",
  async (file, thunkAPI) => {
    try {
      return await extractTextFromFile(file);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

//  Analyze With AI
export const analyzeWithAi = createAsyncThunk(
  "documents/analyzeWithAi",
  async (ocrText, thunkAPI) => {
    try {
      return await analyzeDocumentWithAi(ocrText);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

//  Upload Document
export const uploadDoc = createAsyncThunk(
  "documents/uploadDoc",
  async ({ file, fileType, form, aiSummary, aiTags }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const userId = auth.user?.id;
      if (!userId) throw new Error("المستخدم غير مسجل الدخول");
      return await uploadDocument({
        file,
        fileType,
        form,
        aiSummary,
        aiTags,
        userId,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
 
// Remove Document
export const removeDocument = createAsyncThunk(
  "documents/removeDocument",
  async ({ docId, filePath }, thunkAPI) => {
    try {
      await deleteDocument(docId, filePath);
      return docId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// SLICE

const documentSlice = createSlice({
  name: "documents",
  initialState,

  reducers: {
    // ── Reset 
    resetDocumentState: () => initialState,

    resetUploadStatus: (state) => {
      state.uploadStatus = "idle";
      state.uploadError = null;
      state.uploadedDoc = null;
    },

    resetOcr: (state) => {
      state.ocrStatus = "idle";
      state.ocrError = null;
      state.ocrText = "";
      state.fileType = null;
    },

    resetAi: (state) => {
      state.aiStatus = "idle";
      state.aiError = null;
      state.aiResult = null;
    },

    // ── Filters (local updates before server call) 
    setSearchQuery: (state, action) => {
      state.filters.query = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {
        query: "",
        status: null,
        categoryId: null,
        dateFrom: null,
        dateTo: null,
        sortBy: "created_at",
        sortOrder: "desc",
      };
      state.currentPage = 1;
    },

    // ── Pagination (local) 
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
  },

  extraReducers: (builder) => {
    // ── loadDocuments 
    builder
      .addCase(loadDocuments.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(loadDocuments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.documents = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(loadDocuments.rejected, (state, action) => {
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
        state.documents = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(changePage.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── searchDocuments 
    builder
      .addCase(searchDocuments.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.documents = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = 1;
        state.filters.query = action.payload.query;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
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
        state.documents = action.payload.data;
        state.totalCount = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = 1;
        state.filters = action.payload.filters;
      })
      .addCase(applyFilter.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      });

    // ── loadCategories 
    builder
      .addCase(loadCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state) => {
        state.categoriesStatus = "failed";
      });

    // ── extractText 
    builder
      .addCase(extractText.pending, (state) => {
        state.ocrStatus = "loading";
        state.ocrError = null;
        state.ocrText = "";
        state.fileType = null;
      })
      .addCase(extractText.fulfilled, (state, action) => {
        state.ocrStatus = "succeeded";
        state.ocrText = action.payload.text;
        state.fileType = action.payload.fileType;
      })
      .addCase(extractText.rejected, (state, action) => {
        state.ocrStatus = "failed";
        state.ocrError = action.payload;
      });

    // ── analyzeWithAi 
    builder
      .addCase(analyzeWithAi.pending, (state) => {
        state.aiStatus = "loading";
        state.aiError = null;
        state.aiResult = null;
      })
      .addCase(analyzeWithAi.fulfilled, (state, action) => {
        state.aiStatus = "succeeded";
        state.aiResult = action.payload;
      })
      .addCase(analyzeWithAi.rejected, (state, action) => {
        state.aiStatus = "failed";
        state.aiError = action.payload;
      });

    // ── uploadDoc 
    builder
      .addCase(uploadDoc.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
        state.uploadedDoc = null;
      })
      .addCase(uploadDoc.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.uploadedDoc = action.payload;
      })
      .addCase(uploadDoc.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      });

    // ── removeDocument 
    builder
      .addCase(removeDocument.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(removeDocument.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload,
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(removeDocument.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export const {
  resetDocumentState,
  resetUploadStatus,
  resetOcr,
  resetAi,
  setSearchQuery,
  clearFilters,
  setItemsPerPage,
} = documentSlice.actions;

export default documentSlice.reducer;
