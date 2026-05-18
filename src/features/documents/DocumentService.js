import { supabase } from "@/supabase/client";

// ═══════════════════════════════════════════════════════════════
// OCR — استخراج النص من الملفات
// ═══════════════════════════════════════════════════════════════
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// تعديل مهم لـ Vite: استخدام worker من node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function extractFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return fullText.trim();
}

async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export const extractTextFromFile = async (file) => {
  const ext = file.name.split(".").pop().toLowerCase();
  const mime = file.type;

  if (ext === "pdf" || mime === "application/pdf") {
    const text = await extractFromPdf(file);
    return { text, fileType: "PDF" };
  }

  if (
    ext === "docx" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const text = await extractFromDocx(file);
    return { text, fileType: "DOCX" };
  }

  throw new Error("صيغة الملف غير مدعومة — يرجى رفع PDF أو DOCX");
};

// ═══════════════════════════════════════════════════════════════
// AI Analysis — Groq via Supabase Edge Function
// ═══════════════════════════════════════════════════════════════
export const analyzeDocumentWithAi = async (ocrText) => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ ocrText }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return await res.json();
};

// ═══════════════════════════════════════════════════════════════
// FETCH DOCUMENTS — جلب الوثائق مع البحث والفلترة والتصفح
// ═══════════════════════════════════════════════════════════════

/**
 * جلب الوثائق مع دعم البحث والفلترة والـ Pagination
 * @param {Object} params
 * @param {string} params.query — نص البحث (title, description, subject)
 * @param {string} params.status — active | archived | draft
 * @param {number} params.categoryId — تصنيف معين
 * @param {string} params.dateFrom — تاريخ بداية (YYYY-MM-DD)
 * @param {string} params.dateTo — تاريخ نهاية
 * @param {number} params.page — رقم الصفحة (يبدأ من 1)
 * @param {number} params.limit — عدد العناصر بالصفحة (default 10)
 * @param {string} params.sortBy — ترتيب حسب (created_at | dc_date | dc_title)
 * @param {string} params.sortOrder — asc | desc
 */
export const fetchDocuments = async ({
  query = "",
  status = null,
  categoryId = null,
  dateFrom = null,
  dateTo = null,
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
}) => {
  let dbQuery = supabase.from("documents").select(
    `*,
      categories:category_id ( id, name, name_ar )`,
    { count: "exact" },
  );

  // ── البحث بالنص ─────────────────────────────────────────────
  if (query && query.trim()) {
    // استخدام الـ Full Text Search اللي عامله في الـ Schema
    const { data, error } = await supabase.rpc("search_documents", {
      query: query.trim(),
    });
    if (error) throw error;
    // لأن RPC بيرجع array، هنحتاج نعمل pagination يدوي
    const total = data?.length || 0;
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: data?.slice(start, end) || [],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── الفلاتر ──────────────────────────────────────────────────
  if (status) {
    dbQuery = dbQuery.eq("status", status);
  }
  if (categoryId) {
    dbQuery = dbQuery.eq("category_id", categoryId);
  }
  if (dateFrom) {
    dbQuery = dbQuery.gte("dc_date", dateFrom);
  }
  if (dateTo) {
    dbQuery = dbQuery.lte("dc_date", dateTo);
  }

  // ── الترتيب والتصفح ──────────────────────────────────────────
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  dbQuery = dbQuery
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  const { data, error, count } = await dbQuery;

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
};

// ═══════════════════════════════════════════════════════════════
// UPLOAD DOCUMENT — رفع وثيقة جديدة
// ═══════════════════════════════════════════════════════════════
export const uploadDocument = async ({
  file,
  fileType,
  form,
  aiSummary,
  aiTags,
  userId,
}) => {
  // 1. Resolve category_id من الاسم
  let categoryId = null;
  if (form.classification) {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("name", form.classification)
      .single();
    categoryId = data?.id ?? null;
  }

  // 2. Upload file to Storage
  const ext = file.name.split(".").pop().toLowerCase();
  const filePath = `${userId}/${Date.now()}.${ext}`;

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(filePath, file, { upsert: false });

  if (storageError) throw storageError;

  // 3. Insert document record
  const { data, error: dbError } = await supabase
    .from("documents")
    .insert({
      dc_title: form.title,
      dc_creator: form.creator || null,
      dc_subject: form.subject || null,
      dc_description: form.description || null,
      dc_publisher: form.publisher || null,
      dc_contributor: form.contributor || null,
      dc_date: form.date || null,
      dc_type: form.docType || "Text",
      dc_format: fileType || null,
      dc_identifier: form.identifier || null,
      dc_source: form.source || null,
      dc_language: form.language || "ar",
      dc_relation: form.relation || null,
      dc_coverage: form.coverage || null,
      dc_rights: form.rights || "All rights reserved",
      category_id: categoryId,
      file_path: filePath,
      file_size: file.size,
      ai_summary: aiSummary || null,
      ai_tags: aiTags?.length ? aiTags : null,
      status: "active",
      uploaded_by: userId,
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return data;
};

// ═══════════════════════════════════════════════════════════════
// DELETE DOCUMENT — حذف وثيقة
// ═══════════════════════════════════════════════════════════════
export const deleteDocument = async (docId, filePath) => {
  // حذف من Storage الأول
  if (filePath) {
    await supabase.storage.from("documents").remove([filePath]);
  }
  // حذف من DB
  const { error } = await supabase.from("documents").delete().eq("id", docId);
  if (error) throw error;
  return true;
};

// ═══════════════════════════════════════════════════════════════
// FETCH CATEGORIES — جلب التصنيفات
// ═══════════════════════════════════════════════════════════════
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_ar", { ascending: true });

  if (error) throw error;
  return data || [];
};
