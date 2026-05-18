import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  extractTextFromFile,
  analyzeDocumentWithAi,
  uploadDocument,
} from "./DocumentService";

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  // OCR
  ocrText: "",
  fileType: null, // "PDF" | "DOCX"
  ocrStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
  ocrError: null,

  // AI Analysis
  aiResult: null, // { title, author, subject, description, tags, category, ... }
  aiStatus: "idle",
  aiError: null,

  // Upload
  uploadStatus: "idle",
  uploadError: null,
  uploadedDoc: null, // the inserted document record
};

// ── Thunks ────────────────────────────────────────────────────────────────────

// 1. Extract text from PDF or DOCX
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

// 2. Analyze with AI (calls Supabase Edge Function → Groq)
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

// 3. Upload document to Storage + insert in DB
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

// ── Slice ─────────────────────────────────────────────────────────────────────
const documentSlice = createSlice({
  name: "documents",
  initialState,

  reducers: {
    // Reset everything when user picks a new file
    resetDocumentState: () => initialState,

    // Reset only upload status (so user can retry)
    resetUploadStatus: (state) => {
      state.uploadStatus = "idle";
      state.uploadError = null;
      state.uploadedDoc = null;
    },
  },

  extraReducers: (builder) => {
    // ── extractText ───────────────────────────────────────────────────────────
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

    // ── analyzeWithAi ─────────────────────────────────────────────────────────
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

    // ── uploadDoc ─────────────────────────────────────────────────────────────
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
  },
});

export const { resetDocumentState, resetUploadStatus } = documentSlice.actions;
export default documentSlice.reducer;
