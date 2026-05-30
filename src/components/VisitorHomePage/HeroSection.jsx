import { Sparkles, Search, X } from "lucide-react";

export default function HeroSection({
  localQuery,
  setLocalQuery,
  handleSearch,
  totalCount,
  dispatch,
  loadDocuments,
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #352481 0%, #4c3d99 60%, #086b53 100%)",
        minHeight: "420px",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full opacity-10"
        style={{ width: 500, height: 500, background: "#fff", top: -200, left: -100 }}
      />
      <div
        className="absolute rounded-full opacity-10"
        style={{ width: 300, height: 300, background: "#BA7517", bottom: -100, right: 60 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Label */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Sparkles size={16} style={{ color: "#BA7517" }} />
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
            بوابة الباحثين — الأرشيف الرقمي
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-bold mb-4 leading-tight"
          style={{ fontSize: 42, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          اكتشف تراثنا الوثائقي
        </h1>

        {/* Description */}
        <p
          className="mb-10 max-w-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}
        >
          أرشيف رقمي متكامل يضم آلاف الوثائق، المخطوطات، والمراسيم مفهرسة بأعلى معايير الجودة.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <div
            className="flex-1 flex items-center gap-3 px-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            <Search size={20} style={{ color: "#797583" }} />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="ابحث بالكلمات المفتاحية، رقم الوثيقة، أو التاريخ..."
              className="flex-1 border-none outline-none bg-transparent py-4"
              style={{ fontSize: 15, color: "#1c1b21", direction: "rtl" }}
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery("");
                  dispatch(loadDocuments());
                }}
                style={{ color: "#797583", cursor: "pointer", background: "none", border: "none" }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-8 py-4 rounded-xl font-semibold transition-all"
            style={{
              background: "#BA7517",
              color: "#fff",
              fontSize: 15,
              fontFamily: "'IBM Plex Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(186,117,23,0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#9a6010")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#BA7517")}
          >
            بحث
          </button>
        </form>

        {/* Stats */}
        {totalCount > 0 && (
          <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <span className="font-bold" style={{ color: "#BA7517" }}>
              {totalCount.toLocaleString("ar-EG")}
            </span>{" "}
            وثيقة متاحة في الأرشيف
          </p>
        )}
      </div>
    </section>
  );
}
