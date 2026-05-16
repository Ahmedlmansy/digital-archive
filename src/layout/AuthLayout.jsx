import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#fdf8ff",
        fontFamily: "'IBM Plex Sans', 'Noto Sans Arabic', sans-serif",
      }}
    >
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEKJmXjtYxeJBDuaBAbVL2b3n9J-TJt9pFGxltwCyssyyunhTYVWVTEsYvmDVZRmfPxT8K9Mwujs8RqpDch-tqKF8YA7giUxSQ4ZERq7ESHqFyWM_hzphz1BFEOw-U_WJqk7Bo-jL1MwwfiCAMyn_m__SGfEb09S7Yx-aa2MmZ7cP33cgYJ7f_c2MmTsBRzR9P1t069oKfTUhRevFBwCdgR2dj_pQXJn1b3UpDQJPr8WdXztCcVvMtlSEnbuPdVy0FqACmTfhNCSQ')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      {/* Subtle gradient veil over pattern */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(253,248,255,0.85) 0%, rgba(241,236,245,0.75) 50%, rgba(253,248,255,0.90) 100%)",
        }}
      />

      {/* Decorative top border */}
      <div
        className="absolute top-0 inset-x-0 z-10 h-1"
        style={{ backgroundColor: "#352481" }}
      />

      {/* Main content card */}
      <main className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
        {/* Logo / Brand header */}
        <div className="flex flex-col items-center mb-8 gap-3">
        </div>

        {/* Auth card */}
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

        {/* Footer note */}
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
