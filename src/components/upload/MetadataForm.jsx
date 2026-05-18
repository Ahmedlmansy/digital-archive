import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

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

const sectionHeadStyle = {
  color: "#352481",
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label style={labelStyle}>
        {label} {required && <span style={{ color: "#ba1a1a" }}>*</span>}
      </Label>
      {children}
      {hint && (
        <p style={{ color: "#797583", fontFamily: "'Noto Sans', sans-serif", fontSize: "12px" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span style={sectionHeadStyle}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,196,211,0.5)" }} />
    </div>
  );
}

// ── constants ────────────────────────────────────────────────────────────────
// values must match the `name` column in public.categories
const CATEGORIES = [
  { value: "administrative", label: "إدارية" },
  { value: "legal",          label: "قانونية" },
  { value: "historical",     label: "تاريخية" },
  { value: "scientific",     label: "علمية" },
  { value: "correspondence", label: "مراسلات" },
  { value: "financial",      label: "مالية" },
];

const LANGUAGES = [
  { value: "ar",    label: "العربية" },
  { value: "en",    label: "الإنجليزية" },
  { value: "fr",    label: "الفرنسية" },
  { value: "other", label: "أخرى" },
];

const DOC_TYPES = [
  { value: "Text",           label: "نص" },
  { value: "Image",          label: "صورة" },
  { value: "PhysicalObject", label: "كائن مادي" },
  { value: "Collection",     label: "مجموعة" },
  { value: "Dataset",        label: "بيانات" },
];

// ── component ────────────────────────────────────────────────────────────────
export function MetadataForm({ form, onChange, disabled }) {
  const set    = (field) => (e)   => onChange(field, e.target.value);
  const setVal = (field) => (val) => onChange(field, val);

  return (
    <div className="flex flex-col gap-4">

      {/* ── SECTION 1: Core ── */}
      <SectionDivider title="البيانات الأساسية" />

      {/* dc_title — required */}
      <Field label="العنوان" required>
        <Input
          type="text"
          placeholder="أدخل عنوان الوثيقة الرئيسي"
          value={form.title}
          onChange={set("title")}
          required
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* dc_identifier */}
      <Field label="رقم الأرشيف / المعرّف الفريد" hint="مثال: DOC-2024-001">
        <Input
          type="text"
          placeholder="رقم الأرشيف أو المعرف الفريد"
          value={form.identifier}
          onChange={set("identifier")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* dc_creator + dc_contributor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="المؤلف / الجهة المنشئة" hint="dc:creator">
          <Input
            type="text"
            placeholder="اسم الكاتب أو الجهة المنشئة"
            value={form.creator}
            onChange={set("creator")}
            disabled={disabled}
            style={inputStyle}
            className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
          />
        </Field>
        <Field label="مساهمون آخرون" hint="dc:contributor">
          <Input
            type="text"
            placeholder="أسماء مفصولة بفاصلة"
            value={form.contributor}
            onChange={set("contributor")}
            disabled={disabled}
            style={inputStyle}
            className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
          />
        </Field>
      </div>

      {/* dc_subject */}
      <Field label="الموضوع / الكلمات المفتاحية" hint="dc:subject">
        <Input
          type="text"
          placeholder="كلمات مفتاحية مفصولة بفاصلة"
          value={form.subject}
          onChange={set("subject")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* dc_description */}
      <Field label="الوصف / الملخص" hint="dc:description">
        <Textarea
          placeholder="ملخص أو وصف تفصيلي لمحتوى الوثيقة..."
          rows={4}
          value={form.description}
          onChange={set("description")}
          disabled={disabled}
          className="resize-none transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
          style={inputStyle}
        />
      </Field>

      {/* ── SECTION 2: Publication ── */}
      <SectionDivider title="بيانات النشر" />

      {/* dc_publisher + dc_date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="الناشر / الجهة الحافظة" hint="dc:publisher">
          <Input
            type="text"
            placeholder="الجهة المصدرة أو الناشرة"
            value={form.publisher}
            onChange={set("publisher")}
            disabled={disabled}
            style={inputStyle}
            className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
          />
        </Field>
        <Field label="تاريخ الوثيقة الأصلية" hint="dc:date">
          <div className="relative">
            <CalendarDays
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#797583" }}
            />
            <Input
              type="date"
              value={form.date}
              onChange={set("date")}
              disabled={disabled}
              style={{ ...inputStyle, paddingLeft: "40px" }}
              className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
            />
          </div>
        </Field>
      </div>

      {/* dc_source */}
      <Field label="المصدر الأصلي" hint="dc:source — المستودع أو المجموعة الأصلية">
        <Input
          type="text"
          placeholder="مثال: دار المحفوظات الوطنية"
          value={form.source}
          onChange={set("source")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* ── SECTION 3: Classification ── */}
      <SectionDivider title="التصنيف والنطاق" />

      {/* category + dc_type + dc_language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="التصنيف الموضوعي">
          <Select value={form.classification} onValueChange={setVal("classification")} disabled={disabled}>
            <SelectTrigger style={{ ...inputStyle, height: "40px" }} className="focus:ring-1 focus:ring-[#352481]">
              <SelectValue placeholder="اختر..." />
            </SelectTrigger>
            <SelectContent style={{ fontFamily: "'Noto Sans', sans-serif" }}>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="نوع المورد" hint="dc:type">
          <Select value={form.docType} onValueChange={setVal("docType")} disabled={disabled}>
            <SelectTrigger style={{ ...inputStyle, height: "40px" }} className="focus:ring-1 focus:ring-[#352481]">
              <SelectValue placeholder="اختر..." />
            </SelectTrigger>
            <SelectContent style={{ fontFamily: "'Noto Sans', sans-serif" }}>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="اللغة" hint="dc:language">
          <Select value={form.language} onValueChange={setVal("language")} disabled={disabled}>
            <SelectTrigger style={{ ...inputStyle, height: "40px" }} className="focus:ring-1 focus:ring-[#352481]">
              <SelectValue placeholder="اختر..." />
            </SelectTrigger>
            <SelectContent style={{ fontFamily: "'Noto Sans', sans-serif" }}>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* dc_coverage */}
      <Field label="النطاق الجغرافي / الزمني" hint="dc:coverage — مثال: مصر، القاهرة، 1952–1970">
        <Input
          type="text"
          placeholder="المنطقة الجغرافية أو الحقبة الزمنية"
          value={form.coverage}
          onChange={set("coverage")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* dc_relation */}
      <Field label="علاقة بوثائق أخرى" hint="dc:relation — رقم وثيقة مرتبطة أو رابط">
        <Input
          type="text"
          placeholder="مثال: DOC-2024-002"
          value={form.relation}
          onChange={set("relation")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

      {/* ── SECTION 4: Rights ── */}
      <SectionDivider title="حقوق الملكية" />

      <Field label="حقوق الملكية والاستخدام" hint="dc:rights">
        <Input
          type="text"
          placeholder="All rights reserved"
          value={form.rights}
          onChange={set("rights")}
          disabled={disabled}
          style={inputStyle}
          className="transition-all focus-visible:ring-1 focus-visible:ring-[#352481]"
        />
      </Field>

    </div>
  );
}
