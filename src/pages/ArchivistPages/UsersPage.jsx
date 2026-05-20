import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Plus,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  Loader2,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  loadUsers,
  searchUsers,
  changePage,
  applyFilter,
  removeUser,
  clearFilters,
  setSearchQuery,
  toggleSelection,
  toggleAllSelection,
  removeBulkUsers,
} from "@/features/users/UserSlice";
import { useNavigate } from "react-router-dom";

const roleConfig = {
  archivist: {
    label: "أرشيفي",
    color: "text-[#ffffff] border-[#086b53]",
    style: { backgroundColor: "#086b53" },
  },
  researcher: {
    label: "باحث",
    color: "text-[#512c00] border-[#714000]",
    style: { backgroundColor: "#ffdcbe" },
  },
  visitor: {
    label: "زائر",
    color: "text-[#484551] border-[#c9c4d3]",
    style: { backgroundColor: "#e5e1e9" },
  },
};

const statusConfig = {
  active: {
    label: "نشط",
    dot: "#086b53",
    text: "#086b53",
  },
  inactive: {
    label: "معطل",
    dot: "#ba1a1a",
    text: "#ba1a1a",
  },
};
// ── Helper: Avatar Initials ────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "؟";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
};

// ── Helper: Format Date ──────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UsersPage()
{
    const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    users,
    listStatus,
    listError,
    totalCount,
    currentPage,
    totalPages,
    itemsPerPage,
    filters,
    selectedIds,
    deleteStatus,
  } = useSelector((state) => state.users);

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ── Load on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  // ── Debounced Search ─────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        dispatch(searchUsers(searchInput.trim()));
      } else if (filters.query && !searchInput) {
        dispatch(loadUsers());
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch, filters.query]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const handleRoleFilter = (role) => {
    dispatch(applyFilter({ role: filters.role === role ? null : role }));
  };

  const handleStatusFilter = (status) => {
    dispatch(
      applyFilter({ status: filters.status === status ? null : status }),
    );
  };

  const handleClearAll = () => {
    setSearchInput("");
    dispatch(clearFilters());
    dispatch(loadUsers());
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(changePage(page));
  };

  const handleDelete = (user) => {
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${user.full_name}"؟`))
      return;
    dispatch(removeUser(user.id));
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main
      dir="rtl"
      className=" min-h-screen"
      style={{ backgroundColor: "#fdf8ff" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1
              className="font-semibold"
              style={{
                fontFamily: "ibmPlexSans, sans-serif",
                fontSize: "32px",
                lineHeight: "40px",
                color: "#1c1b21",
              }}
            >
              إدارة المستخدمين
            </h1>
            <p
              className="mt-1"
              style={{
                fontFamily: "notoSans, sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
                color: "#484551",
              }}
            >
              إدارة صلاحيات الوصول وأدوار المستخدمين في النظام
            </p>
          </div>
          <Button
            className="flex items-center gap-2 px-6 py-3 h-auto rounded-lg shadow-sm transition-colors hover:opacity-90"
            style={{
              backgroundColor: "#352481",
              color: "#ffffff",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => navigate("/app/add-user")}
          >
            <Plus className="w-5 h-5" />
            إضافة مستخدم جديد
          </Button>
        </div>

        {/* Search & Filters */}
        <div
          className="rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between border"
          style={{ backgroundColor: "#ffffff", borderColor: "#c9c4d3" }}
        >
          <div className="relative w-full md:w-96">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#797583" }}
            />
            <Input
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="البحث عن مستخدم (الاسم، البريد الإلكتروني)..."
              className="w-full py-2.5 pr-10 pl-4 rounded-lg border outline-none transition-all text-right h-auto"
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

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full border px-4 py-2 h-auto whitespace-nowrap transition-colors flex items-center gap-1"
              style={{
                borderColor: "#c9c4d3",
                backgroundColor: showFilters ? "#f1ecf5" : "#ffffff",
                color: "#484551",
                fontFamily: "ibmPlexSans, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              الدور: {filters.role ? roleConfig[filters.role]?.label : "الكل"}
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full border px-4 py-2 h-auto whitespace-nowrap transition-colors flex items-center gap-1"
              style={{
                borderColor: "#c9c4d3",
                backgroundColor: showFilters ? "#f1ecf5" : "#ffffff",
                color: "#484551",
                fontFamily: "ibmPlexSans, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              الحالة:{" "}
              {filters.status ? statusConfig[filters.status]?.label : "الكل"}
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {(filters.role || filters.status || filters.query) && (
              <button
                onClick={handleClearAll}
                className="rounded-full px-4 py-2 h-auto whitespace-nowrap flex items-center gap-1 transition-colors"
                style={{
                  backgroundColor: "#e5e1e9",
                  color: "#1c1b21",
                  fontFamily: "ibmPlexSans, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {filters.role
                  ? roleConfig[filters.role]?.label
                  : filters.status
                    ? statusConfig[filters.status]?.label
                    : "البحث"}
                <X className="w-4 h-4 hover:text-error" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div
            className="rounded-xl p-4 mb-6 border shadow-sm"
            style={{ backgroundColor: "#ffffff", borderColor: "#c9c4d3" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Filter */}
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{
                    fontFamily: "ibmPlexSans, sans-serif",
                    fontSize: "14px",
                    color: "#484551",
                  }}
                >
                  الدور الوظيفي
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(roleConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => handleRoleFilter(key)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors font-notoSans ${
                        filters.role === key
                          ? "bg-primary/10 text-primary border-primary"
                          : "bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

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
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusFilter(key)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors font-notoSans ${
                        filters.status === key
                          ? key === "active"
                            ? "bg-secondary/10 text-secondary border-secondary"
                            : "bg-error/10 text-error border-error"
                          : "bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div
            className="flex items-center justify-between p-3 mb-4 rounded-lg border"
            style={{ backgroundColor: "#e5deff", borderColor: "#352481" }}
          >
            <span className="font-medium text-primary text-sm">
              تم اختيار {selectedIds.length} مستخدم
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() =>
                  dispatch(toggleAllSelection(users.map((u) => u.id)))
                }
              >
                إلغاء التحديد
              </Button>
              <Button
                size="sm"
                className="bg-error text-on-error hover:bg-error-container"
                onClick={() => {
                  if (
                    window.confirm("هل أنت متأكد من حذف المستخدمين المحددين؟")
                  ) {
                    dispatch(removeBulkUsers(selectedIds));
                  }
                }}
              >
                <Trash2 className="w-4 h-4 ml-1" />
                حذف المحدد
              </Button>
            </div>
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
            <p className="text-sm mb-4" style={{ color: "#484551" }}>
              {listError}
            </p>
            <Button
              onClick={() => dispatch(loadUsers())}
              variant="outline"
              className="border-error text-error hover:bg-error-container"
            >
              إعادة المحاولة
            </Button>
          </div>
        )}

        {/* Table Card */}
        <div
          className="rounded-xl overflow-hidden border shadow-sm"
          style={{ backgroundColor: "#ffffff", borderColor: "#c9c4d3" }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow
                  className="border-b hover:bg-transparent"
                  style={{ backgroundColor: "#F8F7F4", borderColor: "#c9c4d3" }}
                >
                  <TableHead className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() =>
                        dispatch(toggleAllSelection(users.map((u) => u.id)))
                      }
                      className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      style={{ accentColor: "#352481" }}
                    />
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    المستخدم
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    البريد الإلكتروني
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    الدور الوظيفي
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    تاريخ الانضمام
                  </TableHead>
                  <TableHead
                    className="p-4 text-right font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    الحالة
                  </TableHead>
                  <TableHead
                    className="p-4 text-center w-24 font-semibold"
                    style={{
                      fontFamily: "ibmPlexSans, sans-serif",
                      fontSize: "14px",
                      color: "#484551",
                    }}
                  >
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody
                className="divide-y"
                style={{ borderColor: "#c9c4d3" }}
              >
                {listStatus === "loading" && users.length === 0 ? (
                  // Skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell className="p-4">
                        <div className="w-4 h-4 bg-surface-container-high rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
                          <div className="w-32 h-4 bg-surface-container-high rounded animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="w-40 h-4 bg-surface-container-high rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="w-20 h-6 bg-surface-container-high rounded-full animate-pulse" />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="w-24 h-4 bg-surface-container-high rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="w-16 h-4 bg-surface-container-high rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex gap-2 justify-center">
                          <div className="w-5 h-5 bg-surface-container-high rounded animate-pulse" />
                          <div className="w-5 h-5 bg-surface-container-high rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto mb-3 text-outline" />
                      <p
                        className="font-medium"
                        style={{
                          fontFamily: "ibmPlexSans, sans-serif",
                          fontSize: "16px",
                          color: "#484551",
                        }}
                      >
                        لا يوجد مستخدمين
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#797583" }}>
                        جرب تعديل عوامل البحث
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const role = roleConfig[user.role] || roleConfig.visitor;
                    const status =
                      statusConfig[user.status] || statusConfig.active;

                    return (
                      <TableRow
                        key={user.id}
                        className="transition-colors group hover:bg-[#F1F0ED]"
                      >
                        <TableCell className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => dispatch(toggleSelection(user.id))}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                            style={{ accentColor: "#352481" }}
                          />
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest shrink-0">
                                <img
                                  src={user.avatar_url}
                                  alt={user.full_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold shrink-0"
                                style={{
                                  backgroundColor: "#ebe6ef",
                                  color: "#352481",
                                  fontFamily: "ibmPlexSans, sans-serif",
                                }}
                              >
                                {getInitials(user.full_name)}
                              </div>
                            )}
                            <span
                              className="font-medium"
                              style={{
                                fontFamily: "ibmPlexSans, sans-serif",
                                fontSize: "16px",
                                color: "#1c1b21",
                              }}
                            >
                              {user.full_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="p-4 text-left"
                          dir="ltr"
                          style={{ color: "#484551", fontSize: "14px" }}
                        >
                          {user.email || "—"}
                        </TableCell>
                        <TableCell className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${role.color}`}
                          >
                            {role.label}
                          </span>
                        </TableCell>
                        <TableCell
                          className="p-4"
                          style={{ color: "#484551", fontSize: "14px" }}
                        >
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 ${status.text}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${status.dot}`}
                            />
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="transition-colors hover:text-primary"
                              style={{ color: "#797583" }}
                              title="تعديل"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={deleteStatus === "loading"}
                              className="transition-colors hover:text-error disabled:opacity-50"
                              style={{ color: "#797583" }}
                              title="حذف"
                            >
                              <Trash2 className="w-5 h-5" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-4 py-3 border-t flex items-center justify-between"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#c9c4d3",
              }}
            >
              <div
                style={{
                  fontFamily: "notoSans, sans-serif",
                  fontSize: "12px",
                  color: "#484551",
                }}
              >
                عرض{" "}
                <span className="font-medium" style={{ color: "#1c1b21" }}>
                  {((currentPage - 1) * itemsPerPage + 1).toLocaleString(
                    "ar-SA",
                  )}
                </span>{" "}
                إلى{" "}
                <span className="font-medium" style={{ color: "#1c1b21" }}>
                  {Math.min(
                    currentPage * itemsPerPage,
                    totalCount,
                  ).toLocaleString("ar-SA")}
                </span>{" "}
                من أصل{" "}
                <span className="font-medium" style={{ color: "#1c1b21" }}>
                  {totalCount.toLocaleString("ar-SA")}
                </span>{" "}
                مستخدم
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

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                        if (currentPage !== pageNum)
                          e.currentTarget.style.backgroundColor = "#f1ecf5";
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum)
                          e.currentTarget.style.backgroundColor = "transparent";
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
      </div>
    </main>
  );
}
