import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/layout/ProtectedRoute";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RigsterPage";
import VisitorHomePage from "@/pages/VisitorHomePage";
import DocumentViewer from "@/pages/DocumentViewer";
import DocumentArchive from "@/pages/AllDocumentArchive";
import Dashboard from "@/pages/ArchivistPages/Dashboard";
import UploadDocument from "@/pages/ArchivistPages/UploadPage";
import UsersPage from "@/pages/ArchivistPages/UsersPage";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import AddUserPage from "@/pages/ArchivistPages/AddUserPage";
import DashboardPage from "@/pages/ArchivistPages/DashboardPage.jsx";
import AdvancedSearchPage from "@/pages/ArchivistPages/AdvancedSearchPage";

// ═══════════════════════════════════════════════════════════════
// GuestRoute — للزوار فقط (VisitorHomePage)
// ═══════════════════════════════════════════════════════════════
function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fdf8ff" }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "#352481" }}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    const role = user?.role || "visitor";
    if (role === "archivist") return <Navigate to="/app/dashboard" replace />;
    return <Navigate to="/app/documents" replace />;
  }

  return children;
}

// ═══════════════════════════════════════════════════════════════
// AppLayout — للمستخدمين المسجلين فقط
// ═══════════════════════════════════════════════════════════════
function AppLayout() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fdf8ff" }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "#352481" }}
        />
      </div>
    );
  }

  // ← إصلاح: redirect لـ /login مش لـ /
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}

const router = createBrowserRouter([
  // ─── الصفحة الرئيسية (للزوار) ──────────────────────────────────────────
  {
    path: "/",
    element: (
      <GuestRoute>
        <VisitorHomePage />
      </GuestRoute>
    ),
  },

  // ─── Auth pages (Login / Register) ──────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  // ─── Protected App (/app/*) ──────────────────────────────────────────────
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      // ← redirect افتراضي حسب الدور بيتعمل في AuthLayout/AppLayout
      { index: true, element: <Navigate to="/app/documents" replace /> },

      // متاح لكل المسجلين
      { path: "documents", element: <DocumentArchive /> },
      { path: "documents/:id", element: <DocumentViewer /> },
      { path: "unauthorized", element: <Unauthorized /> },

      // Researcher + Archivist
      {
        element: <ProtectedRoute allowedRoles={["researcher", "archivist"]} />,
        children: [
          { path: "users", element: <UsersPage /> },
          { path: "dashboard-researcher", element: <DashboardPage /> },
        ],
      },

      // Archivist only
      {
        element: <ProtectedRoute allowedRoles={["archivist"]} />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "upload", element: <UploadDocument /> },
          { path: "add-user", element: <AddUserPage /> },
          { path: "advanced-search", element: <AdvancedSearchPage /> },
        ],
      },
    ],
  },

  // ─── Redirects من القديم للجديد ──────────────────────────────────────────
  { path: "/dashboard", element: <Navigate to="/app/dashboard" replace /> },
  { path: "/upload", element: <Navigate to="/app/upload" replace /> },
  { path: "/users", element: <Navigate to="/app/users" replace /> },
  { path: "/documents", element: <Navigate to="/app/documents" replace /> },

  // 404
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
