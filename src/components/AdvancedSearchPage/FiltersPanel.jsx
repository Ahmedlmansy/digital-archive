import { SlidersHorizontal, ChevronLeft, X } from "lucide-react";

const PUBLISHER_OPTIONS = [
  "الديوان الملكي",
  "وزارة الخارجية",
  "وزارة الداخلية",
  "إدارة الأرشيف العام",
];

export default function FiltersPanel({
  show,
  categories,
  categoryId,
  publisher,
  dateFrom,
  dateTo,
  onCategoryChange,
  onPublisherChange,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
}) {
  if (!show) return null;

  return (
    <div
      className="border-t pt-6 animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ borderColor: "rgba(201, 196, 211, 0.35)" }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-4" style={{ color: "#352481" }}>
        <SlidersHorizontal className="w-5 h-5" />
        <h3
          className="font-semibold"
          style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "18px" }}
        >
          تصفية النتائج
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: "#1c1b21", fontFamily: "ibmPlexSans, sans-serif" }}
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
              onChange={(e) => onCategoryChange(e.target.value)}
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

        {/* Publisher */}
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: "#1c1b21", fontFamily: "ibmPlexSans, sans-serif" }}
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
              onChange={(e) => onPublisherChange(e.target.value)}
            >
              <option value="">جميع الجهات</option>
              {PUBLISHER_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
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
            style={{ color: "#1c1b21", fontFamily: "ibmPlexSans, sans-serif" }}
          >
            الفترة الزمنية
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="flex-1 rounded-md border py-2 px-3 focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201, 196, 211, 0.4)",
                color: "#1c1b21",
                fontFamily: "notoSans, sans-serif",
              }}
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
            <span
              className="text-sm"
              style={{ color: "#484551", fontFamily: "notoSans, sans-serif" }}
            >
              إلى
            </span>
            <input
              type="date"
              className="flex-1 rounded-md border py-2 px-3 focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201, 196, 211, 0.4)",
                color: "#1c1b21",
                fontFamily: "notoSans, sans-serif",
              }}
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onApply}
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
          onClick={onClear}
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
  );
}
