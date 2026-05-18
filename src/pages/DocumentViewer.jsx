import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ArrowRight,
  Quote,
  Share2,
  Printer,
  Download,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Maximize2,
  Sparkles,
  FileIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  fetchDocument,
  fetchSignedUrl,
  incrementViewCount,
  resetViewer,
} from "@/features/DocumentViewer/documentViewerSlice";

// pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ── helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ── Small components ──────────────────────────────────────────────────────────
function IconBtn({ onClick, disabled, children, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-30"
      style={{ color: "#484551" }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "#ebe6ef";
      }}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      {children}
    </button>
  );
}

function ActionBtn({ primary, icon: Icon, label, onClick }) {
  const base = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "14px",
    borderRadius: "0.5rem",
  };
  return primary ? (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 shadow-sm transition-colors text-sm font-medium"
      style={{ ...base, backgroundColor: "#352481", color: "#ffffff" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4c3d99")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#352481")}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  ) : (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 border transition-colors text-sm font-medium"
      style={{
        ...base,
        borderColor: "#c9c4d3",
        color: "#484551",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1ecf5")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function MetaRow({ label, value, link }) {
  return (
    <div
      className="flex flex-col gap-1 py-3 border-b"
      style={{ borderColor: "rgba(201,196,211,0.5)" }}
    >
      <span
        style={{
          color: "#797583",
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: "12px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: link ? "#352481" : "#1c1b21",
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: "15px",
          cursor: link ? "pointer" : "default",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DocumentViewer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    document: doc,
    signedUrl,
    status,
    error,
  } = useSelector((state) => state.documentViewer);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);

  // ── Load document ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    dispatch(fetchDocument(id)).then((res) => {
      if (fetchDocument.fulfilled.match(res)) {
        dispatch(fetchSignedUrl(res.payload.file_path));
        dispatch(incrementViewCount(id));
      }
    });
    return () => dispatch(resetViewer());
  }, [id]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 50));
  const fitScreen = () => setZoom(100);
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleDownload = () => {
    if (!signedUrl) return;
    const a = window.document.createElement("a");
    a.href = signedUrl;
    a.download = doc?.dc_title ?? "document";
    a.click();
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fdf8ff" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "#352481" }}
          />
          <p
            style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
          >
            جارٍ تحميل الوثيقة...
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fdf8ff" }}
      >
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <AlertCircle className="w-10 h-10" style={{ color: "#ba1a1a" }} />
          <p
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            تعذّر تحميل الوثيقة
          </p>
          <p
            style={{ color: "#797583", fontFamily: "'Noto Sans', sans-serif" }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-5 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const tags = doc?.ai_tags ?? [];
  const isDocx = doc?.dc_format === "DOCX";

  return (
    <div
      dir="rtl"
      className="h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#fdf8ff",
        fontFamily: "'Noto Sans', sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="h-20 flex-shrink-0 border-b flex items-center justify-between z-50 relative"
        style={{
          backgroundColor: "#fdf8ff",
          borderColor: "#c9c4d3",
          padding: "0 clamp(1rem,4vw,4rem)",
          boxShadow: "0 1px 4px rgba(28,27,33,0.06)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            aria-label="العودة"
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0"
            style={{ color: "#484551" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#ebe6ef")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div
            className="h-6 w-px flex-shrink-0"
            style={{ backgroundColor: "#c9c4d3" }}
          />
          <h1
            className="font-semibold truncate max-w-[200px] md:max-w-lg"
            style={{
              color: "#352481",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "clamp(16px,2vw,22px)",
              lineHeight: "32px",
            }}
          >
            {doc?.dc_title ?? "جارٍ التحميل..."}
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ActionBtn icon={Quote} label="استشهاد" />
          <ActionBtn icon={Share2} label="مشاركة" />
          <ActionBtn
            icon={Printer}
            label="طباعة"
            onClick={() => window.print()}
          />
          <ActionBtn
            icon={Download}
            label="تحميل"
            primary
            onClick={handleDownload}
          />
        </div>
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full"
          style={{ color: "#484551" }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
        {/* PDF Viewer — 70% */}
        <section
          className="flex-1 lg:w-[70%] flex flex-col h-full"
          style={{ backgroundColor: "#f1ecf5" }}
        >
          {/* Toolbar */}
          <div
            className="h-12 border-b flex items-center justify-between px-6 z-10 flex-shrink-0"
            style={{
              backgroundColor: "#fdf8ff",
              borderColor: "#c9c4d3",
              boxShadow: "0 2px 4px rgba(28,27,33,0.03)",
            }}
          >
            <div className="flex items-center gap-1">
              <IconBtn
                onClick={prevPage}
                disabled={currentPage <= 1}
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </IconBtn>
              <span
                style={{
                  color: "#484551",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "13px",
                  minWidth: "80px",
                  textAlign: "center",
                }}
              >
                {totalPages > 0 ? `${currentPage} / ${totalPages}` : "—"}
              </span>
              <IconBtn
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </IconBtn>
            </div>

            <div className="flex items-center gap-1">
              <IconBtn onClick={zoomOut} title="تصغير">
                <Minus className="w-4 h-4" />
              </IconBtn>
              <span
                style={{
                  color: "#484551",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "13px",
                  minWidth: "48px",
                  textAlign: "center",
                }}
              >
                {zoom}%
              </span>
              <IconBtn onClick={zoomIn} title="تكبير">
                <Plus className="w-4 h-4" />
              </IconBtn>
              <IconBtn onClick={fitScreen} title="ملاءمة الشاشة">
                <Maximize2 className="w-4 h-4" />
              </IconBtn>
            </div>
          </div>

          {/* PDF canvas */}
          <div className="flex-1 overflow-auto flex justify-center py-6 px-4">
            {!signedUrl ? (
              <div className="flex items-center justify-center h-full">
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "#352481" }}
                />
              </div>
            ) : isDocx ? (
              // DOCX — show download prompt
              <div className="flex flex-col items-center justify-center gap-4 h-full text-center">
                <FileIcon className="w-16 h-16" style={{ color: "#797583" }} />
                <p
                  style={{
                    color: "#1c1b21",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  ملف Word
                </p>
                <p
                  style={{
                    color: "#797583",
                    fontFamily: "'Noto Sans', sans-serif",
                  }}
                >
                  لا يمكن عرض ملفات DOCX مباشرةً — قم بتحميل الملف لعرضه
                </p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: "#352481",
                    color: "#ffffff",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                  }}
                >
                  <Download className="w-4 h-4" /> تحميل الملف
                </button>
              </div>
            ) : (
              <Document
                file={signedUrl}
                onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                loading={
                  <Loader2
                    className="w-6 h-6 animate-spin mt-20"
                    style={{ color: "#352481" }}
                  />
                }
                error={
                  <p style={{ color: "#ba1a1a", marginTop: "2rem" }}>
                    تعذّر تحميل الملف
                  </p>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={zoom / 100}
                  className="shadow-lg"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            )}
          </div>
        </section>

        {/* Sidebar — 30% */}
        <aside
          className="w-full lg:w-[30%] flex-shrink-0 overflow-y-auto border-r flex flex-col gap-6 p-5"
          style={{ backgroundColor: "#fdf8ff", borderColor: "#c9c4d3" }}
        >
          {/* AI Summary */}
          {doc?.ai_summary && (
            <section
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "rgba(186,117,23,0.05)",
                borderColor: "rgba(186,117,23,0.25)",
              }}
            >
              <header className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(186,117,23,0.15)" }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "#BA7517" }} />
                </div>
                <h3
                  className="font-bold"
                  style={{
                    color: "#1c1b21",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  ملخص الذكاء الاصطناعي
                </h3>
              </header>
              <p
                className="leading-relaxed"
                style={{
                  color: "#484551",
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: "22px",
                }}
              >
                {doc.ai_summary}
              </p>
            </section>
          )}

          {/* Metadata */}
          <section>
            <h3
              className="font-semibold mb-3"
              style={{
                color: "#1c1b21",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "18px",
              }}
            >
              معلومات المستند
            </h3>

            <div
              className="flex flex-col border-t"
              style={{ borderColor: "#c9c4d3" }}
            >
              <MetaRow label="العنوان" value={doc?.dc_title} />
              <MetaRow
                label="المؤلف / الجهة المنشئة"
                value={doc?.dc_creator}
                link
              />
              <MetaRow label="الناشر" value={doc?.dc_publisher} />
              <MetaRow label="تاريخ الوثيقة" value={formatDate(doc?.dc_date)} />
              <MetaRow label="التصنيف" value={doc?.categories?.name_ar} />
              <MetaRow label="الصيغة" value={doc?.dc_format} />
              <MetaRow
                label="اللغة"
                value={doc?.dc_language === "ar" ? "العربية" : doc?.dc_language}
              />
              <MetaRow label="النطاق" value={doc?.dc_coverage} />
              <MetaRow label="المصدر" value={doc?.dc_source} />
              <MetaRow label="حجم الملف" value={formatSize(doc?.file_size)} />
              <MetaRow label="حقوق الملكية" value={doc?.dc_rights} />
              <MetaRow label="رقم الأرشيف" value={doc?.dc_identifier} />
              <MetaRow
                label="عدد المشاهدات"
                value={doc?.view_count?.toLocaleString("ar-EG")}
              />

              {/* Description */}
              {doc?.dc_description && (
                <div
                  className="flex flex-col gap-1 py-3 border-b"
                  style={{ borderColor: "rgba(201,196,211,0.5)" }}
                >
                  <span
                    style={{
                      color: "#797583",
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    الوصف
                  </span>
                  <p
                    style={{
                      color: "#1c1b21",
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: "13px",
                      lineHeight: "22px",
                    }}
                  >
                    {doc.dc_description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-col gap-2 py-3">
                  <span
                    style={{
                      color: "#797583",
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    الموضوعات (Subjects)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: "#f1ecf5",
                          borderColor: "rgba(201,196,211,0.5)",
                          color: "#484551",
                          fontFamily: "'Noto Sans', sans-serif",
                          fontSize: "12px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
