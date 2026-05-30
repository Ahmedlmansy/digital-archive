import { CheckCircle, AlertCircle } from "lucide-react";

export default function UploadFeedbackBanner({ uploadSuccess, uploadError }) {
  if (!uploadSuccess && !uploadError) return null;

  return (
    <>
      {uploadSuccess && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontFamily: "'Noto Sans', sans-serif",
          }}
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          تم رفع الوثيقة بنجاح! جارٍ التوجيه...
        </div>
      )}

      {uploadError && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontFamily: "'Noto Sans', sans-serif",
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {uploadError}
        </div>
      )}
    </>
  );
}
