import {
  LibraryBig,
  TrendingUp,
  LayoutGrid,
  Users,

} from "lucide-react";
export default function Overview() {
  const STATS = [
    {
      label: "إجمالي الوثائق",
      value: "12,450",
      icon: LibraryBig,
      iconBg: "rgba(76,61,153,0.12)",
      iconColor: "#352481",
    },
    {
      label: "الوثائق هذا الشهر",
      value: "+342",
      icon: TrendingUp,
      iconBg: "rgba(8,107,83,0.12)",
      iconColor: "#086b53",
    },
    {
      label: "التصنيفات",
      value: "18",
      icon: LayoutGrid,
      iconBg: "rgba(81,44,0,0.10)",
      iconColor: "#714000",
    },
    {
      label: "المستخدمون",
      value: "56",
      icon: Users,
      iconBg: "#e5e1e9",
      iconColor: "#484551",
    },
  ];
  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-6 rounded-xl border transition-shadow cursor-default"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201,196,211,0.25)",
                boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
              </div>
              <div>
                <p
                  className="text-xs"
                  style={{
                    color: "#484551",
                    fontFamily: "'Noto Sans', sans-serif",
                    lineHeight: "16px",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  className="mt-1 font-semibold"
                  style={{
                    color: "#1c1b21",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "24px",
                    lineHeight: "32px",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
