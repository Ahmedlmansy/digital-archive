import {
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Helper ────────────────────────────────────────────────────
function getCategoryName(categoryId, categories = []) {
  if (!categoryId) return "غير مصنف";
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.name_ar || cat?.name || "غير مصنف";
}

function StatusBadge({ status }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#086b53" }}>
        <span className="w-2 h-2 rounded-full bg-[#086b53]" />
        مؤرشف
      </span>
    );
  if (status === "draft")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#BA7517" }}>
        <span className="w-2 h-2 rounded-full bg-[#BA7517]" />
        مسودة
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#797583" }}>
      <span className="w-2 h-2 rounded-full bg-[#797583]" />
      مؤرشفة
    </span>
  );
}

export default function ResultsTable({
  documents,
  categories,
  listStatus,
  listError,
  currentPage,
  totalPages,
  onView,
  onDelete,
  onPageChange,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden mb-8"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(201, 196, 211, 0.25)",
        boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr
              className="border-b text-xs font-medium"
              style={{
                backgroundColor: "#f7f2fb",
                borderColor: "rgba(201, 196, 211, 0.4)",
                color: "#484551",
                fontFamily: "ibmPlexSans, sans-serif",
              }}
            >
              <th className="py-4 px-6 whitespace-nowrap">رقم الوثيقة</th>
              <th className="py-4 px-6 min-w-[250px]">العنوان</th>
              <th className="py-4 px-6 whitespace-nowrap">التصنيف</th>
              <th className="py-4 px-6 whitespace-nowrap">الجهة المصدرة</th>
              <th className="py-4 px-6 whitespace-nowrap">تاريخ الوثيقة</th>
              <th className="py-4 px-6 whitespace-nowrap">الحالة</th>
              <th className="py-4 px-6 w-24 whitespace-nowrap text-center">إجراءات</th>
            </tr>
          </thead>

          <tbody className="text-sm" style={{ color: "#1c1b21", fontFamily: "notoSans, sans-serif" }}>
            {/* Loading */}
            {listStatus === "loading" && (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" style={{ color: "#352481" }} />
                  <span style={{ color: "#797583" }}>جاري تحميل الوثائق...</span>
                </td>
              </tr>
            )}

            {/* Error */}
            {listStatus === "failed" && (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-red-600">
                    <AlertCircle className="w-8 h-8 opacity-80" />
                    <p className="font-medium mt-1">حدث خطأ أثناء تحميل الوثائق</p>
                    {listError && <p className="text-xs opacity-75">{listError}</p>}
                  </div>
                </td>
              </tr>
            )}

            {/* Empty */}
            {listStatus === "succeeded" && documents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center" style={{ color: "#797583" }}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 opacity-20 mb-2" />
                    <p>لا توجد وثائق مطابقة لمعايير البحث الحالية.</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {listStatus === "succeeded" &&
              documents.map((doc) => {
                const categoryName = getCategoryName(doc.category_id, categories);
                return (
                  <tr
                    key={doc.id}
                    className="border-b transition-colors hover:bg-[#F1F0ED]"
                    style={{ borderColor: "rgba(201, 196, 211, 0.2)" }}
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-xs" style={{ color: "#797583" }}>
                      {doc.dc_identifier || doc.id}
                    </td>

                    {/* Title */}
                    <td
                      className="py-4 px-6 font-medium"
                      style={{ color: "#1c1b21", fontFamily: "notoSans, sans-serif", fontSize: "15px" }}
                    >
                      {doc.dc_title || "وثيقة بدون عنوان"}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: "#f1ecf5",
                          color: "#484551",
                          borderColor: "rgba(201, 196, 211, 0.4)",
                          fontFamily: "ibmPlexSans, sans-serif",
                        }}
                      >
                        {categoryName}
                      </span>
                    </td>

                    {/* Publisher */}
                    <td className="py-4 px-6" style={{ color: "#484551" }}>
                      {doc.dc_publisher || "—"}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6" dir="ltr" style={{ color: "#484551", textAlign: "right" }}>
                      {doc.dc_date || doc.created_at?.split("T")[0] || "—"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={doc.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView(doc.id)}
                          className="p-1.5 rounded-md bg-white border shadow-sm transition-colors hover:text-[#352481] hover:border-[#352481]/30"
                          title="عرض التفاصيل"
                          style={{ color: "#797583", borderColor: "rgba(201, 196, 211, 0.4)" }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="p-1.5 rounded-md bg-white border shadow-sm transition-colors hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                          title="حذف الوثيقة"
                          style={{ color: "#797583", borderColor: "rgba(201, 196, 211, 0.4)" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between p-4 border-t"
          style={{
            backgroundColor: "#f7f2fb",
            borderColor: "rgba(201, 196, 211, 0.35)",
          }}
        >
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 bg-white border rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{
              color: "#352481",
              fontFamily: "ibmPlexSans, sans-serif",
              borderColor: "rgba(201, 196, 211, 0.4)",
            }}
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: "#484551", fontFamily: "ibmPlexSans, sans-serif" }}
          >
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-white border rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{
              color: "#352481",
              fontFamily: "ibmPlexSans, sans-serif",
              borderColor: "rgba(201, 196, 211, 0.4)",
            }}
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
