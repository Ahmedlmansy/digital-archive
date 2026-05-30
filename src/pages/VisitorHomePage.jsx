import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDocuments,
  loadCategories,
  searchDocuments,
  setSearchQuery,
} from "@/features/documents/DocumentSlices";

import HeroSection from "@/components/VisitorHomePage/HeroSection";
import CategoriesSection from "@/components/VisitorHomePage/CategoriesSection";
import RecentDocumentsSection from "@/components/VisitorHomePage/RecentDocumentsSection";

export default function VisitorHomePage() {
  const dispatch = useDispatch();

  const {
    documents,
    listStatus,
    totalCount,
    categories,
    categoriesStatus,
    filters,
  } = useSelector((s) => s.documents);

  const [localQuery, setLocalQuery] = useState(filters.query || "");

  // ── Load on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (categoriesStatus === "idle") dispatch(loadCategories());
    dispatch(loadDocuments());
  }, [dispatch, categoriesStatus]);

  // ── Search handler ────────────────────────────────────────────
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = localQuery.trim();
      dispatch(setSearchQuery(q));
      if (q) {
        dispatch(searchDocuments(q));
      } else {
        dispatch(loadDocuments());
      }
    },
    [dispatch, localQuery],
  );

  // ── Recent docs (latest 5) ────────────────────────────────────
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        backgroundColor: "#fdf8ff",
        fontFamily: "'Noto Sans', sans-serif",
      }}
    >
      {/* Hero */}
      <HeroSection
        localQuery={localQuery}
        setLocalQuery={setLocalQuery}
        handleSearch={handleSearch}
        totalCount={totalCount}
        dispatch={dispatch}
        loadDocuments={loadDocuments}
      />

      {/* Body */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Categories */}
        <CategoriesSection
          categories={categories}
          categoriesStatus={categoriesStatus}
        />

        {/* Recent Documents */}
        <RecentDocumentsSection
          recentDocs={recentDocs}
          listStatus={listStatus}
          filters={filters}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
