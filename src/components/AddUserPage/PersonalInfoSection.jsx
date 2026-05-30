import { User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PersonalInfoSection({ formData, errors, onChange }) {
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
        <User className="w-6 h-6" style={{ color: "#352481" }} />
        المعلومات الشخصية
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            الاسم الكامل *
          </label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
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
            <span className="text-sm text-error">{errors.fullName}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            البريد الإلكتروني *
          </label>
          <Input
            name="email"
            value={formData.email}
            onChange={onChange}
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

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            رقم الهاتف
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={onChange}
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
  );
}
