import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const { isAuthenticated, profile, loading } = useSelector(
    (state) => state.auth,
  );

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

  // لو مسجل دخول، redirect حسب الدور
  if (isAuthenticated && profile) {
    const userRole = profile.role;

    if (userRole === "archivist") {
      return <Navigate to="/app/dashboard" replace />;
    }
    if (userRole === "researcher") {
      return <Navigate to="/app/documents" replace />;
    }
    return <Navigate to="/app/documents" replace />;
  }

  // ←←← login / register فقط ←←←
  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#fdf8ff",
        fontFamily: "'IBM Plex Sans', 'Noto Sans Arabic', sans-serif",
      }}
    >
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEKJmXjtYxeJBDuaBAbVL2b3n9J-TJt9pFGxltwCyssyyunhTYVWVTEsYvmDVZRmfPxT8K9Mwujs8RqpDch-tqKF8YA7giUxSQ4ZERq7ESHqFyWM_hzphz1BFEOw-U_WJqk7Bo-jL1MwwfiCAMyn_m__SGfEb09S7Yx-aa2MmZ7cP33cgYJ7f_c2MmTsBRzR9P1t069oKfTUhRevFBwCdgR2dj_pQXJn1b3UpDQJPr8WdXztCcVvMtlSEnbuPdVy0FqACmTfhNCSQ')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(253,248,255,0.85) 0%, rgba(241,236,245,0.75) 50%, rgba(253,248,255,0.90) 100%)",
        }}
      />
      <div
        className="absolute top-0 inset-x-0 z-10 h-1"
        style={{ backgroundColor: "#352481" }}
      />

      <main className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
        <div
          className="w-full rounded-xl px-8 py-8"
          style={{
            backgroundColor: "#ffffff",
            boxShadow:
              "0 4px 16px rgba(28,27,33,0.06), 0 1px 3px rgba(28,27,33,0.04)",
            border: "1px solid #ebe6ef",
          }}
        >
          <Outlet />
        </div>
        <p
          className="text-center text-xs mt-6"
          style={{ color: "#797583", fontFamily: "'Noto Sans', sans-serif" }}
        >
          جميع الحقوق محفوظة © {new Date().getFullYear()} — للاستخدام الرسمي فقط
        </p>
      </main>
    </div>
  );
}
