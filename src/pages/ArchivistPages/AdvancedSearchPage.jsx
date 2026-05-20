import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  History,
  Bookmark,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  loadDocuments,
  searchDocuments,
  applyFilter,
  loadCategories,
  clearFilters,
  changePage, // تم إضافة الناقص
  removeDocument, // تم إضافة دالة الحذف المفترضة
} from "@/features/documents/DocumentSlices";

// ── Helpers ───────────────────────────────────────────────────
function getCategoryName(categoryId, categories = []) {
  if (!categoryId) return "غير مصنف";
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.name_ar || cat?.name || "غير مصنف";
}

export default function AdvancedSearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    documents = [],
    totalCount,
    listStatus,
    listError,
    currentPage,
    totalPages,
    filters = {}, // تم إضافة قيمة افتراضية لتجنب أخطاء الـ Undefined
    categories = [],
  } = useSelector((state) => state.documents);

  // ── Local State ─────────────────────────────────────────────
  const [query, setQuery] = useState(filters.query || "");
  const [categoryId, setCategoryId] = useState(filters.categoryId || "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [publisher, setPublisher] = useState("");
  const [showFilters, setShowFilters] = useState(true); // تم تفعيل استخدامها

  // ── Load Categories & Initial Data ──────────────────────────
  useEffect(() => {
    dispatch(loadCategories());
    // قراءة المعاملات من الرابط عند تحميل الصفحة
    const urlQuery = searchParams.get("query");
    const urlCategory = searchParams.get("categoryId");

    if (urlQuery) {
      setQuery(urlQuery);
      dispatch(searchDocuments(urlQuery));
    } else if (urlCategory) {
      setCategoryId(urlCategory);
      dispatch(applyFilter({ categoryId: Number(urlCategory) }));
    } else {
      dispatch(loadDocuments());
    }
  }, [dispatch, searchParams]);

  // ── Sync filters from Redux ─────────────────────────────────
  useEffect(() => {
    setQuery(filters.query || "");
    setCategoryId(filters.categoryId || "");
    setDateFrom(filters.dateFrom || "");
    setDateTo(filters.dateTo || "");
  }, [filters]);

  // ── Handlers ────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setSearchParams({ query: query.trim() }); // تحديث الرابط
      dispatch(searchDocuments(query.trim()));
    } else {
      setSearchParams({});
      dispatch(loadDocuments());
    }
  }, [dispatch, query, setSearchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleApplyFilters = () => {
    const filterUpdate = {};
    if (categoryId) filterUpdate.categoryId = Number(categoryId);
    if (dateFrom) filterUpdate.dateFrom = dateFrom;
    if (dateTo) filterUpdate.dateTo = dateTo;
    if (publisher) filterUpdate.query = publisher; // بحث نصي مؤقت للجهة المصدرة

    // تحديث الرابط ليعكس الفلاتر (اختياري، هنا نحدث الفئة كمثال)
    if (categoryId) setSearchParams({ categoryId });

    dispatch(applyFilter(filterUpdate));
  };

  const handleClearFilters = () => {
    setCategoryId("");
    setDateFrom("");
    setDateTo("");
    setPublisher("");
    setQuery("");
    setSearchParams({}); // مسح الرابط
    dispatch(clearFilters());
    dispatch(loadDocuments());
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(changePage(page));
    }
  };

  const handleViewDocument = (docId) => {
    navigate(`/app/documents/${docId}`);
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الوثيقة؟")) {
      dispatch(removeDocument(docId));
    }
  };

  // ── Mock Recent Searches ────────────────────────────────────
  const recentSearches = [
    {
      query: "مراسيم تنظيم التجارة ١٣٤٥هـ",
      type: "مراسيم ملكية",
      time: "منذ ساعتين",
    },
    { query: "مخطوطات مكتبة الحرم", type: "مخطوطات", time: "منذ يومين" },
    {
      query: "تقارير التعداد السكاني المبكر",
      type: "تقارير إدارية",
      time: "منذ ٤ أيام",
    },
  ];

  const savedSearches = [
    { name: "وثائق العهد العثماني", tags: ["مخطوطات", "قبل ١٣٥٠هـ"] },
    { name: "مراسيم التأسيس", tags: ["مراسيم ملكية", "الديوان الملكي"] },
  ];

  return (
    <main
      dir="rtl"
      className="flex-1 bg-[#F8F7F4] overflow-y-auto min-h-screen p-4 md:p-8"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* ═══════════════════ Page Header ═══════════════════ */}
        <div className="mb-8">
          <h1
            className="font-semibold mb-2"
            style={{
              color: "#1c1b21",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "32px",
              lineHeight: "40px",
            }}
          >
            البحث المتقدم
          </h1>
          <p
            className="max-w-3xl"
            style={{
              color: "#484551",
              fontFamily: "notoSans, sans-serif",
              fontSize: "18px",
              lineHeight: "28px",
            }}
          >
            ابحث في السجلات الأرشيفية، المراسيم، والمخطوطات باستخدام فلاتر دقيقة
            للوصول السريع إلى الوثائق المطلوبة.
          </p>
        </div>

        {/* ═══════════════════ Search Area ═══════════════════ */}
        <div
          className="rounded-xl border p-6 mb-8 relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(201, 196, 211, 0.25)",
            boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 right-0 w-full h-1"
            style={{
              background: "linear-gradient(to left, #352481, #086b53)",
            }}
          />

          {/* Primary Search Bar */}
          <div className="relative w-full mb-6 mt-2">
            <div
              className="flex items-center rounded-lg border p-2 transition-all focus-within:ring-2"
              style={{
                backgroundColor: "#f7f2fb",
                borderColor: "rgba(201, 196, 211, 0.4)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              <Search className="w-7 h-7 ml-3" style={{ color: "#352481" }} />
              <input
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-3"
                style={{
                  color: "#1c1b21",
                  fontFamily: "notoSans, sans-serif",
                  fontSize: "16px",
                }}
                placeholder="أدخل كلمات البحث، رقم الوثيقة، أو اسم المؤلف..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-md font-medium transition-colors shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: "#352481",
                  color: "#ffffff",
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                }}
              >
                بحث
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div
              className="border-t pt-6 animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ borderColor: "rgba(201, 196, 211, 0.35)" }}
            >
              <div
                className="flex items-center gap-2 mb-4"
                style={{ color: "#352481" }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <h3
                  className="font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  تصفية النتائج
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Document Type / Category */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium"
                    style={{
                      color: "#1c1b21",
                      fontFamily: "ibmPlexSans, sans-serif",
                    }}
                  >
                    نوع الوثيقة
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-md border py-2 px-3 pr-10 appearance-none focus:outline-none focus:ring-1 cursor-pointer"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "rgba(201, 196, 211, 0.4)",
                        color: "#1c1b21",
                        fontFamily: "notoSans, sans-serif",
                      }}
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">جميع الأنواع</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_ar || cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronLeft
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#797583" }}
                    />
                  </div>
                </div>

                {/* Publisher / Department */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium"
                    style={{
                      color: "#1c1b21",
                      fontFamily: "ibmPlexSans, sans-serif",
                    }}
                  >
                    الجهة المصدرة
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-md border py-2 px-3 pr-10 appearance-none focus:outline-none focus:ring-1 cursor-pointer"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "rgba(201, 196, 211, 0.4)",
                        color: "#1c1b21",
                        fontFamily: "notoSans, sans-serif",
                      }}
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                    >
                      <option value="">جميع الجهات</option>
                      <option value="الديوان الملكي">الديوان الملكي</option>
                      <option value="وزارة الخارجية">وزارة الخارجية</option>
                      <option value="وزارة الداخلية">وزارة الداخلية</option>
                      <option value="إدارة الأرشيف العام">
                        إدارة الأرشيف العام
                      </option>
                    </select>
                    <ChevronLeft
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#797583" }}
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col gap-2 lg:col-span-2">
                  <label
                    className="text-sm font-medium"
                    style={{
                      color: "#1c1b21",
                      fontFamily: "ibmPlexSans, sans-serif",
                    }}
                  >
                    الفترة الزمنية
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-1"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "rgba(201, 196, 211, 0.4)",
                          color: "#1c1b21",
                          fontFamily: "notoSans, sans-serif",
                        }}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{
                        color: "#484551",
                        fontFamily: "notoSans, sans-serif",
                      }}
                    >
                      إلى
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-1"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "rgba(201, 196, 211, 0.4)",
                          color: "#1c1b21",
                          fontFamily: "notoSans, sans-serif",
                        }}
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="px-5 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "#352481",
                    color: "#ffffff",
                    fontFamily: "ibmPlexSans, sans-serif",
                  }}
                >
                  تطبيق الفلاتر
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#F1F0ED]"
                  style={{
                    color: "#797583",
                    fontFamily: "ibmPlexSans, sans-serif",
                    border: "1px solid rgba(201, 196, 211, 0.4)",
                  }}
                >
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════ Results Count & Actions ═══════════════════ */}
        <div className="flex justify-between items-center mb-4">
          <p
            className="text-sm"
            style={{ color: "#484551", fontFamily: "notoSans, sans-serif" }}
          >
            {listStatus === "succeeded" && (
              <>
                <span className="font-semibold" style={{ color: "#1c1b21" }}>
                  {totalCount?.toLocaleString("ar-EG")}
                </span>{" "}
                وثيقة
              </>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)} // ربط الزر بفتح وإغلاق الفلاتر
              className="p-2 border rounded-lg transition-colors hover:bg-[#F1F0ED]"
              title="إظهار/إخفاء الفلاتر"
              style={{
                borderColor: "rgba(201, 196, 211, 0.4)",
                color: showFilters ? "#352481" : "#797583", // تغيير اللون عند التفعيل
                backgroundColor: showFilters ? "#f7f2fb" : "transparent",
              }}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              className="p-2 border rounded-lg transition-colors hover:bg-[#F1F0ED]"
              title="ترتيب النتائج"
              style={{
                borderColor: "rgba(201, 196, 211, 0.4)",
                color: "#797583",
              }}
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ═══════════════════ Results Table ═══════════════════ */}
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
                  <th className="py-4 px-6 w-24 whitespace-nowrap text-center">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody
                className="text-sm"
                style={{
                  color: "#1c1b21",
                  fontFamily: "notoSans, sans-serif",
                }}
              >
                {listStatus === "loading" && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2
                        className="animate-spin h-8 w-8 mx-auto mb-2"
                        style={{ color: "#352481" }}
                      />
                      <span style={{ color: "#797583" }}>
                        جاري تحميل الوثائق...
                      </span>
                    </td>
                  </tr>
                )}

                {listStatus === "failed" && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-red-600">
                        <AlertCircle className="w-8 h-8 opacity-80" />
                        <p className="font-medium mt-1">
                          حدث خطأ أثناء تحميل الوثائق
                        </p>
                        {listError && (
                          <p className="text-xs opacity-75">{listError}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {listStatus === "succeeded" && documents.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center"
                      style={{ color: "#797583" }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 opacity-20 mb-2" />
                        <p>لا توجد وثائق مطابقة لمعايير البحث الحالية.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {listStatus === "succeeded" &&
                  documents.map((doc) => {
                    const categoryName = getCategoryName(
                      doc.category_id,
                      categories,
                    );
                    const isActive = doc.status === "active";
                    const isDraft = doc.status === "draft";

                    return (
                      <tr
                        key={doc.id}
                        className="border-b transition-colors hover:bg-[#F1F0ED]"
                        style={{ borderColor: "rgba(201, 196, 211, 0.2)" }}
                      >
                        <td
                          className="py-4 px-6 font-mono text-xs"
                          style={{ color: "#797583" }}
                        >
                          {doc.dc_identifier || doc.id}
                        </td>
                        <td
                          className="py-4 px-6 font-medium"
                          style={{
                            color: "#1c1b21",
                            fontFamily: "notoSans, sans-serif",
                            fontSize: "15px",
                          }}
                        >
                          {doc.dc_title || "وثيقة بدون عنوان"}
                        </td>
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
                        <td className="py-4 px-6" style={{ color: "#484551" }}>
                          {doc.dc_publisher || "—"}
                        </td>
                        <td
                          className="py-4 px-6"
                          dir="ltr"
                          style={{ color: "#484551", textAlign: "right" }}
                        >
                          {doc.dc_date || doc.created_at?.split("T")[0] || "—"}
                        </td>
                        <td className="py-4 px-6">
                          {isActive ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium"
                              style={{ color: "#086b53" }}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#086b53]" />
                              مؤرشف
                            </span>
                          ) : isDraft ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium"
                              style={{ color: "#BA7517" }}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#BA7517]" />
                              مسودة
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium"
                              style={{ color: "#797583" }}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#797583]" />
                              مؤرشفة
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDocument(doc.id)}
                              className="p-1.5 rounded-md bg-white border shadow-sm transition-colors hover:text-[#352481] hover:border-[#352481]/30"
                              title="عرض التفاصيل"
                              style={{
                                color: "#797583",
                                borderColor: "rgba(201, 196, 211, 0.4)",
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1.5 rounded-md bg-white border shadow-sm transition-colors hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                              title="حذف الوثيقة"
                              style={{
                                color: "#797583",
                                borderColor: "rgba(201, 196, 211, 0.4)",
                              }}
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
                onClick={() => handlePageChange(currentPage - 1)}
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
                style={{
                  color: "#484551",
                  fontFamily: "ibmPlexSans, sans-serif",
                }}
              >
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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

        {/* ═══════════════════ Bento Grid ═══════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Searches */}
          <div
            className="lg:col-span-2 rounded-xl border p-6"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "rgba(201, 196, 211, 0.25)",
              boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
            }}
          >
            <div
              className="flex justify-between items-center mb-4 pb-3 border-b"
              style={{ borderColor: "rgba(201, 196, 211, 0.35)" }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: "#352481" }}
              >
                <History className="w-5 h-5" />
                <h3
                  className="font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  عمليات البحث الأخيرة
                </h3>
              </div>
              <button
                className="text-sm transition-colors hover:text-[#352481]"
                style={{
                  color: "#797583",
                  fontFamily: "ibmPlexSans, sans-serif",
                }}
              >
                مسح السجل
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {recentSearches.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setQuery(item.query);
                    setSearchParams({ query: item.query });
                    dispatch(searchDocuments(item.query));
                  }}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer border hover:border-[#352481]/20 hover:bg-[#f7f2fb] group"
                  style={{ borderColor: "transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-md group-hover:bg-white transition-colors">
                      <Search
                        className="w-4 h-4 transition-colors"
                        style={{ color: "#797583" }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-medium transition-colors group-hover:text-[#352481]"
                        style={{
                          color: "#1c1b21",
                          fontFamily: "notoSans, sans-serif",
                        }}
                      >
                        {item.query}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: "#797583",
                          fontFamily: "notoSans, sans-serif",
                        }}
                      >
                        النوع: {item.type} • {item.time}
                      </p>
                    </div>
                  </div>
                  <ChevronLeft
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#352481" }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Saved Searches */}
          <div
            className="rounded-xl border p-6 relative overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "rgba(201, 196, 211, 0.25)",
              boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
            }}
          >
            <div
              className="absolute top-0 right-0 w-full h-1"
              style={{ backgroundColor: "#BA7517" }}
            />
            <div
              className="flex justify-between items-center mb-4 pb-3 border-b"
              style={{ borderColor: "rgba(201, 196, 211, 0.35)" }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: "#BA7517" }}
              >
                <Bookmark className="w-5 h-5" />
                <h3
                  className="font-semibold"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  عمليات بحث محفوظة
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {savedSearches.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg transition-colors cursor-pointer hover:border-[#BA7517]/30 hover:bg-[#BA7517]/5 group"
                  style={{ borderColor: "rgba(201, 196, 211, 0.4)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className="font-medium transition-colors group-hover:text-[#BA7517]"
                      style={{
                        color: "#1c1b21",
                        fontFamily: "ibmPlexSans, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {item.name}
                    </h4>
                    <button className="text-gray-400 hover:text-[#BA7517] transition-colors p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-xs border"
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#484551",
                          borderColor: "rgba(201, 196, 211, 0.4)",
                          fontFamily: "ibmPlexSans, sans-serif",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
