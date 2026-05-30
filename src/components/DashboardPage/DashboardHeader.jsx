import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ onAddDocument }) {
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h1
          className="font-semibold"
          style={{
            color: "#1c1b21",
            fontFamily: "ibmPlexSans, sans-serif",
            fontSize: "32px",
            lineHeight: "40px",
          }}
        >
          نظرة عامة
        </h1>
        <p
          className="mt-1"
          style={{
            color: "#484551",
            fontFamily: "notoSans, sans-serif",
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          مرحباً بك في نظام الأرشفة المؤسسي.
        </p>
      </div>

      <Button
        onClick={onAddDocument}
        className="flex items-center gap-2 shadow-sm transition-colors active:scale-95 self-start sm:self-auto"
        style={{
          backgroundColor: "#352481",
          color: "#ffffff",
          fontFamily: "ibmPlexSans, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "0.5rem",
          padding: "12px 24px",
          height: "auto",
        }}
      >
        <Plus className="w-4 h-4" />
        إضافة وثيقة جديدة
      </Button>
    </header>
  );
}
