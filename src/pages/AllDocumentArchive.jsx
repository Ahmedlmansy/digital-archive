import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Archive,
  Plus,
  Search,
  Filter,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  FolderArchive,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  loadDocuments,
  searchDocuments,
  changePage,
  applyFilter,
  loadCategories,
  removeDocument,
  clearFilters,
  setSearchQuery,
} from "@/features/documents/DocumentSlices";

// ── Icon mapping ─────────────────────────────────────────────
const typeIcons = {
  pdf: <FileText className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  article: <FileText className="w-5 h-5" />,
  archive: <FolderArchive className="w-5 h-5" />,
};

const statusConfig = {
  active: { label: "قيد المراجعة", variant: "destructive" },
  archived: { label: "مؤرشف", variant: "secondary" },
  draft: { label: "مسودة", variant: "outline" },
};

const statusColors = {
  active: "bg-error",
  archived: "bg-secondary",
  draft: "bg-outline",
};

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const {
    documents,
    listStatus,
    listError,
    totalCount,
    currentPage,
    totalPages,
    itemsPerPage,
    filters,
    categories,
    deleteStatus,
  } = useSelector((state) => state.documents);

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ── Load on mount ──────────────────────────────────────────
  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadDocuments());
  }, [dispatch]);

  // ── Debounced search ───────────────────────────────────────
  const handleSearch = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchInput(val);
      dispatch(setSearchQuery(val));

      // Debounce 400ms
      const timer = setTimeout(() => {
        if (val.trim()) {
          dispatch(searchDocuments(val.trim()));
        } else {
          dispatch(loadDocuments());
        }
      }, 400);

      return () => clearTimeout(timer);
    },
    [dispatch],
  );

  // ── Pagination ───────────────────────────────────────────────
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(changePage(page));
  };

  // ── Filter handlers ────────────────────────────────────────
  const handleStatusFilter = (status) => {
    dispatch(
      applyFilter({ status: filters.status === status ? null : status }),
    );
  };

  const handleCategoryFilter = (catId) => {
    dispatch(
      applyFilter({ categoryId: filters.categoryId === catId ? null : catId }),
    );
  };

  const handleClearFilters = () => {
    setSearchInput("");
    dispatch(clearFilters());
    dispatch(loadDocuments());
  };

  // ── Delete handler ─────────────────────────────────────────
  const handleDelete = (doc) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${doc.dc_title}"؟`)) return;
    dispatch(removeDocument({ docId: doc.id, filePath: doc.file_path }));
  };

  // ── Helper: format date ────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ── Helper: get file type from format ──────────────────────
  const getFileType = (format) => {
    if (!format) return "article";
    const ext = format.toLowerCase();
    if (ext.includes("pdf")) return "pdf";
    if (ext.includes("image") || ext.includes("jpg") || ext.includes("png"))
      return "image";
    if (ext.includes("zip") || ext.includes("rar")) return "archive";
    return "article";
  };

  // ── Helper: check if AI generated ──────────────────────────
  const isAiGenerated = (doc) => {
    return !!(doc.ai_summary || (doc.ai_tags && doc.ai_tags.length > 0));
  };

  return (
    <main
      dir="rtl"
      className="flex-1 pt-16 w-full max-w-[1440px] mx-auto px-4 md:px-16"
      style={{ backgroundColor: "#fdf8ff", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2
            className="font-semibold mb-1"
            style={{
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "32px",
              lineHeight: "40px",
              color: "#352481",
            }}
          >
            عرض المستندات
          </h2>
          <p
            className="flex items-center gap-2"
            style={{
              fontFamily: "notoSans, sans-serif",
              fontSize: "18px",
              lineHeight: "28px",
              color: "#484551",
            }}
          >
            <Archive className="w-5 h-5 text-[#086b53]" />
            إجمالي المستندات المؤرشفة:{" "}
            <strong
              className="font-medium"
              style={{
                fontFamily: "ibmPlexSans, sans-serif",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#1c1b21",
              }}
            >
              {totalCount.toLocaleString("ar-SA")}
            </strong>{" "}
            وثيقة
          </p>
        </div>
        <Button
          className="flex items-center gap-2 px-6 py-3 h-auto rounded-lg self-start md:self-auto shadow-sm transition-colors hover:opacity-90"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "ibmPlexSans, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
          }}
        >
          <Plus className="w-5 h-5" />
          رفع وثيقة جديدة
        </Button>
      </div>

      {/* Search & Filters Bar */}
      <div
        className="border rounded-xl p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between"
        style={{ backgroundColor: "#ffffff", borderColor: "#c9c4d3" }}
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "#797583" }}
          />
          <Input
            value={searchInput}
            onChange={handleSearch}
            placeholder="البحث برقم الوثيقة أو العنوان أو الوصف..."
            className="w-full py-2 pr-10 pl-4 rounded-lg border outline-none transition-all text-right h-auto"
            style={{
              backgroundColor: "#fdf8ff",
              borderColor: "#c9c4d3",
              color: "#1c1b21",
              fontFamily: "notoSans, sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
            }}
          />
          {listStatus === "loading" && (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 h-auto rounded-lg transition-colors border"
            style={{
              borderColor: "#c9c4d3",
              backgroundColor: showFilters ? "#f1ecf5" : "#fdf8ff",
              color: "#1c1b21",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Filter className="w-[18px] h-[18px]" />
            الفلاتر
            {(filters.status || filters.categoryId) && (
              <span
                className="w-2 h-2 rounded-full bg-primary"
                title="يوجد فلاتر نشطة"
              />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 h-auto rounded-lg transition-colors border"
            style={{
              borderColor: "#c9c4d3",
              backgroundColor: "#fdf8ff",
              color: "#352481",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <X className="w-[18px] h-[18px]" />
            مسح
          </Button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div
          className="border rounded-xl p-4 mb-6 shadow-sm"
          style={{ backgroundColor: "#ffffff", borderColor: "#c9c4d3" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                className="block mb-2 font-medium"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  color: "#484551",
                }}
              >
                الحالة
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "active", label: "قيد المراجعة" },
                  { key: "archived", label: "مؤرشف" },
                  { key: "draft", label: "مسودة" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleStatusFilter(s.key)}
                    className="px-3 py-1 rounded-full border text-sm transition-colors"
                    style={{
                      borderColor:
                        filters.status === s.key ? "#352481" : "#c9c4d3",
                      backgroundColor:
                        filters.status === s.key ? "#e5deff" : "#fdf8ff",
                      color: filters.status === s.key ? "#352481" : "#484551",
                      fontFamily: "notoSans, sans-serif",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label
                className="block mb-2 font-medium"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  color: "#484551",
                }}
              >
                التصنيف
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryFilter(cat.id)}
                    className="px-3 py-1 rounded-full border text-sm transition-colors"
                    style={{
                      borderColor:
                        filters.categoryId === cat.id ? "#352481" : "#c9c4d3",
                      backgroundColor:
                        filters.categoryId === cat.id ? "#e5deff" : "#fdf8ff",
                      color:
                        filters.categoryId === cat.id ? "#352481" : "#484551",
                      fontFamily: "notoSans, sans-serif",
                    }}
                  >
                    {cat.name_ar || cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label
                className="block mb-2 font-medium"
                style={{
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  color: "#484551",
                }}
              >
                نطاق التاريخ
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  placeholder="من"
                  className="w-full rounded-lg border text-right h-auto"
                  style={{ borderColor: "#c9c4d3", fontSize: "14px" }}
                  onChange={(e) =>
                    dispatch(applyFilter({ dateFrom: e.target.value || null }))
                  }
                />
                <span className="text-outline">إلى</span>
                <Input
                  type="date"
                  placeholder="إلى"
                  className="w-full rounded-lg border text-right h-auto"
                  style={{ borderColor: "#c9c4d3", fontSize: "14px" }}
                  onChange={(e) =>
                    dispatch(applyFilter({ dateTo: e.target.value || null }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {(filters.query || filters.status || filters.categoryId) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span
            className="shrink-0"
            style={{
              fontFamily: "notoSans, sans-serif",
              fontSize: "12px",
              lineHeight: "16px",
              color: "#484551",
            }}
          >
            عوامل التصفية النشطة:
          </span>

          {filters.query && (
            <div
              className="flex items-center gap-1 border rounded-full px-2 py-1"
              style={{
                backgroundColor: "#f1ecf5",
                borderColor: "#c9c4d3",
                fontFamily: "notoSans, sans-serif",
                fontSize: "12px",
                color: "#1c1b21",
              }}
            >
              <span>بحث: {filters.query}</span>
              <button
                onClick={() => {
                  setSearchInput("");
                  dispatch(setSearchQuery(""));
                  dispatch(loadDocuments());
                }}
                className="hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {filters.status && (
            <div
              className="flex items-center gap-1 border rounded-full px-2 py-1"
              style={{
                backgroundColor: "#f1ecf5",
                borderColor: "#c9c4d3",
                fontFamily: "notoSans, sans-serif",
                fontSize: "12px",
                color: "#1c1b21",
              }}
            >
              <span>
                الحالة: {statusConfig[filters.status]?.label || filters.status}
              </span>
              <button
                onClick={() => handleStatusFilter(filters.status)}
                className="hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {filters.categoryId && (
            <div
              className="flex items-center gap-1 border rounded-full px-2 py-1"
              style={{
                backgroundColor: "#f1ecf5",
                borderColor: "#c9c4d3",
                fontFamily: "notoSans, sans-serif",
                fontSize: "12px",
                color: "#1c1b21",
              }}
            >
              <span>
                التصنيف:{" "}
                {categories.find((c) => c.id === filters.categoryId)?.name_ar ||
                  "—"}
              </span>
              <button
                onClick={() => handleCategoryFilter(filters.categoryId)}
                className="hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleClearFilters}
            className="mr-2 underline text-sm transition-colors"
            style={{
              color: "#352481",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* Error State */}
      {listStatus === "failed" && (
        <div
          className="border rounded-xl p-6 mb-6 text-center"
          style={{ backgroundColor: "#ffdad6", borderColor: "#ba1a1a" }}
        >
          <p className="text-error font-medium mb-2">
            حدث خطأ أثناء تحميل البيانات
          </p>
          <p className="text-sm text-on-surface-variant mb-4">{listError}</p>
          <Button
            onClick={() => dispatch(loadDocuments())}
            variant="outline"
            className="border-error text-error hover:bg-error-container"
          >
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* Data Table */}
      <div
        className="rounded-xl overflow-hidden flex flex-col border"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#c9c4d3",
          boxShadow: "0 4px 12px rgba(44,44,42,0.05)",
        }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow
                className="border-b hover:bg-transparent"
                style={{
                  backgroundColor: "#F8F7F4",
                  borderColor: "#c9c4d3",
                }}
              >
                <TableHead
                  className="p-4 text-right font-semibold min-w-[280px]"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  اسم المستند / الوصف
                </TableHead>
                <TableHead
                  className="p-4 text-right font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  رقم المعرف (ID)
                </TableHead>
                <TableHead
                  className="p-4 text-right font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  التصنيف
                </TableHead>
                <TableHead
                  className="p-4 text-right font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  تاريخ الوثيقة
                </TableHead>
                <TableHead
                  className="p-4 text-right font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  الحالة
                </TableHead>
                <TableHead
                  className="p-4 text-center w-28 font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#484551",
                  }}
                >
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y" style={{ borderColor: "#c9c4d3" }}>
              {listStatus === "loading" && documents.length === 0 ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-surface-container-high animate-pulse" />
                        <div className="space-y-2">
                          <div className="w-48 h-4 bg-surface-container-high rounded animate-pulse" />
                          <div className="w-32 h-3 bg-surface-container-high rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-24 h-4 bg-surface-container-high rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-20 h-4 bg-surface-container-high rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-24 h-4 bg-surface-container-high rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-16 h-6 bg-surface-container-high rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex gap-2 justify-center">
                        <div className="w-5 h-5 bg-surface-container-high rounded animate-pulse" />
                        <div className="w-5 h-5 bg-surface-container-high rounded animate-pulse" />
                        <div className="w-5 h-5 bg-surface-container-high rounded animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-12 text-center"
                    style={{ color: "#484551" }}
                  >
                    <Archive className="w-12 h-12 mx-auto mb-3 text-outline" />
                    <p
                      className="font-medium"
                      style={{
                        fontFamily: "ibmPlexSans, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      لا توجد وثائق
                    </p>
                    <p className="text-sm mt-1">
                      جرب تعديل عوامل البحث أو الفلترة
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
                  const config = statusConfig[doc.status] || statusConfig.draft;
                  const fType = getFileType(doc.dc_format);
                  const ai = isAiGenerated(doc);

                  return (
                    <TableRow
                      key={doc.id}
                      className="transition-colors group"
                      style={{ borderColor: "#c9c4d3" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#F1F0ED")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <TableCell className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 relative"
                            style={{
                              backgroundColor: ai
                                ? "rgba(81, 44, 0, 0.1)"
                                : fType === "pdf" || fType === "archive"
                                  ? "rgba(8, 107, 83, 0.2)"
                                  : "#ebe6ef",
                              color: ai ? "#512c00" : "#086b53",
                            }}
                          >
                            {typeIcons[fType]}
                            {ai && (
                              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full text-tertiary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="mb-1 transition-colors group-hover:text-[#352481] truncate"
                              style={{
                                fontFamily: "ibmPlexSans, sans-serif",
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "24px",
                                color: "#1c1b21",
                              }}
                            >
                              {doc.dc_title}
                            </p>
                            <p
                              className="truncate max-w-[300px] md:max-w-[400px]"
                              style={{
                                fontFamily: "notoSans, sans-serif",
                                fontSize: "12px",
                                lineHeight: "16px",
                                color: ai ? "#512c00" : "#484551",
                              }}
                            >
                              {doc.ai_summary ||
                                doc.dc_description ||
                                "لا يوجد وصف"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        className="p-4 font-mono text-sm"
                        dir="ltr"
                        style={{ color: "#484551" }}
                      >
                        {doc.dc_identifier || doc.id.slice(0, 8)}
                      </TableCell>

                      <TableCell className="p-4" style={{ color: "#1c1b21" }}>
                        {doc.categories?.name_ar || doc.categories?.name || "—"}
                      </TableCell>

                      <TableCell
                        className="p-4 text-sm"
                        style={{ color: "#484551" }}
                      >
                        {formatDate(doc.dc_date)}
                      </TableCell>

                      <TableCell className="p-4">
                        <Badge
                          variant={config.variant}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border font-normal"
                          style={{
                            fontFamily: "notoSans, sans-serif",
                            fontSize: "12px",
                            lineHeight: "16px",
                          }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              statusColors[doc.status] || "bg-outline"
                            }`}
                          />
                          {config.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="p-4">
                        <div
                          className="flex items-center justify-center gap-2 transition-colors"
                          style={{ color: "#797583" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#484551")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#797583")
                          }
                        >
                          {ai && (
                            <button
                              className="hover:text-[#512c00] transition-colors"
                              title="مراجعة الملخص الذكي"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            className="hover:text-[#352481] transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            className="hover:text-[#352481] transition-colors"
                            title="تعديل"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            disabled={deleteStatus === "loading"}
                            className="hover:text-[#ba1a1a] transition-colors disabled:opacity-50"
                            title="حذف"
                          >
                            {deleteStatus === "loading" ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: "#fdf8ff",
              borderColor: "#c9c4d3",
            }}
          >
            <div
              style={{
                fontFamily: "notoSans, sans-serif",
                fontSize: "12px",
                lineHeight: "16px",
                color: "#484551",
              }}
            >
              عرض{" "}
              <span className="font-bold" style={{ color: "#1c1b21" }}>
                {((currentPage - 1) * itemsPerPage + 1).toLocaleString("ar-SA")}
              </span>{" "}
              إلى{" "}
              <span className="font-bold" style={{ color: "#1c1b21" }}>
                {Math.min(
                  currentPage * itemsPerPage,
                  totalCount,
                ).toLocaleString("ar-SA")}
              </span>{" "}
              من أصل{" "}
              <span className="font-bold" style={{ color: "#1c1b21" }}>
                {totalCount.toLocaleString("ar-SA")}
              </span>{" "}
              وثيقة
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || listStatus === "loading"}
                className="w-8 h-8 flex items-center justify-center rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-surface-container"
                style={{ borderColor: "#c9c4d3", color: "#797583" }}
              >
                <ChevronRight className="w-[18px] h-[18px]" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // منطق ذكي لعرض أرقام الصفحات حول الصفحة الحالية
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={listStatus === "loading"}
                    className="w-8 h-8 flex items-center justify-center rounded font-medium transition-colors disabled:opacity-50"
                    style={
                      currentPage === pageNum
                        ? {
                            backgroundColor: "#352481",
                            color: "#ffffff",
                            fontFamily: "ibmPlexSans, sans-serif",
                            fontSize: "14px",
                          }
                        : {
                            border: "1px solid #c9c4d3",
                            color: "#1c1b21",
                            fontFamily: "ibmPlexSans, sans-serif",
                            fontSize: "14px",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (currentPage !== pageNum) {
                        e.currentTarget.style.backgroundColor = "#f1ecf5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== pageNum) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span style={{ color: "#797583" }} className="mx-1">
                  ...
                </span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded border transition-colors hover:bg-surface-container"
                  style={{
                    borderColor: "#c9c4d3",
                    color: "#1c1b21",
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || listStatus === "loading"
                }
                className="w-8 h-8 flex items-center justify-center rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-surface-container"
                style={{ borderColor: "#c9c4d3", color: "#797583" }}
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
