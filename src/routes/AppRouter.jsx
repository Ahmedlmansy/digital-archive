import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/layout/ProtectedRoute";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RigsterPage";

// Public pages (visitor + anyone)
import DocumentViewer from "@/pages/DocumentViewer";

// Researcher + Archivist pages
// import SearchPage from "@/pages/SearchPage";

// Archivist-only pages
import Dashboard from "@/pages/ArchivistPages/Dashboard";
import UploadDocument from "@/pages/ArchivistPages/UploadPage";

// Misc
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  // ─── Auth pages (guest only) ──────────────────────────────────────────────
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  // ─── Public routes — any visitor (logged-in or not) ───────────────────────
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Everyone can view documents
      { path: "document/:id", element: <DocumentViewer /> },

      // Unauthorized page
      { path: "unauthorized", element: <Unauthorized /> },

      // ── Researcher + Archivist ──────────────────────────────────────────
      {
        element: <ProtectedRoute allowedRoles={["researcher", "archivist"]} />,
        // children: [{ path: "search", element: <SearchPage /> }],
      },

      // ── Archivist only ──────────────────────────────────────────────────
      {
        element: <ProtectedRoute allowedRoles={["archivist"]} />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "upload", element: <UploadDocument /> },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
