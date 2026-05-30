import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { addUser, resetAddUserState } from "@/features/users/AddUserSlice";

import PersonalInfoSection from "@/components/AddUserPage/PersonalInfoSection";
import RoleSection from "@/components/AddUserPage/RoleSection";
import SecuritySection from "@/components/AddUserPage/SecuritySection";

// ── Empty form ────────────────────────────────────────────────
const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  status: "active",
  password: "",
  confirmPassword: "",
};

export default function AddUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, successMessage } = useSelector(
    (state) => state.addUser,
  );

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ── Reset on mount / unmount ──────────────────────────────────
  useEffect(() => {
    dispatch(resetAddUserState());
    return () => dispatch(resetAddUserState());
  }, [dispatch]);

  // ── Redirect on success ───────────────────────────────────────
  useEffect(() => {
    if (status !== "succeeded") return;
    const timer = setTimeout(() => navigate("/app/users"), 1500);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";

    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "بريد إلكتروني غير صالح";

    if (!formData.role) newErrors.role = "الدور الوظيفي مطلوب";

    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
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

        {/* Success banner */}
        {status === "succeeded" && (
          <div
            className="mb-6 p-4 rounded-lg border flex items-center gap-3"
            style={{ backgroundColor: "#a0f3d4", borderColor: "#086b53" }}
          >
            <CheckCircle className="w-5 h-5 text-secondary" />
            <span className="font-medium text-secondary">{successMessage}</span>
          </div>
        )}

        {/* Form card */}
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
            <PersonalInfoSection
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            <hr style={{ borderColor: "#c9c4d3" }} />

            <RoleSection
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            <hr style={{ borderColor: "#c9c4d3" }} />

            <SecuritySection
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            {/* Server error */}
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
