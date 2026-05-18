import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Save, Info, CheckCircle, AlertCircle } from "lucide-react";

import { FileDropZone } from "@/components/upload/FileDropZone";
import { AiAnalysisCard } from "@/components/upload/AiAnalysisCard";
import { MetadataForm } from "@/components/upload/MetadataForm";

import {
  extractText,
  analyzeWithAi,
  uploadDoc,
  resetDocumentState,
} from "@/features/documents/DocumentSlices";

// ── Empty form — all Dublin Core fields ──────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  identifier: "",
  creator: "",
  contributor: "",
  subject: "",
  description: "",
  publisher: "",
  date: "",
  source: "",
  docType: "Text",
  language: "ar",
  relation: "",
  coverage: "",
  rights: "All rights reserved",
  classification: "",
};

export default function UploadDocument() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux state ─────────────────────────────────────────────────────────────
  const {
    ocrText,
    fileType,
    ocrStatus,
    ocrError,
    aiResult,
    aiStatus,
    aiError,
    uploadStatus,
    uploadError,
  } = useSelector((state) => state.documents);

  // ── Local state ─────────────────────────────────────────────────────────────
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [aiTags, setAiTags] = useState([]);

  // ── Derived flags ────────────────────────────────────────────────────────────
  const ocrLoading = ocrStatus === "loading";
  const aiLoading = aiStatus === "loading";
  const uploading = uploadStatus === "loading";
  const uploadSuccess = uploadStatus === "succeeded";
  const aiDone = aiStatus === "succeeded";
  const isBusy = ocrLoading || aiLoading || uploading;

  // ── Sync AI result → form fields ─────────────────────────────────────────────
  useEffect(() => {
    if (!aiResult) return;
    setForm((p) => ({
      ...p,
      title: aiResult.title || p.title,
      creator: aiResult.author || p.creator,
      subject: aiResult.subject || p.subject,
      description: aiResult.description || p.description,
      rights: aiResult.rights || p.rights,
      language: aiResult.language || p.language,
      classification: aiResult.category || p.classification,
      coverage: aiResult.coverage || p.coverage,
      source: aiResult.source || p.source,
    }));
    setAiTags(aiResult.tags ?? []);
  }, [aiResult]);

  // ── Redirect after successful upload ─────────────────────────────────────────
  useEffect(() => {
    if (uploadSuccess) {
      setTimeout(() => {
        dispatch(resetDocumentState());
        navigate("/dashboard");
      }, 1800);
    }
  }, [uploadSuccess]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleFieldChange = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleFileChange = (f) => {
    setFile(f);
    setAiTags([]);
    setForm(EMPTY_FORM);
    dispatch(resetDocumentState());
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAiTags([]);
    setForm(EMPTY_FORM);
    dispatch(resetDocumentState());
  };

  // OCR → AI in sequence
  const handleAnalyze = async () => {
    if (!file) return;
    const ocrResult = await dispatch(extractText(file));
    if (extractText.rejected.match(ocrResult)) return;
    await dispatch(analyzeWithAi(ocrResult.payload.text));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    dispatch(
      uploadDoc({
        file,
        fileType,
        form,
        aiSummary: form.description,
        aiTags,
      }),
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1
          className="font-semibold"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "32px",
            lineHeight: "40px",
          }}
        >
          إضافة وثيقة جديدة
        </h1>
        <p
          className="mt-1"
          style={{
            color: "#484551",
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          يرجى رفع الملف وتعبئة البيانات الوصفية (Dublin Core) لإضافته إلى
          الأرشيف.
        </p>
      </header>

      {/* Feedback banners */}
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Metadata form — 7 cols */}
          <div
            className="lg:col-span-7 rounded-xl p-6 flex flex-col gap-6 border"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "rgba(201,196,211,0.35)",
              boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
            }}
          >
            <h2
              className="font-semibold pb-4 border-b"
              style={{
                color: "#1c1b21",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                borderColor: "rgba(201,196,211,0.35)",
              }}
            >
              البيانات الوصفية
            </h2>

            <MetadataForm
              form={form}
              onChange={handleFieldChange}
              disabled={isBusy}
            />

            {/* AI tags */}
            {aiTags.length > 0 && (
              <div
                className="flex flex-wrap gap-2 pt-3 border-t"
                style={{ borderColor: "rgba(201,196,211,0.35)" }}
              >
                <span
                  style={{
                    color: "#797583",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "13px",
                    alignSelf: "center",
                  }}
                >
                  وسوم AI:
                </span>
                {aiTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(53,36,129,0.08)",
                      color: "#352481",
                      fontFamily: "'Noto Sans', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right column — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* File drop zone */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201,196,211,0.35)",
                boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
              }}
            >
              <h2
                className="font-semibold pb-4 mb-4 border-b"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "24px",
                  lineHeight: "32px",
                  borderColor: "rgba(201,196,211,0.35)",
                }}
              >
                الملف
              </h2>
              <FileDropZone
                file={file}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
              />
            </div>

            {/* AI card */}
            <AiAnalysisCard
              file={file}
              ocrLoading={ocrLoading}
              ocrError={ocrError}
              ocrText={ocrText}
              aiLoading={aiLoading}
              aiError={aiError}
              aiDone={aiDone}
              onAnalyze={handleAnalyze}
            />
          </div>
        </div>

        {/* Sticky action bar */}
        <div
          className="mt-6 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky bottom-6 z-30 border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(201,196,211,0.35)",
            boxShadow: "0 4px 16px rgba(28,27,33,0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <Info
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#797583" }}
            />
            <span
              className="text-sm"
              style={{
                color: "#484551",
                fontFamily: "'Noto Sans', sans-serif",
              }}
            >
              {aiDone
                ? "راجع البيانات المستخلصة وعدّل ما يلزم قبل الحفظ."
                : "يمكنك تعبئة البيانات يدوياً أو استخدام التصنيف التلقائي أولاً."}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                color: "#1c1b21",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1ecf5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={!file || !form.title || isBusy}
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
      </form>
    </div>
  );
}
