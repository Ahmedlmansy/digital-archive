import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BadgeCheck,
  UserPlus,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "@/features/auth/authSlice";

export default function RegisterForm() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setValidationError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    if (form.password !== form.confirmPassword) {
      setValidationError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (form.password.length < 6) {
      setValidationError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    const result = await dispatch(
      register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      }),
    );

    if (register.fulfilled.match(result)) {
      // Supabase sends a confirmation email — user must verify before login
      setSuccessMsg(
        "تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب.",
      );
    }
  };

  // shared input style
  const inputStyle = {
    backgroundColor: "#ffffff",
    borderColor: "#c9c4d3",
    color: "#1c1b21",
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: "16px",
    lineHeight: "24px",
    borderRadius: "0.5rem",
    height: "48px",
    paddingRight: "44px",
  };

  const labelStyle = {
    color: "#484551",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 500,
  };

  const displayError = validationError || error;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-sm"
          style={{ backgroundColor: "#352481" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#bfb3ff"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
            />
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          الأرشيف الرقمي
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
        >
          إنشاء حساب جديد في النظام المؤسسي
        </p>
      </div>

      {/* Error Message */}
      {displayError && (
        <div
          className="w-full mb-4 px-4 py-3 rounded-lg text-sm text-right"
          style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            fontFamily: "'Noto Sans', sans-serif",
          }}
        >
          {displayError}
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div
          className="w-full mb-4 px-4 py-3 rounded-lg text-sm text-right"
          style={{
            backgroundColor: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            fontFamily: "'Noto Sans', sans-serif",
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name" style={labelStyle}>
            الاسم الكامل
          </Label>
          <div className="relative">
            <User
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#797583" }}
            />
            <Input
              id="full_name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              disabled={loading}
              style={inputStyle}
              className="transition-all focus-visible:ring-2"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" style={labelStyle}>
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
              placeholder="example@domain.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={loading}
              style={{ ...inputStyle, textAlign: "left" }}
              className="transition-all focus-visible:ring-2"
            />
          </div>
        </div>

        {/* Role Select */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role" style={labelStyle}>
            نوع الحساب
          </Label>
          <div className="relative">
            <BadgeCheck
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
              style={{ color: "#797583" }}
            />
            <Select
              onValueChange={(v) => handleChange("role", v)}
              disabled={loading}
            >
              <SelectTrigger
                id="role"
                className="w-full h-12 pr-10 transition-all focus:ring-2"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#c9c4d3",
                  color: form.role ? "#1c1b21" : "#797583",
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: "16px",
                  borderRadius: "0.5rem",
                }}
              >
                <SelectValue placeholder="اختر نوع الحساب" />
              </SelectTrigger>
              <SelectContent
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  borderColor: "#c9c4d3",
                  borderRadius: "0.5rem",
                }}
              >
                <SelectItem value="researcher">باحث</SelectItem>
                <SelectItem value="visitor">زائر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" style={labelStyle}>
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={loading}
                style={{ ...inputStyle, paddingLeft: "40px" }}
                className="transition-all focus-visible:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#797583" }}
                aria-label={showPassword ? "إخفاء" : "إظهار"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm_password" style={labelStyle}>
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <RotateCcw
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "#797583" }}
              />
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                required
                disabled={loading}
                style={{ ...inputStyle, paddingLeft: "40px" }}
                className="transition-all focus-visible:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#797583" }}
                aria-label={showConfirm ? "إخفاء" : "إظهار"}
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2 py-1">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            disabled={loading}
            style={{ borderColor: "#c9c4d3" }}
            className="data-[state=checked]:bg-[#352481] data-[state=checked]:border-[#352481]"
          />
          <label
            htmlFor="terms"
            className="cursor-pointer select-none"
            style={{
              color: "#484551",
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: "12px",
              lineHeight: "16px",
            }}
          >
            أوافق على{" "}
            <a
              href="#"
              style={{ color: "#352481" }}
              className="hover:underline"
            >
              شروط الاستخدام
            </a>{" "}
            و{" "}
            <a
              href="#"
              style={{ color: "#352481" }}
              className="hover:underline"
            >
              سياسة الخصوصية
            </a>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!agreed || loading}
          className="w-full h-12 flex items-center justify-center gap-2 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "16px",
            borderRadius: "0.5rem",
          }}
        >
          {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
          {!loading && <UserPlus className="w-4 h-4" />}
        </Button>
      </form>

      {/* Footer */}
      <div
        className="mt-6 pt-5 w-full text-center"
        style={{ borderTop: "1px solid rgba(201,196,211,0.3)" }}
      >
        <p
          style={{
            color: "#484551",
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: "16px",
          }}
        >
          لديك حساب بالفعل؟{" "}
          <a
            href="/login"
            className="font-bold hover:underline transition-colors me-1"
            style={{ color: "#086b53" }}
          >
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
