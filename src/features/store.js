import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import documentReducer from "@/features/documents/DocumentSlices";
import documentViewerReducer from "@/features/DocumentViewer/documentViewerSlice";
import userReducer from "@/features/users/UserSlice";
import addUserReducer from "@/features/users/AddUserSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer,
    documentViewer: documentViewerReducer,
    users: userReducer,
    addUser: addUserReducer,
  },
});
