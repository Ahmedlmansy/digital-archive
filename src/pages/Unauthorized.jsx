import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#fef2f2" }}
      >
        <ShieldOff className="w-10 h-10" style={{ color: "#991b1b" }} />
      </div>

      <div className="text-center">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{
            color: "#1c1b21",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          غير مصرح لك بالدخول
        </h1>
        <p
          className="text-base"
          style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
        >
          ليس لديك الصلاحية للوصول إلى هذه الصفحة.
        </p>
      </div>

      <Button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#352481",
          color: "#ffffff",
          fontFamily: "'IBM Plex Sans', sans-serif",
          borderRadius: "0.5rem",
        }}
      >
        العودة للصفحة السابقة
      </Button>
    </div>
  );
}
