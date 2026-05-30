import { Search } from "lucide-react";

export default function SearchBar({ query, onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="relative w-full mb-6 mt-2">
      <div
        className="flex items-center rounded-lg border p-2 transition-all focus-within:ring-2"
        style={{
          backgroundColor: "#f7f2fb",
          borderColor: "rgba(201, 196, 211, 0.4)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <Search className="w-7 h-7 ml-3" style={{ color: "#352481" }} />
        <input
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-3"
          style={{
            color: "#1c1b21",
            fontFamily: "notoSans, sans-serif",
            fontSize: "16px",
          }}
          placeholder="أدخل كلمات البحث، رقم الوثيقة، أو اسم المؤلف..."
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={onSearch}
          className="px-6 py-3 rounded-md font-medium transition-colors shadow-sm hover:opacity-90"
          style={{
            backgroundColor: "#352481",
            color: "#ffffff",
            fontFamily: "ibmPlexSans, sans-serif",
            fontSize: "14px",
          }}
        >
          بحث
        </button>
      </div>
    </div>
  );
}
