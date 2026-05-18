import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { documentViewerApi } from "./documentViewerApi";

export const fetchDocument = createAsyncThunk(
  "documentViewer/fetchDocument",
  async (id, { rejectWithValue }) => {
    try {
      return await documentViewerApi.getDocumentById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSignedUrl = createAsyncThunk(
  "documentViewer/fetchSignedUrl",
  async (filePath, { rejectWithValue }) => {
    try {
      return await documentViewerApi.getSignedUrl(filePath);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const incrementViewCount = createAsyncThunk(
  "documentViewer/incrementViewCount",
  async ({ id, currentCount }) => {
    await documentViewerApi.incrementViewCount(id, currentCount);
    return currentCount + 1;
  },
);

const initialState = {
  document: null,
  signedUrl: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const documentViewerSlice = createSlice({
  name: "documentViewer",
  initialState,
  reducers: {
    resetViewer: (state) => {
      state.document = null;
      state.signedUrl = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.document = action.payload;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSignedUrl.fulfilled, (state, action) => {
        state.signedUrl = action.payload;
      })
      .addCase(incrementViewCount.fulfilled, (state, action) => {
        if (state.document) state.document.view_count = action.payload;
      });
  },
});

export const { resetViewer } = documentViewerSlice.actions;
export default documentViewerSlice.reducer;
