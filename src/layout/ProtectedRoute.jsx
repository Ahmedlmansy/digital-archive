import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, profile, loading } = useSelector(
    (state) => state.auth,
  );

  if (loading) return null;

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  // ← الـ role check هنا على الـ client side
  if (allowedRoles.length > 0) {
    const userRole = profile.role;
    const hasAccess =
      userRole === "archivist" || allowedRoles.includes(userRole);

    if (!hasAccess) {
      return <Navigate to="/app/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
