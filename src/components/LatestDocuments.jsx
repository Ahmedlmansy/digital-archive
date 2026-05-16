import {
  
  FileText,
  ScrollText,
  Gavel,
  Eye,
  Download,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
export default function LatestDocuments()
{
      const [hoveredRow, setHoveredRow] = useState(null);

  const DOCUMENTS = [
    {
      id: "1",
      title: "التقرير المالي السنوي 2023",
      code: "DOC-2023-001",
      category: "تقارير سنوية",
      categoryBg: "#f1ecf5",
      categoryColor: "#484551",
      categoryBorder: "rgba(201,196,211,0.4)",
      date: "2023-10-24",
      icon: FileText,
      iconColor: "#352481",
    },
    {
      id: "2",
      title: "مخطوطة ابن سينا الطبية",
      code: "MS-1102-045",
      category: "مخطوطات تاريخية",
      categoryBg: "rgba(81,44,0,0.10)",
      categoryColor: "#714000",
      categoryBorder: "rgba(113,64,0,0.20)",
      date: "2023-10-22",
      icon: ScrollText,
      iconColor: "#714000",
    },
    {
      id: "3",
      title: "قرار وزاري رقم 45/2023",
      code: "GOV-2023-045",
      category: "وثائق حكومية",
      categoryBg: "rgba(8,107,83,0.10)",
      categoryColor: "#086b53",
      categoryBorder: "rgba(8,107,83,0.20)",
      date: "2023-10-20",
      icon: Gavel,
      iconColor: "#086b53",
    },
  ];
  return (
    <div>
      {/* Documents Table */}
      <section
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "rgba(201,196,211,0.25)",
          boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
        }}
      >
        {/* Table header */}
        <div
          className="px-6 py-4 border-b flex justify-between items-center"
          style={{
            backgroundColor: "#f7f2fb",
            borderColor: "rgba(201,196,211,0.35)",
          }}
        >
          <h2
            className="font-semibold"
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "24px",
              lineHeight: "32px",
            }}
          >
            أحدث الوثائق المضافة
          </h2>
          <button
            className="flex items-center gap-1 transition-colors text-sm font-medium"
            style={{
              color: "#352481",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7f2fb",
                  borderBottom: "1px solid rgba(201,196,211,0.4)",
                }}
              >
                {["مصغرة", "العنوان", "التصنيف", "التاريخ", "إجراءات"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-medium"
                      style={{
                        color: "#484551",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        width: i === 0 ? "64px" : i === 4 ? "96px" : undefined,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {DOCUMENTS.map((doc) => {
                const Icon = doc.icon;
                const isHovered = hoveredRow === doc.id;
                return (
                  <tr
                    key={doc.id}
                    className="transition-colors group"
                    style={{
                      backgroundColor: isHovered ? "#f1ecf5" : "transparent",
                      borderBottom: "1px solid rgba(201,196,211,0.2)",
                    }}
                    onMouseEnter={() => setHoveredRow(doc.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center"
                        style={{ backgroundColor: "#ebe6ef" }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: doc.iconColor }}
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p
                        className="font-medium"
                        style={{
                          color: "#1c1b21",
                          fontFamily: "'Noto Sans', sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {doc.title}
                      </p>
                      <p
                        className="mt-0.5 text-xs"
                        style={{
                          color: "#797583",
                          fontFamily: "'Noto Sans', sans-serif",
                        }}
                      >
                        {doc.code}
                      </p>
                    </td>

                    {/* Category chip */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: doc.categoryBg,
                          color: doc.categoryColor,
                          borderColor: doc.categoryBorder,
                          fontFamily: "'IBM Plex Sans', sans-serif",
                        }}
                      >
                        {doc.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td
                      className="px-4 py-3 text-sm"
                      dir="ltr"
                      style={{
                        color: "#484551",
                        fontFamily: "'Noto Sans', sans-serif",
                        textAlign: "right",
                      }}
                    >
                      {doc.date}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-1 transition-opacity"
                        style={{ opacity: isHovered ? 1 : 0 }}
                      >
                        <button
                          className="p-1.5 rounded transition-colors"
                          title="عرض"
                          style={{ color: "#797583" }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded transition-colors"
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
  );
}
