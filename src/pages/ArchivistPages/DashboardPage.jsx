import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LibraryBig, TrendingUp, LayoutGrid, Users } from "lucide-react";

import {
  loadCategories,
  loadDocuments,
} from "@/features/documents/DocumentSlices";
import { loadUsers } from "@/features/users/UserSlice";

import DashboardHeader from "@/components/DashboardPage/DashboardHeader";
import StatsGrid from "@/components/DashboardPage/StatsGrid";
import RecentDocumentsTable from "@/components/DashboardPage/RecentDocumentsTable";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    documents = [],
    totalCount,
    listStatus,
    listError,
    categories = [],
  } = useSelector((state) => state.documents);

  const { totalCount: usersCount } = useSelector((state) => state.users);

  // ── Load on mount ─────────────────────────────────────────────
  useEffect(() => {
    dispatch(loadDocuments({ page: 1, limit: 5 }));
    dispatch(loadUsers({ page: 1, limit: 1 }));
    dispatch(loadCategories());
  }, [dispatch]);

  // ── Stats ─────────────────────────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────
  const handleAddDocument = () => navigate("/app/upload");
  const handleViewAll = () => navigate("/app/documents");
  const handleViewDocument = (docId) => navigate(`/app/documents/${docId}`);
  const handleDownload = (doc) => {
    if (doc.file_url) window.open(doc.file_url, "_blank");
  };

  return (
    <main
      dir="rtl"
      className="flex-1 mt-16 p-4 md:p-8"
      style={{ backgroundColor: "#F8F7F4", minHeight: "100vh" }}
    >
      <div className="max-w-[1440px] mx-auto">
        <DashboardHeader onAddDocument={handleAddDocument} />

        <StatsGrid stats={statCards} />

        <RecentDocumentsTable
          documents={documents}
          categories={categories}
          listStatus={listStatus}
          listError={listError}
          onViewAll={handleViewAll}
          onView={handleViewDocument}
          onDownload={handleDownload}
        />
      </div>
    </main>
  );
}
