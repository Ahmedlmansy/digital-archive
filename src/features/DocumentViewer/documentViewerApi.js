import { supabase } from "@/supabase/client";

export const documentViewerApi = {
  async getDocumentById(id) {
    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        *,
        categories (
          name_ar
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },


  async getSignedUrl(filePath) {
    const { data, error } = await supabase.storage
      .from("documents") 
      .createSignedUrl(filePath, 3600); // صالح لمدة ساعة

    if (error) throw error;
    return data.signedUrl;
  },


  async incrementViewCount(id, currentCount) {
    const { error } = await supabase
      .from("documents")
      .update({ view_count: currentCount + 1 })
      .eq("id", id);

    if (error) throw error;
  },

  // تسجيل النشاط في سجل العمليات
  async logActivity(userId, docId, action) {
    await supabase.from("activity_log").insert({
      user_id: userId,
      document_id: docId,
      action: action,
    });
  },
};
