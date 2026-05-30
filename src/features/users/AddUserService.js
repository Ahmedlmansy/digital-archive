import { supabase } from "@/supabase/client";


export const registerNewUser = async ({
  email,
  password,
  fullName,
  role,
  phone,
  status = "active",
}) => {
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
