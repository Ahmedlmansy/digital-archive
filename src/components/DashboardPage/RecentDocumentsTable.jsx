import {
  ChevronLeft,
  Eye,
  Download,
  FileText,
  ScrollText,
  Gavel,
  BookOpen,
  Mail,
  Landmark,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────
function getDocStyle(categoryName = "") {
  const c = categoryName.trim();
  if (c.includes("تاريخية") || c.includes("مخطوطة"))
    return { icon: ScrollText, color: "#714000", bgColor: "rgba(81, 44, 0, 0.1)" };
  if (c.includes("قانونية") || c.includes("قرار") || c.includes("حكومية"))
    return { icon: Gavel, color: "#086b53", bgColor: "rgba(8, 107, 83, 0.1)" };
  if (c.includes("علمية") || c.includes("بحث") || c.includes("تقرير"))
    return { icon: BookOpen, color: "#352481", bgColor: "#ebe6ef" };
  if (c.includes("مراسلات") || c.includes("خطاب") || c.includes("رسالة"))
    return { icon: Mail, color: "#484551", bgColor: "#e5e1e9" };
  if (c.includes("مالية") || c.includes("سنوي") || c.includes("إدارية"))
    return { icon: Landmark, color: "#484551", bgColor: "#e5e1e9" };
  return { icon: FileText, color: "#352481", bgColor: "#ebe6ef" };
}

function getCategoryName(categoryId, categories = []) {
  if (!categoryId) return "غير مصنف";
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.name_ar || cat?.name || "غير مصنف";
}

function getCategoryStyle(categoryName = "") {
  const c = categoryName.trim();
  if (c.includes("تاريخية") || c.includes("مخطوطة"))
    return {
      backgroundColor: "rgba(81, 44, 0, 0.1)",
      color: "#714000",
      borderColor: "rgba(113, 64, 0, 0.2)",
    };
  if (c.includes("قانونية") || c.includes("قرار") || c.includes("حكومية"))
    return {
      backgroundColor: "rgba(8, 107, 83, 0.1)",
      color: "#086b53",
      borderColor: "rgba(8, 107, 83, 0.2)",
    };
  return {
    backgroundColor: "#f1ecf5",
    color: "#484551",
    borderColor: "rgba(201, 196, 211, 0.4)",
  };
}

// ── Component ──────────────────────────────────────────────────
export default function RecentDocumentsTable({
  documents,
  categories,
  listStatus,
  listError,
  onViewAll,
  onView,
  onDownload,
}) {
  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(201, 196, 211, 0.25)",
        boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
      }}
    >
      {/* Section Header */}
      <div
        className="px-6 py-4 border-b flex justify-between items-center"
        style={{
          backgroundColor: "#f7f2fb",
          borderColor: "rgba(201, 196, 211, 0.35)",
        }}
      >
        <h2
          className="font-semibold"
          style={{
            color: "#1c1b21",
            fontFamily: "ibmPlexSans, sans-serif",
            fontSize: "24px",
            lineHeight: "32px",
          }}
        >
          أحدث الوثائق المضافة
        </h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 transition-colors text-sm font-medium hover:opacity-80"
          style={{ color: "#352481", fontFamily: "ibmPlexSans, sans-serif" }}
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr
              style={{
                backgroundColor: "#f7f2fb",
                borderBottom: "1px solid rgba(201, 196, 211, 0.4)",
              }}
            >
              {["مصغرة", "العنوان", "التصنيف", "التاريخ", "إجراءات"].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-xs font-medium"
                  style={{
                    color: "#484551",
                    width: i === 0 ? "64px" : i === 4 ? "96px" : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {listStatus === "loading" && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <Loader2
                    className="animate-spin h-8 w-8 mx-auto"
                    style={{ color: "#352481" }}
                  />
                </td>
              </tr>
            )}

            {/* Error */}
            {listStatus === "failed" && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <AlertCircle className="w-6 h-6" />
                    <p className="text-sm">حدث خطأ أثناء تحميل الوثائق</p>
                    {listError && <p className="text-xs opacity-75">{listError}</p>}
                  </div>
                </td>
              </tr>
            )}

            {/* Empty */}
            {listStatus === "succeeded" && documents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "#797583" }}
                >
                  لا توجد وثائق حالياً
                </td>
              </tr>
            )}

            {/* Data rows */}
            {listStatus === "succeeded" &&
              documents.map((doc) => {
                const categoryName = getCategoryName(doc.category_id, categories);
                const style = getDocStyle(categoryName);
                const Icon = style.icon;

                return (
                  <tr
                    key={doc.id}
                    className="transition-colors group hover:bg-[#F1F0ED]"
                    style={{
                      backgroundColor: "transparent",
                      borderBottom: "1px solid rgba(201, 196, 211, 0.2)",
                    }}
                  >
                    {/* Icon */}
                    <td className="px-4 py-3">
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center"
                        style={{ backgroundColor: style.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: style.color }} />
                      </div>
                    </td>

                    {/* Title + ID */}
                    <td className="px-4 py-3">
                      <p
                        className="font-medium"
                        style={{
                          color: "#1c1b21",
                          fontFamily: "notoSans, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {doc.dc_title || "وثيقة بدون عنوان"}
                      </p>
                      <p
                        className="mt-0.5 text-xs"
                        style={{ color: "#797583", fontFamily: "notoSans, sans-serif" }}
                      >
                        {doc.dc_identifier || doc.id}
                      </p>
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          ...getCategoryStyle(categoryName),
                          fontFamily: "ibmPlexSans, sans-serif",
                        }}
                      >
                        {categoryName}
                      </span>
                    </td>

                    {/* Date */}
                    <td
                      className="px-4 py-3 text-sm"
                      dir="ltr"
                      style={{
                        color: "#484551",
                        fontFamily: "notoSans, sans-serif",
                        textAlign: "right",
                      }}
                    >
                      {doc.dc_date || doc.created_at?.split("T")[0] || "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(doc.id)}
                          className="p-1.5 rounded transition-colors hover:text-[#352481]"
                          title="عرض"
                          style={{ color: "#797583" }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDownload(doc)}
                          className="p-1.5 rounded transition-colors hover:text-[#352481]"
                          title="تحميل"
                          style={{ color: "#797583" }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
