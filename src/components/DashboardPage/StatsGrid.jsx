export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((card, index) => (
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
                fontSize: "12px",
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
  );
}
