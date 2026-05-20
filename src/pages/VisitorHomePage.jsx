import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadDocuments,
  loadCategories,
  searchDocuments,
  applyFilter,
  setSearchQuery,
} from "@/features/documents/DocumentSlices";

// ── Category icon map ──────────────────────────────────────────
const CATEGORY_ICONS = {
  administrative: { icon: "account_balance",    color: "#352481", bg: "#EDE9FF" },
  legal:          { icon: "gavel",               color: "#086b53", bg: "#E8F5F1" },
  historical:     { icon: "history_edu",         color: "#512c00", bg: "#FFF3E0" },
  scientific:     { icon: "science",             color: "#352481", bg: "#EDE9FF" },
  correspondence: { icon: "mail",                color: "#086b53", bg: "#E8F5F1" },
  financial:      { icon: "bar_chart",           color: "#BA7517", bg: "#FFF8E7" },
};

const DEFAULT_ICON = { icon: "folder", color: "#484551", bg: "#F1ECF5" };

// ── Status badge ───────────────────────────────────────────────
const STATUS_MAP = {
  active:   { label: "نشط",         color: "#086b53", bg: "#E8F5F1",  icon: "check_circle" },
  archived: { label: "مؤرشف",       color: "#352481", bg: "#EDE9FF",  icon: "inventory_2" },
  draft:    { label: "مسودة",        color: "#BA7517", bg: "#FFF8E7",  icon: "pending"      },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ═══════════════════════════════════════════════════════════════
export default function VisitorHomePage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const {
    documents,
    listStatus,
    totalCount,
    categories,
    categoriesStatus,
    filters,
  } = useSelector((s) => s.documents);

  const [localQuery, setLocalQuery] = useState(filters.query || "");

  // ── Load on mount ─────────────────────────────────────────
  useEffect(() => {
    if (categoriesStatus === "idle") dispatch(loadCategories());
    dispatch(loadDocuments());
  }, [dispatch, categoriesStatus]);

  // ── Search handler ────────────────────────────────────────
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = localQuery.trim();
      dispatch(setSearchQuery(q));
      if (q) {
        dispatch(searchDocuments(q));
      } else {
        dispatch(loadDocuments());
      }
    },
    [dispatch, localQuery],
  );

  // ── Category filter ───────────────────────────────────────
  const handleCategoryClick = (cat) => {
    navigate(`/app/documents?category=${cat.id}`);
  };

  // ── View document ─────────────────────────────────────────
  const handleViewDoc = (id) => navigate(`/app/documents/${id}`);

  // ── Recent docs (latest 5) ────────────────────────────────
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{ backgroundColor: "#fdf8ff", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #352481 0%, #4c3d99 60%, #086b53 100%)",
          minHeight: "420px",
        }}
      >
        {/* decorative circles */}
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 500, height: 500, background: "#fff", top: -200, left: -100 }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 300, height: 300, background: "#BA7517", bottom: -100, right: 60 }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
          {/* label */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <span className="material-symbols-outlined text-sm" style={{ color: "#BA7517" }}>
              auto_awesome
            </span>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
              بوابة الباحثين — الأرشيف الرقمي
            </span>
          </div>

          <h1
            className="font-bold mb-4 leading-tight"
            style={{ fontSize: 42, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            اكتشف تراثنا الوثائقي
          </h1>
          <p className="mb-10 max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            أرشيف رقمي متكامل يضم آلاف الوثائق، المخطوطات، والمراسيم مفهرسة بأعلى معايير الجودة.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div
              className="flex-1 flex items-center gap-3 px-5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#797583" }}>search</span>
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="ابحث بالكلمات المفتاحية، رقم الوثيقة، أو التاريخ..."
                className="flex-1 border-none outline-none bg-transparent py-4"
                style={{ fontSize: 15, color: "#1c1b21", direction: "rtl" }}
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => { setLocalQuery(""); dispatch(loadDocuments()); }}
                  className="material-symbols-outlined"
                  style={{ color: "#797583", cursor: "pointer", background: "none", border: "none" }}
                >
                  close
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-xl font-semibold transition-all"
              style={{
                background: "#BA7517",
                color: "#fff",
                fontSize: 15,
                fontFamily: "'IBM Plex Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(186,117,23,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9a6010")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#BA7517")}
            >
              بحث
            </button>
          </form>

          {/* Stats */}
          {totalCount > 0 && (
            <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span className="font-bold" style={{ color: "#BA7517" }}>{totalCount.toLocaleString("ar-EG")}</span>
              {" "}وثيقة متاحة في الأرشيف
            </p>
          )}
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* ── CATEGORIES ──────────────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-bold"
              style={{ fontSize: 22, color: "#1c1b21", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              تصفح حسب التصنيف
            </h2>
            <button
              onClick={() => navigate("/app/documents")}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: "#352481" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#086b53")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#352481")}
            >
              عرض الكل
              <span className="material-symbols-outlined text-base">arrow_back</span>
            </button>
          </div>

          {categoriesStatus === "loading" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "#e5e1e9" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const cfg = CATEGORY_ICONS[cat.name] || DEFAULT_ICON;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="group text-right p-5 rounded-xl transition-all duration-200"
                    style={{
                      background: "#fff",
                      border: `1.5px solid #e5e1e9`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cfg.color;
                      e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.10)`;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e5e1e9";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: cfg.bg }}
                    >
                      <span className="material-symbols-outlined text-xl" style={{ color: cfg.color }}>
                        {cfg.icon}
                      </span>
                    </div>
                    <div className="font-semibold text-sm mb-1" style={{ color: "#1c1b21" }}>
                      {cat.name_ar || cat.name}
                    </div>
                    {cat.description && (
                      <div className="text-xs leading-relaxed" style={{ color: "#797583" }}>
                        {cat.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ── RECENT DOCUMENTS ────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-bold"
              style={{ fontSize: 22, color: "#1c1b21", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {filters.query
                ? `نتائج البحث عن "${filters.query}"`
                : "أحدث الوثائق المضافة"}
            </h2>
            <button
              onClick={() => navigate("/app/documents")}
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: "#352481" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#086b53")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#352481")}
            >
              عرض الكل
              <span className="material-symbols-outlined text-base">arrow_back</span>
            </button>
          </div>

          {/* Table card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#fff",
              border: "1.5px solid #e5e1e9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {listStatus === "loading" ? (
              <div className="p-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 mb-4">
                    <div className="h-4 rounded animate-pulse flex-1" style={{ background: "#e5e1e9" }} />
                    <div className="h-4 rounded animate-pulse w-24" style={{ background: "#e5e1e9" }} />
                    <div className="h-4 rounded animate-pulse w-20" style={{ background: "#e5e1e9" }} />
                  </div>
                ))}
              </div>
            ) : listStatus === "failed" ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: "#c9c4d3" }}>
                  error_outline
                </span>
                <p style={{ color: "#797583" }}>حدث خطأ أثناء تحميل الوثائق</p>
              </div>
            ) : recentDocs.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: "#c9c4d3" }}>
                  find_in_page
                </span>
                <p style={{ color: "#797583" }}>لا توجد وثائق مطابقة</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-right" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f7f2fb", borderBottom: "1.5px solid #e5e1e9" }}>
                        {["رقم الوثيقة", "العنوان", "التصنيف", "تاريخ الوثيقة", "الحالة", ""].map((h, i) => (
                          <th
                            key={i}
                            className="py-3 px-5 text-right font-semibold text-sm"
                            style={{ color: "#484551", fontFamily: "'IBM Plex Sans', sans-serif" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocs.map((doc, idx) => {
                        const status = STATUS_MAP[doc.status] || STATUS_MAP.active;
                        const catLabel = doc.categories?.name_ar || doc.categories?.name || "—";
                        return (
                          <tr
                            key={doc.id}
                            className="transition-colors cursor-pointer"
                            style={{
                              borderBottom: idx < recentDocs.length - 1 ? "1px solid #f1ecf5" : "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f2fb")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            onClick={() => handleViewDoc(doc.id)}
                          >
                            <td className="py-4 px-5">
                              <span
                                className="text-xs font-mono px-2 py-1 rounded"
                                style={{ background: "#f1ecf5", color: "#484551" }}
                              >
                                {doc.dc_identifier || doc.id.slice(0, 8).toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="font-medium text-sm" style={{ color: "#1c1b21" }}>
                                {doc.dc_title}
                              </span>
                              {doc.dc_creator && (
                                <div className="text-xs mt-0.5" style={{ color: "#797583" }}>
                                  {doc.dc_creator}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-5">
                              <span
                                className="text-xs px-3 py-1 rounded-full"
                                style={{ background: "#f1ecf5", color: "#484551" }}
                              >
                                {catLabel}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-sm" style={{ color: "#797583" }}>
                              {formatDate(doc.dc_date)}
                            </td>
                            <td className="py-4 px-5">
                              <div
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                                style={{ background: status.bg, color: status.color }}
                              >
                                <span className="material-symbols-outlined text-xs">{status.icon}</span>
                                {status.label}
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleViewDoc(doc.id); }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                style={{ color: "#c9c4d3" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#EDE9FF";
                                  e.currentTarget.style.color = "#352481";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "#c9c4d3";
                                }}
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div
                  className="px-5 py-4 text-center border-t"
                  style={{ borderColor: "#f1ecf5", background: "#fdf8ff" }}
                >
                  <button
                    onClick={() => navigate("/app/documents")}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "#352481" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#086b53")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#352481")}
                  >
                    عرض جميع الوثائق ({totalCount.toLocaleString("ar-EG")})
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
