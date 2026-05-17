import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * allowedRoles: string[] — e.g. ["archivist"] | ["archivist","researcher"] | undefined (any logged-in user)
 * redirectTo:  where to send unauthorized users
 */
export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}) {
  const { user, profile, loading } = useSelector((state) => state.auth);

  // Still checking session (checkAuth in progress)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "16px",
          }}
        >
          جارٍ التحقق من الجلسة...
        </span>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
