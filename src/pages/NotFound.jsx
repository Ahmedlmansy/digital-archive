import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, LayoutDashboard, Upload } from "lucide-react";

const QUICK_LINKS = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/dashboard" },
  { icon: Upload, label: "رفع وثيقة", href: "/upload" },
  { icon: Search, label: "البحث في الأرشيف", href: "/search" },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        backgroundColor: "#fdf8ff",
        fontFamily: "'Noto Sans', sans-serif",
      }}
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,196,211,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,196,211,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{ backgroundColor: "#352481" }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full pointer-events-none"
        style={{
          backgroundColor: "rgba(76,61,153,0.04)",
          border: "1px dashed rgba(76,61,153,0.12)",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          backgroundColor: "rgba(8,107,83,0.04)",
          border: "1px dashed rgba(8,107,83,0.12)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* 404 large number */}
        <div className="relative mb-6 select-none">
          <span
            className="font-bold leading-none"
            style={{
              fontSize: "clamp(120px, 20vw, 180px)",
              color: "transparent",
              WebkitTextStroke: "2px rgba(53,36,129,0.12)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              letterSpacing: "-4px",
            }}
          >
            404
          </span>
          {/* Overlay solid number slightly offset */}
          <span
            className="absolute inset-0 flex items-center justify-center font-bold leading-none"
            style={{
              fontSize: "clamp(116px, 19.5vw, 176px)",
              color: "rgba(53,36,129,0.07)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              letterSpacing: "-4px",
              transform: "translate(4px, 4px)",
            }}
          >
            404
          </span>
          {/* Archive icon centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(201,196,211,0.5)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#352481"
                strokeWidth={1.4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="font-semibold mb-3"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            lineHeight: "1.2",
          }}
        >
          الصفحة غير موجودة
        </h1>

        <p
          className="mb-8 leading-relaxed"
          style={{
            color: "#484551",
            fontSize: "16px",
            lineHeight: "26px",
            maxWidth: "360px",
          }}
        >
          لم نتمكن من العثور على الوثيقة أو الصفحة التي تبحث عنها. ربما تم نقلها
          أو حذفها أو أن الرابط غير صحيح.
        </p>

        {/* Doc ID badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            backgroundColor: "#f7f2fb",
            border: "1px solid rgba(201,196,211,0.5)",
          }}
        >
          <span
            style={{
              color: "#797583",
              fontSize: "12px",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            رمز الخطأ:
          </span>
          <span
            style={{
              color: "#352481",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'IBM Plex Sans', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            ERR-404-NOT-FOUND
          </span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-8 py-3 rounded-lg shadow-sm transition-colors active:scale-95 mb-6 text-sm font-medium"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#4c3d99")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#352481")
          }
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى لوحة التحكم
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(201,196,211,0.5)" }}
          />
          <span
            style={{
              color: "#797583",
              fontSize: "12px",
              fontFamily: "'Noto Sans', sans-serif",
            }}
          >
            أو تصفح
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(201,196,211,0.5)" }}
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201,196,211,0.4)",
                boxShadow: "0 1px 4px rgba(28,27,33,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f7f2fb";
                e.currentTarget.style.borderColor = "rgba(53,36,129,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(201,196,211,0.4)";
              }}
            >
              <Icon className="w-5 h-5" style={{ color: "#352481" }} />
              <span
                style={{
                  color: "#1c1b21",
                  fontSize: "12px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p
        className="absolute bottom-6 text-center"
        style={{
          color: "#797583",
          fontSize: "12px",
          fontFamily: "'Noto Sans', sans-serif",
        }}
      >
        نظام الأرشفة المؤسسي — للاستخدام الرسمي فقط
      </p>
    </div>
  );
}
