import { useRef, useCallback } from "react";
import { CloudUpload, X, FileText } from "lucide-react";

export function FileDropZone({ file, onChange, onRemove }) {
  const inputRef = useRef(null);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onChange(f);
    },
    [onChange],
  );
  const onFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) onChange(f);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !file && inputRef.current?.click()}
      className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-colors cursor-pointer min-h-[200px]"
      style={{
        borderColor: file ? "#086b53" : "#c9c4d3",
        backgroundColor: file ? "rgba(8,107,83,0.04)" : "#fdf8ff",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={onFileInput}
      />

      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: file ? "rgba(8,107,83,0.1)" : "rgba(76,61,153,0.10)",
        }}
      >
        {file ? (
          <FileText className="w-7 h-7" style={{ color: "#086b53" }} />
        ) : (
          <CloudUpload className="w-7 h-7" style={{ color: "#352481" }} />
        )}
      </div>

      {file ? (
        <>
          <p
            className="font-semibold mb-1"
            style={{
              color: "#086b53",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "16px",
            }}
          >
            {file.name}
          </p>
          <p
            className="text-sm mb-3"
            style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
          >
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-colors"
            style={{
              color: "#ba1a1a",
              borderColor: "#ba1a1a",
              fontFamily: "'Noto Sans', sans-serif",
            }}
          >
            <X className="w-3 h-3" /> إزالة الملف
          </button>
        </>
      ) : (
        <>
          <p
            className="font-semibold mb-1"
            style={{
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "16px",
            }}
          >
            اسحب وأفلت الملف هنا
          </p>
          <p
            className="text-sm mb-4"
            style={{ color: "#484551", fontFamily: "'Noto Sans', sans-serif" }}
          >
            أو انقر لاختيار ملف من جهازك
          </p>
          <p
            className="text-xs mb-4"
            style={{ color: "#797583", fontFamily: "'Noto Sans', sans-serif" }}
          >
            الصيغ المدعومة: PDF, DOCX — الحد الأقصى: 50MB
          </p>
          <button
            type="button"
            className="px-5 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#c9c4d3",
              color: "#1c1b21",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            استعراض الملفات
          </button>
        </>
      )}
    </div>
  );
}
