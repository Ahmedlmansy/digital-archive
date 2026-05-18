import { supabase } from "@/supabase/client";

// ── OCR ──────────────────────────────────────────────────────────────────────
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

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

// ── AI Analyze (Groq via Supabase Edge Function) ─────────────────────────────
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

// ── Upload Document ───────────────────────────────────────────────────────────
export const uploadDocument = async ({
  file,
  fileType,
  form,
  aiSummary,
  aiTags,
  userId,
}) => {
  // 1. Resolve category_id from name
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
