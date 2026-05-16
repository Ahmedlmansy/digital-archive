import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FileText,
  FileIcon,
  FolderOpen,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const META_ITEMS = [
  {
    label: "العنوان الكامل",
    value: "سياسة الأرشفة الرقمية الموحدة للجهات الحكومية",
    bold: true,
  },
  { label: "تاريخ الإصدار", value: "١٥ مارس ٢٠٢٣" },
  {
    label: "الجهة المنشئة (Creator)",
    value: "إدارة التحول الرقمي الوطنية",
    link: true,
  },
  { label: "نوع المستند", value: "لائحة تنظيمية (PDF)" },
];

const TAGS = ["أرشفة إلكترونية", "سياسات حكومية", "أمن المعلومات", "امتثال"];

const RELATED = [
  {
    icon: FileText,
    title: "الدليل الإرشادي لتصنيف البيانات",
    date: "١٠ يناير ٢٠٢٣",
    dept: "إدارة التحول الرقمي",
  },
  {
    icon: FileIcon,
    title: "لائحة ضوابط الأمن السيبراني",
    date: "٠٥ نوفمبر ٢٠٢٢",
    dept: "الهيئة الوطنية للأمن",
  },
  {
    icon: FolderOpen,
    title: "نماذج الموافقة على الإتلاف",
    date: "٢٢ أبريل ٢٠٢٣",
    dept: "قسم السجلات",
  },
];

// ── Toolbar icon button ───────────────────────────────────────────────────────
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

// ── Action button (header) ────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
export default function DocumentViewer() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 42;

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 50));
  const fitScreen = () => setZoom(100);

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

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
          padding: "0 clamp(1rem, 4vw, 4rem)",
          boxShadow: "0 1px 4px rgba(28,27,33,0.06)",
        }}
      >
        {/* Right: back + title */}
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
              fontSize: "clamp(16px, 2vw, 24px)",
              lineHeight: "32px",
            }}
          >
            سياسة الأرشفة الرقمية الموحدة للجهات الحكومية
          </h1>
        </div>

        {/* Left: actions */}
        <div className="hidden md:flex items-center gap-2">
          <ActionBtn icon={Quote} label="استشهاد" />
          <ActionBtn icon={Share2} label="مشاركة" />
          <ActionBtn icon={Printer} label="طباعة" />
          <ActionBtn icon={Download} label="تحميل PDF" primary />
        </div>
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ color: "#484551" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#ebe6ef")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* ── MAIN CANVAS ── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
        {/* Document viewer — 70% */}
        <section
          className="flex-1 lg:w-[70%] flex flex-col h-full"
          style={{ backgroundColor: "#f1ecf5" }}
        >
          {/* Viewer toolbar */}
          <div
            className="h-12 border-b flex items-center justify-between px-6 z-10 flex-shrink-0"
            style={{
              backgroundColor: "#fdf8ff",
              borderColor: "#c9c4d3",
              boxShadow: "0 2px 4px rgba(28,27,33,0.03)",
            }}
          >
            {/* Page nav */}
            <div className="flex items-center gap-1">
              <IconBtn onClick={prevPage} disabled={currentPage === 1}>
                <ChevronRight className="w-4 h-4" />
              </IconBtn>
              <div
                className="flex items-center gap-1.5"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "14px",
                }}
              >
                <input
                  aria-label="رقم الصفحة"
                  type="text"
                  value={currentPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (v >= 1 && v <= totalPages) setCurrentPage(v);
                  }}
                  className="w-10 text-center border rounded py-1 focus:outline-none focus:ring-1 focus:ring-[#352481] focus:border-[#352481]"
                  style={{
                    borderColor: "#c9c4d3",
                    backgroundColor: "#fdf8ff",
                    color: "#1c1b21",
                    fontSize: "14px",
                  }}
                />
                <span style={{ color: "#797583" }}>من</span>
                <span style={{ color: "#1c1b21" }}>{totalPages}</span>
              </div>
              <IconBtn onClick={nextPage} disabled={currentPage === totalPages}>
                <ChevronLeft className="w-4 h-4" />
              </IconBtn>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <IconBtn onClick={zoomOut} disabled={zoom <= 50}>
                <Minus className="w-4 h-4" />
              </IconBtn>
              <span
                className="min-w-[52px] text-center text-sm font-medium"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                {zoom}%
              </span>
              <IconBtn onClick={zoomIn} disabled={zoom >= 200}>
                <Plus className="w-4 h-4" />
              </IconBtn>
              <div
                className="w-px h-4 mx-1"
                style={{ backgroundColor: "#c9c4d3" }}
              />
              <IconBtn onClick={fitScreen} title="ملاءمة العرض">
                <Maximize2 className="w-4 h-4" />
              </IconBtn>
            </div>
          </div>

          {/* PDF canvas */}
          <div className="flex-1 overflow-auto p-4 lg:p-6 flex justify-center">
            <article
              className="w-full max-w-4xl min-h-[1056px] rounded-lg flex flex-col"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(201,196,211,0.4)",
                boxShadow: "0 4px 8px rgba(28,27,33,0.05)",
                padding: "clamp(24px, 5vw, 64px)",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              {/* Doc header */}
              <div
                className="w-full border-b pb-4 mb-8 flex justify-between items-start"
                style={{ borderColor: "#c9c4d3" }}
              >
                <div
                  className="w-16 h-16 rounded"
                  style={{ backgroundColor: "#e5e1e9" }}
                />
                <div
                  className="text-left"
                  style={{
                    color: "#797583",
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  وثيقة رقم: DOC-2023-001
                  <br />
                  الإصدار: 2.0
                </div>
              </div>

              <h2
                className="font-semibold text-center mt-8 mb-10"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "clamp(20px, 3vw, 32px)",
                  lineHeight: "1.3",
                }}
              >
                سياسة الأرشفة الرقمية الموحدة
              </h2>

              {/* Skeleton content lines */}
              <div className="flex flex-col gap-4 mt-8">
                {[100, 91, 100, 80, 100].map((w, i) => (
                  <div
                    key={i}
                    className="h-5 rounded"
                    style={{ width: `${w}%`, backgroundColor: "#e5e1e9" }}
                  />
                ))}
                <div className="pt-6 flex flex-col gap-4">
                  {[75, 100, 83].map((w, i) => (
                    <div
                      key={i}
                      className="h-5 rounded"
                      style={{ width: `${w}%`, backgroundColor: "#e5e1e9" }}
                    />
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Sidebar — 30% */}
        <aside
          className="w-full lg:w-[30%] border-r flex flex-col overflow-y-auto z-20"
          style={{
            backgroundColor: "#fdf8ff",
            borderColor: "#ebe6ef",
            boxShadow: "-4px 0 12px rgba(28,27,33,0.03)",
          }}
        >
          <div className="p-5 flex flex-col gap-6">
            {/* AI Summary */}
            <section
              className="rounded-b-lg p-4 border"
              style={{
                backgroundColor: "rgba(81,44,0,0.03)",
                borderTop: "4px solid #BA7517",
                borderColor: "rgba(201,196,211,0.35)",
                boxShadow: "0 1px 4px rgba(28,27,33,0.04)",
              }}
            >
              <header
                className="flex items-center gap-2 mb-3"
                style={{ color: "#714000" }}
              >
                <Sparkles className="w-5 h-5" />
                <h3
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
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
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                يتناول هذا المستند السياسات والإجراءات القياسية المتعلقة
                بالأرشفة الرقمية للوثائق الحكومية. يركز على تحديد معايير الحفظ
                طويل الأمد، تصنيف البيانات وفق مستويات السرية، وآليات الوصول
                الآمن للمعلومات لضمان الامتثال للوائح الوطنية.
              </p>
            </section>

            {/* Document metadata */}
            <section>
              <h3
                className="font-semibold mb-4"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "20px",
                  lineHeight: "28px",
                }}
              >
                معلومات المستند
              </h3>

              <div
                className="flex flex-col border-t"
                style={{ borderColor: "#c9c4d3" }}
              >
                {META_ITEMS.map((item) => (
                  <div
                    key={item.label}
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
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: item.link ? "#352481" : "#1c1b21",
                        fontFamily: "'Noto Sans', sans-serif",
                        fontSize: "16px",
                        fontWeight: item.bold ? 500 : 400,
                        cursor: item.link ? "pointer" : "default",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (item.link)
                          e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        if (item.link)
                          e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}

                {/* Tags */}
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
                    {TAGS.map((tag) => (
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
              </div>
            </section>

            {/* Related documents */}
            <section>
              <h3
                className="font-semibold mb-4"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "20px",
                  lineHeight: "28px",
                }}
              >
                مستندات ذات صلة
              </h3>

              <div className="flex flex-col gap-3">
                {RELATED.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <a
                      key={doc.title}
                      href="#"
                      className="group flex gap-3 p-3 rounded-lg border transition-all"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "rgba(201,196,211,0.4)",
                        boxShadow: "0 1px 3px rgba(28,27,33,0.04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f7f2fb";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(28,27,33,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(28,27,33,0.04)";
                      }}
                    >
                      <div
                        className="w-12 h-16 flex-shrink-0 rounded flex items-center justify-center border transition-colors"
                        style={{
                          backgroundColor: "#ebe6ef",
                          borderColor: "rgba(201,196,211,0.5)",
                          color: "#797583",
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden gap-1">
                        <span
                          className="truncate font-medium transition-colors"
                          style={{
                            color: "#1c1b21",
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: "14px",
                          }}
                        >
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              color: "#797583",
                              fontSize: "12px",
                              fontFamily: "'Noto Sans', sans-serif",
                            }}
                          >
                            {doc.date}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: "#c9c4d3" }}
                          />
                          <span
                            className="truncate"
                            style={{
                              color: "#797583",
                              fontSize: "12px",
                              fontFamily: "'Noto Sans', sans-serif",
                            }}
                          >
                            {doc.dept}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              <button
                className="mt-3 w-full py-2 text-center text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: "#352481",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(53,36,129,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                عرض المزيد من النتائج
              </button>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}
