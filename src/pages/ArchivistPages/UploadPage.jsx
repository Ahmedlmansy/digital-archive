import { useState, useRef, useCallback } from "react";
import {
  CloudUpload,
  Sparkles,
  Save,
  X,
  Info,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const labelStyle = {
  color: "#1c1b21",
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
};

const inputStyle = {
  backgroundColor: "#fdf8ff",
  borderColor: "#c9c4d3",
  color: "#1c1b21",
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: "16px",
  borderRadius: "0.5rem",
};

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label style={labelStyle}>
        {label} {required && <span style={{ color: "#ba1a1a" }}>*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function UploadDocument() {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    subject: "",
    description: "",
    publisher: "",
    date: "",
    classification: "",
    language: "العربية",
    rights: "",
  });

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setDroppedFile(file);
  }, []);
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setDroppedFile(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Page header */}
      <header className="mb-6">
        <h1
          className="font-semibold"
          style={{
            color: "#352481",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "32px",
            lineHeight: "40px",
          }}
        >
          إضافة وثيقة جديدة
        </h1>
        <p
          className="mt-1"
          style={{
            color: "#484551",
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          يرجى رفع الملف وتعبئة البيانات الوصفية (Dublin Core) لإضافته إلى
          الأرشيف.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Metadata form — 7 cols */}
          <div
            className="lg:col-span-7 rounded-xl p-6 flex flex-col gap-6 border"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "rgba(201,196,211,0.35)",
              boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
            }}
          >
            <h2
              className="font-semibold pb-4 border-b"
              style={{
                color: "#1c1b21",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "24px",
                lineHeight: "32px",
                borderColor: "rgba(201,196,211,0.35)",
              }}
            >
              البيانات الوصفية
            </h2>

            <div className="flex flex-col gap-4">
              <Field label="العنوان" required>
                <Input
                  id="doc-title"
                  type="text"
                  placeholder="أدخل عنوان الوثيقة الرئيسي"
                  value={form.title}
                  onChange={set("title")}
                  required
                  style={inputStyle}
                  className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="المؤلف">
                  <Input
                    id="doc-author"
                    type="text"
                    placeholder="اسم الكاتب أو المنشئ"
                    value={form.author}
                    onChange={set("author")}
                    style={inputStyle}
                    className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  />
                </Field>
                <Field label="الموضوع">
                  <Input
                    id="doc-subject"
                    type="text"
                    placeholder="الكلمات المفتاحية أو التصنيف العام"
                    value={form.subject}
                    onChange={set("subject")}
                    style={inputStyle}
                    className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  />
                </Field>
              </div>

              <Field label="الوصف">
                <Textarea
                  id="doc-desc"
                  placeholder="ملخص أو وصف تفصيلي لمحتوى الوثيقة..."
                  rows={4}
                  value={form.description}
                  onChange={set("description")}
                  className="resize-none transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  style={inputStyle}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="الناشر">
                  <Input
                    id="doc-publisher"
                    type="text"
                    placeholder="الجهة المصدرة أو الناشرة"
                    value={form.publisher}
                    onChange={set("publisher")}
                    style={inputStyle}
                    className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  />
                </Field>
                <Field label="التاريخ">
                  <div className="relative">
                    <CalendarDays
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#797583" }}
                    />
                    <Input
                      id="doc-date"
                      type="date"
                      value={form.date}
                      onChange={set("date")}
                      style={{ ...inputStyle, paddingLeft: "40px" }}
                      className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                    />
                  </div>
                </Field>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-1 border-t"
                style={{ borderColor: "rgba(201,196,211,0.35)" }}
              >
                <Field label="التصنيف">
                  <Select
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, classification: v }))
                    }
                  >
                    <SelectTrigger
                      id="doc-class"
                      className="h-10 transition-all focus:ring-1 focus:ring-[#352481]"
                      style={{ ...inputStyle, height: "40px" }}
                    >
                      <SelectValue placeholder="اختر..." />
                    </SelectTrigger>
                    <SelectContent
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                    >
                      <SelectItem value="public">عام</SelectItem>
                      <SelectItem value="internal">داخلي</SelectItem>
                      <SelectItem value="confidential">سري</SelectItem>
                      <SelectItem value="top-secret">سري للغاية</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="اللغة">
                  <Input
                    id="doc-lang"
                    type="text"
                    value={form.language}
                    onChange={set("language")}
                    style={inputStyle}
                    className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  />
                </Field>
                <Field label="الحقوق">
                  <Input
                    id="doc-rights"
                    type="text"
                    placeholder="حقوق النشر والملكية"
                    value={form.rights}
                    onChange={set("rights")}
                    style={inputStyle}
                    className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Dropzone + AI card — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Dropzone */}
            <div
              className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[280px]"
              style={{
                backgroundColor: dragging ? "#ebe6ef" : "#f7f2fb",
                borderColor: dragging ? "#352481" : "#c9c4d3",
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={onFileChange}
              />

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(76,61,153,0.12)" }}
              >
                <CloudUpload className="w-8 h-8" style={{ color: "#352481" }} />
              </div>

              {droppedFile ? (
                <>
                  <h3
                    className="font-semibold mb-1"
                    style={{
                      color: "#086b53",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: "18px",
                    }}
                  >
                    {droppedFile.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "#484551",
                      fontFamily: "'Noto Sans', sans-serif",
                    }}
                  >
                    {(droppedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-xs flex items-center gap-1"
                    style={{
                      color: "#ba1a1a",
                      fontFamily: "'Noto Sans', sans-serif",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDroppedFile(null);
                    }}
                  >
                    <X className="w-3 h-3" /> إزالة الملف
                  </button>
                </>
              ) : (
                <>
                  <h3
                    className="font-semibold mb-1"
                    style={{
                      color: "#1c1b21",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: "18px",
                    }}
                  >
                    اسحب وأفلت الملف هنا
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{
                      color: "#484551",
                      fontFamily: "'Noto Sans', sans-serif",
                    }}
                  >
                    أو انقر لاختيار ملف من جهازك
                  </p>
                  <p
                    className="text-xs mb-4"
                    style={{
                      color: "#797583",
                      fontFamily: "'Noto Sans', sans-serif",
                    }}
                  >
                    الصيغ المدعومة: PDF, DOCX (الحد الأقصى: 50MB)
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f1ecf5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffffff")
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    استعراض الملفات
                  </button>
                </>
              )}
            </div>

            {/* AI card */}
            <div
              className="rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden border"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201,196,211,0.35)",
                borderTop: "4px solid #BA7517",
                boxShadow: "0 2px 8px rgba(28,27,33,0.05)",
              }}
            >
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full pointer-events-none"
                style={{
                  backgroundColor: "rgba(186,117,23,0.06)",
                  filter: "blur(20px)",
                }}
              />
              <Sparkles className="w-7 h-7 mb-3" style={{ color: "#BA7517" }} />
              <h4
                className="font-semibold mb-2"
                style={{
                  color: "#1c1b21",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "18px",
                }}
              >
                الاستخلاص الذكي
              </h4>
              <p
                className="text-sm mb-5"
                style={{
                  color: "#484551",
                  fontFamily: "'Noto Sans', sans-serif",
                  lineHeight: "20px",
                }}
              >
                دع النظام يقرأ الوثيقة ويستخرج البيانات الوصفية الأساسية
                تلقائياً لتوفير الوقت.
              </p>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-sm transition-colors text-sm font-medium active:scale-95"
                style={{
                  backgroundColor: "#086b53",
                  color: "#ffffff",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0f6e56")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#086b53")
                }
              >
                <Sparkles className="w-4 h-4" />
                تصنيف تلقائي بالذكاء الاصطناعي
              </button>
            </div>
          </div>
        </div>

        {/* Sticky action bar */}
        <div
          className="mt-6 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky bottom-6 z-30 border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(201,196,211,0.35)",
            boxShadow: "0 4px 16px rgba(28,27,33,0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <Info
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#797583" }}
            />
            <span
              className="text-sm"
              style={{
                color: "#484551",
                fontFamily: "'Noto Sans', sans-serif",
              }}
            >
              تأكد من مراجعة البيانات قبل الحفظ النهائي في الأرشيف.
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "#1c1b21",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1ecf5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-8 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
              style={{
                backgroundColor: "#352481",
                color: "#ffffff",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4c3d99")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#352481")
              }
            >
              <Save className="w-4 h-4" />
              رفع الوثيقة
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
