import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";
import Dashboard from "@/pages/ArchivistPages/Dashboard";
import UploadDocument from "@/pages/ArchivistPages/UploadPage";
// import ProtectedRoute from "@/layout/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RigsterPage from "@/pages/auth/RigsterPage";
import DocumentViewer from "@/pages/DocumentViewer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function AppRouter()
{
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,

      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/upload",
          element: <UploadDocument />,
        },
        {
          path: "/documentViewer",
          element: <DocumentViewer />,
        },
      ],
    },

    {
      path: "/",
      element: <AuthLayout />,

      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RigsterPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default AppRouter;
