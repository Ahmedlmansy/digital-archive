import { supabase } from "@/supabase/client";

/**
 * تسجيل مستخدم جديد في Supabase Auth
 * الـ trigger هينشئ الـ profile تلقائياً
 */
export const registerNewUser = async ({
  email,
  password,
  fullName,
  role,
  phone,
  status = "active",
}) => {
  // 1. إنشاء حساب في Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role || "visitor",
      },
    },
  });

  if (authError) throw authError;

  // 2. التريجر هينشئ الـ profile تلقائياً
  // بس نتأكد إن الـ status و phone متضافين
  if (authData?.user?.id) {
    const updates = {};
    if (status) updates.status = status;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", authData.user.id);

      if (updateError) {
        console.warn("Failed to update profile:", updateError.message);
      }
    }
  }

  return authData;
};
