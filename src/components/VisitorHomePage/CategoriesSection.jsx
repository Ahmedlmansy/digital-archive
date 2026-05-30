import { useNavigate } from "react-router-dom";
import {
  Landmark,
  Scale,
  ScrollText,
  FlaskConical,
  Mail,
  BarChart2,
  Folder,
  ArrowRight,
} from "lucide-react";

// ── Category icon map ──────────────────────────────────────────
const CATEGORY_ICONS = {
  administrative: { icon: Landmark,     color: "#352481", bg: "#EDE9FF" },
  legal:          { icon: Scale,         color: "#086b53", bg: "#E8F5F1" },
  historical:     { icon: ScrollText,    color: "#512c00", bg: "#FFF3E0" },
  scientific:     { icon: FlaskConical,  color: "#352481", bg: "#EDE9FF" },
  correspondence: { icon: Mail,          color: "#086b53", bg: "#E8F5F1" },
  financial:      { icon: BarChart2,     color: "#BA7517", bg: "#FFF8E7" },
};

const DEFAULT_ICON = { icon: Folder, color: "#484551", bg: "#F1ECF5" };

export default function CategoriesSection({ categories, categoriesStatus }) {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/app/documents?category=${cat.id}`);
  };

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="font-bold"
          style={{ fontSize: 22, color: "#1c1b21", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          تصفح حسب التصنيف
        </h2>
        <button
          onClick={() => navigate("/app/documents")}
          className="flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: "#352481" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#086b53")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#352481")}
        >
          عرض الكل
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Loading skeleton */}
      {categoriesStatus === "loading" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl animate-pulse"
              style={{ background: "#e5e1e9" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const cfg = CATEGORY_ICONS[cat.name] || DEFAULT_ICON;
            const IconComponent = cfg.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group text-right p-5 rounded-xl transition-all duration-200"
                style={{
                  background: "#fff",
                  border: "1.5px solid #e5e1e9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cfg.color;
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e1e9";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: cfg.bg }}
                >
                  <IconComponent size={20} style={{ color: cfg.color }} />
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: "#1c1b21" }}>
                  {cat.name_ar || cat.name}
                </div>
                {cat.description && (
                  <div className="text-xs leading-relaxed" style={{ color: "#797583" }}>
                    {cat.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
