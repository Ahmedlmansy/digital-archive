import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LibraryBig,
  TrendingUp,
  LayoutGrid,
  Users,
  Plus,
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
import { Button } from "@/components/ui/button";
import { loadCategories, loadDocuments } from "@/features/documents/DocumentSlices";
import { loadUsers } from "@/features/users/UserSlice";


// ── Helper: أيقونة ولون حسب اسم التصنيف (بالعربي) ───────────
function getDocStyle(categoryName = "") {
  const c = categoryName.trim();
  if (c.includes("تاريخية") || c.includes("مخطوطة")) {
    return {
      icon: ScrollText,
      color: "#714000",
      bgColor: "rgba(81, 44, 0, 0.1)",
    };
  }
  if (c.includes("قانونية") || c.includes("قرار") || c.includes("حكومية")) {
    return { icon: Gavel, color: "#086b53", bgColor: "rgba(8, 107, 83, 0.1)" };
  }
  if (c.includes("علمية") || c.includes("بحث") || c.includes("تقرير")) {
    return { icon: BookOpen, color: "#352481", bgColor: "#ebe6ef" };
  }
  if (c.includes("مراسلات") || c.includes("خطاب") || c.includes("رسالة")) {
    return { icon: Mail, color: "#484551", bgColor: "#e5e1e9" };
  }
  if (c.includes("مالية") || c.includes("سنوي") || c.includes("إدارية")) {
    return { icon: Landmark, color: "#484551", bgColor: "#e5e1e9" };
  }
  return { icon: FileText, color: "#352481", bgColor: "#ebe6ef" };
}

// ── Helper: اسم التصنيف من الـ ID ───────────────────────────
function getCategoryName(categoryId, categories = []) {
  if (!categoryId) return "غير مصنف";
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.name_ar || cat?.name || "غير مصنف";
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    documents = [],
    totalCount,
    listStatus,
    listError,
    categories = [],
    categoriesStatus,
  } = useSelector((state) => state.documents);

  const { totalCount: usersCount } = useSelector((state) => state.users);

  // ── Load Data ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(loadDocuments({ page: 1, limit: 5 }));
    dispatch(loadUsers({ page: 1, limit: 1 }));
    dispatch(loadCategories()); // عشان نقدر نترجم category_id → اسم
  }, [dispatch]);

  // ── Stats from Redux ───────────────────────────────────────
  const statCards = useMemo(
    () => [
      {
        icon: LibraryBig,
        label: "إجمالي الوثائق",
        value: totalCount?.toLocaleString("ar-EG") ?? "—",
        color: "#352481",
        bgColor: "rgba(76, 61, 153, 0.12)",
      },
      {
        icon: TrendingUp,
        label: "الوثائق هذا الشهر",
        value: "+10",
        color: "#086b53",
        bgColor: "rgba(8, 107, 83, 0.12)",
      },
      {
        icon: LayoutGrid,
        label: "التصنيفات",
        value: categories.length?.toString() ?? "—",
        color: "#714000",
        bgColor: "rgba(81, 44, 0, 0.1)",
      },
      {
        icon: Users,
        label: "المستخدمون",
        value: usersCount?.toLocaleString("ar-EG") ?? "—",
        color: "#484551",
        bgColor: "#e5e1e9",
      },
    ],
    [totalCount, usersCount, categories.length],
  );

  // ── Handlers ────────────────────────────────────────────────
  const handleAddDocument = () => navigate("/app/upload");
  const handleViewAll = () => navigate("/app/documents");
  const handleViewDocument = (docId) => navigate(`/app/documents/${docId}`);

  return (
    <main
      dir="rtl"
      className="flex-1 mt-16 p-4 md:p-8"
      style={{ backgroundColor: "#F8F7F4", minHeight: "100vh" }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1
              className="font-semibold"
              style={{
                color: "#1c1b21",
                fontFamily: "ibmPlexSans, sans-serif",
                fontSize: "32px",
                lineHeight: "40px",
              }}
            >
              نظرة عامة
            </h1>
            <p
              className="mt-1"
              style={{
                color: "#484551",
                fontFamily: "notoSans, sans-serif",
                fontSize: "18px",
                lineHeight: "28px",
              }}
            >
              مرحباً بك في نظام الأرشفة المؤسسي.
            </p>
          </div>
          <Button
            onClick={handleAddDocument}
            className="flex items-center gap-2 shadow-sm transition-colors active:scale-95 self-start sm:self-auto"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "0.5rem",
              padding: "12px 24px",
              height: "auto",
            }}
          >
            <Plus className="w-4 h-4" />
            إضافة وثيقة جديدة
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-xl border transition-shadow cursor-default"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201, 196, 211, 0.25)",
                boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <p
                  className="text-xs"
                  style={{
                    color: "#484551",
                    fontFamily: "notoSans, sans-serif",
                    lineHeight: "16px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  className="mt-1 font-semibold"
                  style={{
                    color: "#1c1b21",
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "24px",
                    lineHeight: "32px",
                  }}
                >
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Documents */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(201, 196, 211, 0.25)",
            boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
          }}
        >
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
              onClick={handleViewAll}
              className="flex items-center gap-1 transition-colors text-sm font-medium hover:opacity-80"
              style={{
                color: "#352481",
                fontFamily: "ibmPlexSans, sans-serif",
              }}
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f7f2fb",
                    borderBottom: "1px solid rgba(201, 196, 211, 0.4)",
                  }}
                >
                  <th
                    className="px-4 py-3 text-xs font-medium"
                    style={{ color: "#484551", width: "64px" }}
                  >
                    مصغرة
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-medium"
                    style={{ color: "#484551" }}
                  >
                    العنوان
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-medium"
                    style={{ color: "#484551" }}
                  >
                    التصنيف
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-medium"
                    style={{ color: "#484551" }}
                  >
                    التاريخ
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-medium"
                    style={{ color: "#484551", width: "96px" }}
                  >
                    إجراءات
                  </th>
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
                        {listError && (
                          <p className="text-xs opacity-75">{listError}</p>
                        )}
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

                {/* Data */}
                {listStatus === "succeeded" &&
                  documents.map((doc) => {
                    const categoryName = getCategoryName(
                      doc.category_id,
                      categories,
                    );
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
                            <Icon
                              className="w-5 h-5"
                              style={{ color: style.color }}
                            />
                          </div>
                        </td>

                        {/* Title + Archive ID */}
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
                            style={{
                              color: "#797583",
                              fontFamily: "notoSans, sans-serif",
                            }}
                          >
                            {doc.dc_identifier || doc.id}
                          </p>
                        </td>

                        {/* Category Badge */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                            style={{
                              backgroundColor:
                                categoryName === "تاريخية"
                                  ? "rgba(81, 44, 0, 0.1)"
                                  : categoryName === "قانونية"
                                    ? "rgba(8, 107, 83, 0.1)"
                                    : "#f1ecf5",
                              color:
                                categoryName === "تاريخية"
                                  ? "#714000"
                                  : categoryName === "قانونية"
                                    ? "#086b53"
                                    : "#484551",
                              borderColor:
                                categoryName === "تاريخية"
                                  ? "rgba(113, 64, 0, 0.2)"
                                  : categoryName === "قانونية"
                                    ? "rgba(8, 107, 83, 0.2)"
                                    : "rgba(201, 196, 211, 0.4)",
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
                              onClick={() => handleViewDocument(doc.id)}
                              className="p-1.5 rounded transition-colors hover:text-[#352481]"
                              title="عرض"
                              style={{ color: "#797583" }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
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
      </div>
    </main>
  );
}
