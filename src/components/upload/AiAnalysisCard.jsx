import {
  Sparkles,
  FileSearch,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function AiAnalysisCard({
  file,
  ocrLoading,
  ocrError,
  ocrText,
  aiLoading,
  aiError,
  aiDone,
  onAnalyze,
}) {
  const isLoading = ocrLoading || aiLoading;
  const hasFile = !!file;

  const statusLabel = () => {
    if (ocrLoading) return "جارٍ استخراج النص...";
    if (aiLoading) return "جارٍ التحليل الذكي...";
    if (aiDone) return "تم الاستخلاص بنجاح";
    if (ocrError || aiError) return ocrError || aiError;
    return "دع النظام يقرأ الوثيقة ويملأ البيانات تلقائياً";
  };

  const statusColor = () => {
    if (aiDone) return "#086b53";
    if (ocrError || aiError) return "#ba1a1a";
    return "#484551";
  };

  return (
    <div
      className="rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden border"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(201,196,211,0.35)",
        borderTop: `4px solid ${aiDone ? "#086b53" : "#BA7517"}`,
        boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full pointer-events-none"
        style={{
          backgroundColor: "rgba(186,117,23,0.06)",
          filter: "blur(20px)",
        }}
      />

      {/* Icon */}
      {aiDone ? (
        <CheckCircle className="w-7 h-7 mb-3" style={{ color: "#086b53" }} />
      ) : ocrError || aiError ? (
        <AlertCircle className="w-7 h-7 mb-3" style={{ color: "#ba1a1a" }} />
      ) : (
        <Sparkles className="w-7 h-7 mb-3" style={{ color: "#BA7517" }} />
      )}

      <h4
        className="font-semibold mb-2"
        style={{
          color: "#1c1b21",
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "18px",
        }}
      >
        الاستخلاص الذكي
      </h4>

      <p
        className="text-sm mb-5"
        style={{
          color: statusColor(),
          fontFamily: "'Noto Sans', sans-serif",
          lineHeight: "20px",
        }}
      >
        {statusLabel()}
      </p>

      {/* OCR word count */}
      {ocrText && !aiDone && (
        <div
          className="w-full mb-4 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: "rgba(53,36,129,0.06)" }}
        >
          <FileSearch
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "#352481" }}
          />
          <span
            style={{
              color: "#352481",
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: "13px",
            }}
          >
            تم استخراج{" "}
            {ocrText.split(/\s+/).filter(Boolean).length.toLocaleString("ar")}{" "}
            كلمة
          </span>
        </div>
      )}

      <button
        type="button"
        disabled={!hasFile || isLoading || aiDone}
        onClick={onAnalyze}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-sm transition-all text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: aiDone ? "#086b53" : "#086b53",
          color: "#ffffff",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> يعمل...
          </>
        ) : aiDone ? (
          <>
            <CheckCircle className="w-4 h-4" /> تم التحليل
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> تصنيف تلقائي بالذكاء الاصطناعي
          </>
        )}
      </button>
    </div>
  );
}
