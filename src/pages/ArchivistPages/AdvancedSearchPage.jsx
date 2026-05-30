import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  loadDocuments,
  searchDocuments,
  applyFilter,
  loadCategories,
  clearFilters,
  changePage,
  removeDocument,
} from "@/features/documents/DocumentSlices";

import SearchBar from "@/components/AdvancedSearchPage/SearchBar";
import FiltersPanel from "@/components/AdvancedSearchPage/FiltersPanel";
import ResultsToolbar from "@/components/AdvancedSearchPage/ResultsToolbar";
import ResultsTable from "@/components/AdvancedSearchPage/ResultsTable";
import SearchSidebar from "@/components/AdvancedSearchPage/SearchSidebar";

export default function AdvancedSearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    documents = [],
    totalCount,
    listStatus,
    listError,
    currentPage,
    totalPages,
    filters = {},
    categories = [],
  } = useSelector((state) => state.documents);

  // ── Local state ───────────────────────────────────────────────
  const [query, setQuery] = useState(filters.query || "");
  const [categoryId, setCategoryId] = useState(filters.categoryId || "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [publisher, setPublisher] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // ── Load categories + read URL params on mount ────────────────
  useEffect(() => {
    dispatch(loadCategories());
    const urlQuery = searchParams.get("query");
    const urlCategory = searchParams.get("categoryId");

    if (urlQuery) {
      setQuery(urlQuery);
      dispatch(searchDocuments(urlQuery));
    } else if (urlCategory) {
      setCategoryId(urlCategory);
      dispatch(applyFilter({ categoryId: Number(urlCategory) }));
    } else {
      dispatch(loadDocuments());
    }
  }, [dispatch, searchParams]);

  // ── Sync Redux filters → local state ─────────────────────────
  useEffect(() => {
    setQuery(filters.query || "");
    setCategoryId(filters.categoryId || "");
    setDateFrom(filters.dateFrom || "");
    setDateTo(filters.dateTo || "");
  }, [filters]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setSearchParams({ query: query.trim() });
      dispatch(searchDocuments(query.trim()));
    } else {
      setSearchParams({});
      dispatch(loadDocuments());
    }
  }, [dispatch, query, setSearchParams]);

  const handleApplyFilters = () => {
    const filterUpdate = {};
    if (categoryId) filterUpdate.categoryId = Number(categoryId);
    if (dateFrom) filterUpdate.dateFrom = dateFrom;
    if (dateTo) filterUpdate.dateTo = dateTo;
    if (publisher) filterUpdate.query = publisher;
    if (categoryId) setSearchParams({ categoryId });
    dispatch(applyFilter(filterUpdate));
  };

  const handleClearFilters = () => {
    setCategoryId("");
    setDateFrom("");
    setDateTo("");
    setPublisher("");
    setQuery("");
    setSearchParams({});
    dispatch(clearFilters());
    dispatch(loadDocuments());
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) dispatch(changePage(page));
  };

  const handleViewDocument = (docId) => navigate(`/app/documents/${docId}`);

  const handleDeleteDocument = (docId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الوثيقة؟")) {
      dispatch(removeDocument(docId));
    }
  };

  const handleRecentClick = (recentQuery) => {
    setQuery(recentQuery);
    setSearchParams({ query: recentQuery });
    dispatch(searchDocuments(recentQuery));
  };

  return (
    <main
      dir="rtl"
      className="flex-1 bg-[#F8F7F4] overflow-y-auto min-h-screen p-4 md:p-8"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-semibold mb-2"
            style={{
              color: "#1c1b21",
              fontFamily: "ibmPlexSans, sans-serif",
              fontSize: "32px",
              lineHeight: "40px",
            }}
          >
            البحث المتقدم
          </h1>
          <p
            className="max-w-3xl"
            style={{
              color: "#484551",
              fontFamily: "notoSans, sans-serif",
              fontSize: "18px",
              lineHeight: "28px",
            }}
          >
            ابحث في السجلات الأرشيفية، المراسيم، والمخطوطات باستخدام فلاتر دقيقة
            للوصول السريع إلى الوثائق المطلوبة.
          </p>
        </div>

        {/* Search Card */}
        <div
          className="rounded-xl border p-6 mb-8 relative overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(201, 196, 211, 0.25)",
            boxShadow: "rgba(28, 27, 33, 0.05) 0px 2px 8px",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 right-0 w-full h-1"
            style={{ background: "linear-gradient(to left, #352481, #086b53)" }}
          />

          <SearchBar
            query={query}
            onChange={setQuery}
            onSearch={handleSearch}
          />

          <FiltersPanel
            show={showFilters}
            categories={categories}
            categoryId={categoryId}
            publisher={publisher}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onCategoryChange={setCategoryId}
            onPublisherChange={setPublisher}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </div>

        {/* Toolbar */}
        <ResultsToolbar
          listStatus={listStatus}
          totalCount={totalCount}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
        />

        {/* Table */}
        <ResultsTable
          documents={documents}
          categories={categories}
          listStatus={listStatus}
          listError={listError}
          currentPage={currentPage}
          totalPages={totalPages}
          onView={handleViewDocument}
          onDelete={handleDeleteDocument}
          onPageChange={handlePageChange}
        />

        {/* Bento Grid */}
        <SearchSidebar onRecentClick={handleRecentClick} />
      </div>
    </main>
  );
}
