import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/auth/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm"
          style={{ backgroundColor: "#4c3d99" }}
        >
          <BookOpen className="w-8 h-8" style={{ color: "#bfb3ff" }} />
        </div>
        <h1
          className="text-2xl font-semibold text-center"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            lineHeight: "32px",
          }}
        >
          الأرشيف الرقمي
        </h1>
        <p
          className="text-base text-center mt-2"
          style={{
            color: "#484551",
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          تسجيل الدخول للوصول إلى النظام
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="w-full mb-4 px-4 py-3 rounded-lg text-sm text-right"
          style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            fontFamily: "'Noto Sans', sans-serif",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* Email field */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium"
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            البريد الإلكتروني
          </Label>
          <div className="relative">
            <Mail
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#797583" }}
            />
            <Input
              id="email"
              type="email"
              dir="ltr"
              placeholder="user@archive.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="pr-10 pl-3 text-right transition-shadow"
              style={{
                backgroundColor: "#f7f2fb",
                borderColor: "#c9c4d3",
                color: "#1c1b21",
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
                borderRadius: "0.5rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium"
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            كلمة المرور
          </Label>
          <div className="relative">
            <Lock
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#797583" }}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="pr-10 pl-10 transition-shadow"
              style={{
                backgroundColor: "#f7f2fb",
                borderColor: "#c9c4d3",
                color: "#1c1b21",
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
                borderRadius: "0.5rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "#797583" }}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-1 flex items-center justify-center gap-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-70"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
            borderRadius: "0.5rem",
            paddingTop: "12px",
            paddingBottom: "12px",
            height: "auto",
          }}
        >
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          {!loading && <LogIn className="w-4 h-4" />}
        </Button>
      </form>

      {/* Footer links */}
      <div
        className="w-full flex items-center justify-center gap-4 mt-6 pt-6"
        style={{ borderTop: "1px solid rgba(201,196,211,0.5)" }}
      >
        <a
          href="/register"
          className="text-sm font-medium transition-colors"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          إنشاء حساب
        </a>
        <span style={{ color: "#c9c4d3" }}>•</span>
        <a
          href="/forgot-password"
          className="text-sm font-medium transition-colors"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          نسيت كلمة المرور؟
        </a>
      </div>

      {/* Caption */}
      <p
        className="text-center mt-6 px-4"
        style={{
          color: "rgba(72,69,81,0.7)",
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        متاح للأرشيفيين والباحثين والزوار المصرح لهم
      </p>
    </div>
  );
}
