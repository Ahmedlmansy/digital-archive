import { Info, Save } from "lucide-react";

export default function StickyActionBar({
  aiDone,
  isBusy,
  uploading,
  file,
  formTitle,
  onCancel,
}) {
  return (
    <div
      className="mt-6 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky bottom-6 z-30 border"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(201,196,211,0.35)",
        boxShadow: "0 4px 16px rgba(28,27,33,0.08)",
      }}
    >
      {/* Hint text */}
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 flex-shrink-0" style={{ color: "#797583" }} />
        <span
          className="text-sm"
          style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
        >
          {aiDone
            ? "راجع البيانات المستخلصة وعدّل ما يلزم قبل الحفظ."
            : "يمكنك تعبئة البيانات يدوياً أو استخدام التصنيف التلقائي أولاً."}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          type="button"
          disabled={isBusy}
          onClick={onCancel}
          className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ color: "#1c1b21", fontFamily: "'IBM Plex Sans', sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1ecf5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={!file || !formTitle || isBusy}
          className="flex-1 sm:flex-none px-8 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
          onMouseEnter={(e) =>
            !isBusy && (e.currentTarget.style.backgroundColor = "#4c3d99")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#352481")
          }
        >
          {uploading ? (
            "جارٍ الرفع..."
          ) : (
            <>
              <Save className="w-4 h-4" /> رفع الوثيقة
            </>
          )}
        </button>
      </div>
    </div>
  );
}
