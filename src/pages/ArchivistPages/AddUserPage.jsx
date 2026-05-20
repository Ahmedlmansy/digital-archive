import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addUser, resetAddUserState } from "@/features/users/AddUserSlice";

const roleOptions = [
  { value: "archivist", label: "أرشيفي" },
  { value: "researcher", label: "باحث" },
  { value: "visitor", label: "زائر" },
];

export default function AddUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useSelector(
    (state) => state.addUser,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Reset state on mount/unmount
  useEffect(() => {
    dispatch(resetAddUserState());
    return () => dispatch(resetAddUserState());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (status === "succeeded") {
      const timer = setTimeout(() => {
        navigate("/app/users");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "بريد إلكتروني غير صالح";
    }

    if (!formData.role) {
      newErrors.role = "الدور الوظيفي مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      addUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        role: formData.role,
        status: formData.status,
      }),
    );
  };

  const handleCancel = () => {
    dispatch(resetAddUserState());
    navigate("/app/users");
  };

  return (
    <main
      dir="rtl"
      className="flex-1 mt-16 p-4 md:p-16"
      style={{ backgroundColor: "#F8F7F4", minHeight: "100vh" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="font-semibold"
            style={{
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#1c1b21",
            }}
          >
            إضافة مستخدم جديد
          </h2>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 transition-colors hover:opacity-80"
            style={{
              color: "#352481",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            العودة للقائمة
          </button>
        </div>

        {/* Success Message */}
        {status === "succeeded" && (
          <div
            className="mb-6 p-4 rounded-lg border flex items-center gap-3"
            style={{ backgroundColor: "#a0f3d4", borderColor: "#086b53" }}
          >
            <CheckCircle className="w-5 h-5 text-secondary" />
            <span className="font-medium text-secondary">{successMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div
          className="rounded-xl overflow-hidden border shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#c9c4d3",
            boxShadow: "0 4px 12px rgba(44,44,42,0.05)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col gap-8"
          >
            {/* Personal Information */}
            <section>
              <h3
                className="mb-4 flex items-center gap-2 font-semibold"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "#1c1b21",
                }}
              >
                {/* <Person className="w-6 h-6" style={{ color: "#352481" }} /> */}
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    الاسم الكامل *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="أدخل الاسم الكامل"
                    className="px-4 py-2 rounded-lg border text-right h-auto"
                    style={{
                      backgroundColor: "#fdf8ff",
                      borderColor: errors.fullName ? "#ba1a1a" : "#c9c4d3",
                      fontFamily: "notoSans, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {errors.fullName && (
                    <span className="text-sm text-error">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    البريد الإلكتروني *
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    type="email"
                    dir="ltr"
                    className="px-4 py-2 rounded-lg border text-left h-auto"
                    style={{
                      backgroundColor: "#fdf8ff",
                      borderColor: errors.email ? "#ba1a1a" : "#c9c4d3",
                      fontFamily: "notoSans, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {errors.email && (
                    <span className="text-sm text-error">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    رقم الهاتف
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+966 50 000 0000"
                    type="tel"
                    dir="ltr"
                    className="px-4 py-2 rounded-lg border text-left h-auto"
                    style={{
                      backgroundColor: "#fdf8ff",
                      borderColor: "#c9c4d3",
                      fontFamily: "notoSans, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
            </section>

            <hr style={{ borderColor: "#c9c4d3" }} />

            {/* Role & Permissions */}
            <section>
              <h3
                className="mb-4 flex items-center gap-2 font-semibold"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "#1c1b21",
                }}
              >
                {/* <ShieldPerson
                  className="w-6 h-6"
                  style={{ color: "#352481" }}
                /> */}
                الصلاحيات والدور
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    الدور الوظيفي *
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border appearance-none text-right"
                      style={{
                        backgroundColor: "#fdf8ff",
                        borderColor: errors.role ? "#ba1a1a" : "#c9c4d3",
                        fontFamily: "notoSans, sans-serif",
                        fontSize: "16px",
                        color: formData.role ? "#1c1b21" : "#797583",
                      }}
                    >
                      <option value="" disabled>
                        اختر الدور المناسب...
                      </option>
                      {roleOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                      ▼
                    </span>
                  </div>
                  {errors.role && (
                    <span className="text-sm text-error">{errors.role}</span>
                  )}
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ backgroundColor: "#f7f2fb", borderColor: "#c9c4d3" }}
                >
                  <div className="flex flex-col">
                    <span
                      className="font-medium"
                      style={{
                        fontFamily: "ibmPlexSans, sans-serif",
                        fontSize: "14px",
                        color: "#1c1b21",
                      }}
                    >
                      حالة الحساب
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: "notoSans, sans-serif",
                        color: "#484551",
                      }}
                    >
                      السماح للمستخدم بتسجيل الدخول للنظام
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status === "active"}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 rounded-full peer peer-focus:outline-none transition-all"
                      style={{
                        backgroundColor:
                          formData.status === "active" ? "#086b53" : "#c9c4d3",
                      }}
                    >
                      <div
                        className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all"
                        style={{
                          right: formData.status === "active" ? "2px" : "24px",
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <hr style={{ borderColor: "#c9c4d3" }} />

            {/* Security */}
            <section>
              <h3
                className="mb-4 flex items-center gap-2 font-semibold"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "#1c1b21",
                }}
              >
                <Lock className="w-6 h-6" style={{ color: "#352481" }} />
                الأمان
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    كلمة المرور *
                  </label>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    type="password"
                    dir="ltr"
                    className="px-4 py-2 rounded-lg border text-left h-auto"
                    style={{
                      backgroundColor: "#fdf8ff",
                      borderColor: errors.password ? "#ba1a1a" : "#c9c4d3",
                      fontFamily: "notoSans, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {errors.password && (
                    <span className="text-sm text-error">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="font-medium"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    تأكيد كلمة المرور *
                  </label>
                  <Input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    type="password"
                    dir="ltr"
                    className="px-4 py-2 rounded-lg border text-left h-auto"
                    style={{
                      backgroundColor: "#fdf8ff",
                      borderColor: errors.confirmPassword
                        ? "#ba1a1a"
                        : "#c9c4d3",
                      fontFamily: "notoSans, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                  {errors.confirmPassword && (
                    <span className="text-sm text-error">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Server Error */}
            {error && (
              <div
                className="p-4 rounded-lg border text-center"
                style={{ backgroundColor: "#ffdad6", borderColor: "#ba1a1a" }}
              >
                <p className="text-error font-medium">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="px-6 py-2 rounded-lg border transition-colors hover:bg-surface-container-low"
                style={{
                  borderColor: "#797583",
                  color: "#484551",
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={status === "loading" || status === "succeeded"}
                className="px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                style={{
                  backgroundColor: "#352481",
                  color: "#ffffff",
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : status === "succeeded" ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تم الحفظ
                  </span>
                ) : (
                  "حفظ البيانات"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
