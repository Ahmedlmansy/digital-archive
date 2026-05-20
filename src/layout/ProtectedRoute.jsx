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

  if (allowedRoles.length > 0) {
    const userRole = profile.role;
    // archivist يوصل لكل حاجة
    const hasAccess =
      userRole === "archivist" || allowedRoles.includes(userRole);

    if (!hasAccess) {
      // ← إصلاح: /app/unauthorized مش /app/app/unauthorized
      return <Navigate to="/app/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
