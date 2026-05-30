import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Archive,
  Clock,
  AlertCircle,
  SearchX,
  Eye,
  ArrowRight,
} from "lucide-react";

// ── Status badge map ───────────────────────────────────────────
const STATUS_MAP = {
  active:   { label: "نشط",   color: "#086b53", bg: "#E8F5F1", icon: CheckCircle },
  archived: { label: "مؤرشف", color: "#352481", bg: "#EDE9FF", icon: Archive     },
  draft:    { label: "مسودة", color: "#BA7517", bg: "#FFF8E7", icon: Clock       },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function RecentDocumentsSection({
  recentDocs,
  listStatus,
  filters,
  totalCount,
}) {
  const navigate = useNavigate();

  const handleViewDoc = (id) => navigate(`/app/documents/${id}`);

  return (
    <section>
      {/* Header */}
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
          <ArrowRight size={16} />
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
        {/* Loading state */}
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
          /* Error state */
          <div className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "#c9c4d3" }} />
            <p style={{ color: "#797583" }}>حدث خطأ أثناء تحميل الوثائق</p>
          </div>

        ) : recentDocs.length === 0 ? (
          /* Empty state */
          <div className="p-12 text-center">
            <SearchX size={48} className="mx-auto mb-4" style={{ color: "#c9c4d3" }} />
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
                    const StatusIcon = status.icon;
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
                        {/* Document ID */}
                        <td className="py-4 px-5">
                          <span
                            className="text-xs font-mono px-2 py-1 rounded"
                            style={{ background: "#f1ecf5", color: "#484551" }}
                          >
                            {doc.dc_identifier || doc.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        {/* Title + Creator */}
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

                        {/* Category */}
                        <td className="py-4 px-5">
                          <span
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ background: "#f1ecf5", color: "#484551" }}
                          >
                            {catLabel}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-sm" style={{ color: "#797583" }}>
                          {formatDate(doc.dc_date)}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-5">
                          <div
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                            style={{ background: status.bg, color: status.color }}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </div>
                        </td>

                        {/* View button */}
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
                            <Eye size={18} />
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
  );
}
