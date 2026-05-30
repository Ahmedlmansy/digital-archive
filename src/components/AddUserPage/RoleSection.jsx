import { ShieldCheck } from "lucide-react";

const roleOptions = [
  { value: "archivist", label: "أرشيفي" },
  { value: "researcher", label: "باحث" },
  { value: "visitor", label: "زائر" },
];

export default function RoleSection({ formData, errors, onChange }) {
  return (
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
        <ShieldCheck className="w-6 h-6" style={{ color: "#352481" }} />
        الصلاحيات والدور
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role select */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            الدور الوظيفي *
          </label>
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
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

        {/* Status toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-lg border"
          style={{ backgroundColor: "#f7f2fb", borderColor: "#c9c4d3" }}
        >
          <div className="flex flex-col">
            <span
              className="font-medium"
              style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#1c1b21" }}
            >
              حالة الحساب
            </span>
            <span
              className="text-sm"
              style={{ fontFamily: "notoSans, sans-serif", color: "#484551" }}
            >
              السماح للمستخدم بتسجيل الدخول للنظام
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="status"
              checked={formData.status === "active"}
              onChange={onChange}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 rounded-full peer peer-focus:outline-none transition-all"
              style={{
                backgroundColor: formData.status === "active" ? "#086b53" : "#c9c4d3",
              }}
            >
              <div
                className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all"
                style={{ right: formData.status === "active" ? "2px" : "24px" }}
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
