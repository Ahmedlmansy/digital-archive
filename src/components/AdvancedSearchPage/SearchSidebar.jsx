import { History, Bookmark, Search, ChevronLeft, MoreVertical } from "lucide-react";

const RECENT_SEARCHES = [
  { query: "مراسيم تنظيم التجارة ١٣٤٥هـ", type: "مراسيم ملكية",   time: "منذ ساعتين"  },
  { query: "مخطوطات مكتبة الحرم",          type: "مخطوطات",        time: "منذ يومين"   },
  { query: "تقارير التعداد السكاني المبكر", type: "تقارير إدارية", time: "منذ ٤ أيام"  },
];

const SAVED_SEARCHES = [
  { name: "وثائق العهد العثماني", tags: ["مخطوطات", "قبل ١٣٥٠هـ"]          },
  { name: "مراسيم التأسيس",       tags: ["مراسيم ملكية", "الديوان الملكي"] },
];

export default function SearchSidebar({ onRecentClick }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Recent Searches — 2 cols */}
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
          <div className="flex items-center gap-2" style={{ color: "#352481" }}>
            <History className="w-5 h-5" />
            <h3
              className="font-semibold"
              style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "18px" }}
            >
              عمليات البحث الأخيرة
            </h3>
          </div>
          <button
            className="text-sm transition-colors hover:text-[#352481]"
            style={{ color: "#797583", fontFamily: "ibmPlexSans, sans-serif" }}
          >
            مسح السجل
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {RECENT_SEARCHES.map((item, idx) => (
            <li
              key={idx}
              onClick={() => onRecentClick(item.query)}
              className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer border hover:border-[#352481]/20 hover:bg-[#f7f2fb] group"
              style={{ borderColor: "transparent" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-md group-hover:bg-white transition-colors">
                  <Search className="w-4 h-4 transition-colors" style={{ color: "#797583" }} />
                </div>
                <div>
                  <p
                    className="font-medium transition-colors group-hover:text-[#352481]"
                    style={{ color: "#1c1b21", fontFamily: "notoSans, sans-serif" }}
                  >
                    {item.query}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#797583", fontFamily: "notoSans, sans-serif" }}>
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

      {/* Saved Searches — 1 col */}
      <div
        className="rounded-xl border p-6 relative overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "rgba(201, 196, 211, 0.25)",
          boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 right-0 w-full h-1" style={{ backgroundColor: "#BA7517" }} />

        <div
          className="flex justify-between items-center mb-4 pb-3 border-b"
          style={{ borderColor: "rgba(201, 196, 211, 0.35)" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#BA7517" }}>
            <Bookmark className="w-5 h-5" />
            <h3
              className="font-semibold"
              style={{ fontFamily: "ibmPlexSans, sans-serif", fontSize: "18px" }}
            >
              عمليات بحث محفوظة
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {SAVED_SEARCHES.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg transition-colors cursor-pointer hover:border-[#BA7517]/30 hover:bg-[#BA7517]/5 group"
              style={{ borderColor: "rgba(201, 196, 211, 0.4)" }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4
                  className="font-medium transition-colors group-hover:text-[#BA7517]"
                  style={{ color: "#1c1b21", fontFamily: "ibmPlexSans, sans-serif", fontSize: "14px" }}
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
  );
}
