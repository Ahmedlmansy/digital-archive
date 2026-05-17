import { supabase } from "@/supabase/client";

export const registerUser = async ({ fullName, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

export const getCurrentSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
};
