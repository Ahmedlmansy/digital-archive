import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SecuritySection({ formData, errors, onChange }) {
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
        <Lock className="w-6 h-6" style={{ color: "#352481" }} />
        الأمان
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            كلمة المرور *
          </label>
          <Input
            name="password"
            value={formData.password}
            onChange={onChange}
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
            <span className="text-sm text-error">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label
            className="font-medium"
            style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px", color: "#484551" }}
          >
            تأكيد كلمة المرور *
          </label>
          <Input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
            type="password"
            dir="ltr"
            className="px-4 py-2 rounded-lg border text-left h-auto"
            style={{
              backgroundColor: "#fdf8ff",
              borderColor: errors.confirmPassword ? "#ba1a1a" : "#c9c4d3",
              fontFamily: "notoSans, sans-serif",
              fontSize: "16px",
            }}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-error">{errors.confirmPassword}</span>
          )}
        </div>
      </div>
    </section>
  );
}
