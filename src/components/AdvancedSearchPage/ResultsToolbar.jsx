import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function ResultsToolbar({
  listStatus,
  totalCount,
  showFilters,
  onToggleFilters,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Count */}
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onToggleFilters}
          className="p-2 border rounded-lg transition-colors hover:bg-[#F1F0ED]"
          title="إظهار/إخفاء الفلاتر"
          style={{
            borderColor: "rgba(201, 196, 211, 0.4)",
            color: showFilters ? "#352481" : "#797583",
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
  );
}
