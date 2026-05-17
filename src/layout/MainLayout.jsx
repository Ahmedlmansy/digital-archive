import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Settings,
  Search,
  LayoutDashboard,
  Upload,
  FileText,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { logout } from "@/features/auth/authSlice";

// ── Nav items per role ────────────────────────────────────────────────────────
const NAV_BY_ROLE = {
  archivist: [
    { label: "لوحة التحكم", icon: LayoutDashboard, href: "/dashboard" },
    { label: "رفع وثيقة", icon: Upload, href: "/upload" },
    { label: "عرض المستندات", icon: FileText, href: "/documents" },
    { label: "البحث", icon: Search, href: "/search" },
    { label: "المستخدمون", icon: Users, href: "/users" },
  ],
  researcher: [
    { label: "عرض المستندات", icon: FileText, href: "/documents" },
    { label: "البحث", icon: Search, href: "/search" },
  ],
  visitor: [{ label: "عرض المستندات", icon: FileText, href: "/documents" }],
};

// ── Avatar initials helper ────────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0] ?? "؟";
  return (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "");
}

// ── Role label in Arabic ──────────────────────────────────────────────────────
const ROLE_LABEL = {
  archivist: "أرشيفي",
  researcher: "باحث",
  visitor: "زائر",
};

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = profile?.role ?? "visitor";
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.visitor;
  const initials = getInitials(profile?.full_name);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{ backgroundColor: "#f1ecf5" }}
    >
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 right-0 w-full z-50 flex items-center justify-between h-20 border-b"
        style={{
          backgroundColor: "#fdf8ff",
          borderColor: "#c9c4d3",
          paddingInline: "clamp(1rem, 4vw, 4rem)",
          boxShadow: "0 1px 4px rgba(28,27,33,0.06)",
        }}
      >
        {/* Right: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ color: "#352481" }}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            className="text-2xl font-semibold"
            style={{
              color: "#352481",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            الأرشيف الرقمي
          </span>
        </div>

        {/* Center: search */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl px-6">
          <div className="relative w-full">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#797583" }}
            />
            <Input
              type="text"
              placeholder="بحث في الأرشيف..."
              className="w-full rounded-full pr-10 pl-4 py-2 border transition-colors focus-visible:ring-0 focus-visible:border-[#352481]"
              style={{
                backgroundColor: "#f7f2fb",
                borderColor: "#c9c4d3",
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "16px",
                color: "#1c1b21",
              }}
            />
          </div>
        </div>

        {/* Left: settings + avatar */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors active:scale-95"
            style={{ color: "#352481" }}
            aria-label="الإعدادات"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            className="h-7 w-px mx-1"
            style={{ backgroundColor: "#c9c4d3" }}
          />

          {/* Avatar initials */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center select-none font-semibold text-sm border"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              borderColor: "#4c3d99",
              fontFamily: "'IBM Plex Sans', sans-serif",
              letterSpacing: "0.05em",
            }}
            title={profile?.full_name}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* ── SIDEBAR OVERLAY (mobile) ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 right-0 h-full z-40 pt-20 pb-8 flex flex-col transition-transform duration-300 w-72",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
        style={{
          backgroundColor: "#fdf8ff",
          boxShadow: "-2px 0 8px rgba(28,27,33,0.06)",
          borderLeft: "1px solid #ebe6ef",
        }}
      >
        {/* Close button mobile */}
        <button
          className="absolute top-5 left-3 lg:hidden flex items-center justify-center w-8 h-8 rounded-full"
          style={{ color: "#484551" }}
          onClick={() => setSidebarOpen(false)}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User info block */}
        <div className="px-6 mb-5 flex flex-col items-center text-center">
          {/* Big avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3 text-3xl font-bold select-none"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            {initials}
          </div>

          <h2
            className="text-lg font-semibold leading-snug"
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            {profile?.full_name ?? "مستخدم"}
          </h2>

          {/* Role badge */}
          <span
            className="mt-1 px-3 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "rgba(53,36,129,0.1)",
              color: "#352481",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            {ROLE_LABEL[role]}
          </span>

          {/* Advanced search button */}
          <button
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg shadow-sm transition-colors text-sm font-medium active:scale-95"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            <Search className="w-4 h-4" />
            <span>بحث متقدم</span>
          </button>
        </div>

        {/* Divider */}
        <div
          className="mx-6 mb-2 h-px"
          style={{ backgroundColor: "#ebe6ef" }}
        />

        {/* Nav items — filtered by role */}
        <div className="flex-1 flex flex-col gap-1 px-3 mt-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => (
            <NavLink
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                  isActive ? "border-r-4 rounded-r-none" : "hover:bg-[#f1ecf5]",
                )
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: "rgba(8,107,83,0.08)",
                      borderColor: "#086b53",
                      color: "#086b53",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }
                  : {
                      color: "#484551",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-5 h-5 flex-shrink-0 transition-colors"
                    style={{ color: isActive ? "#086b53" : "#797583" }}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="px-3 mt-4">
          <div
            className="mx-3 mb-2 h-px"
            style={{ backgroundColor: "#ebe6ef" }}
          />
          <button
            onClick={handleLogout}
            className="w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium hover:bg-red-50 active:scale-95"
            style={{
              color: "#ba1a1a",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main
        className="pt-20 min-h-screen transition-all duration-300 lg:pr-72"
        style={{ backgroundColor: "#f1ecf5" }}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
