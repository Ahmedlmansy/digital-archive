import { supabase } from "@/supabase/client";


/**
 */
export const fetchUsers = async ({
  query = "",
  role = null,
  status = null,
  page = 1,
  limit = 10,
}) => {
  const { data, error } = await supabase.rpc("get_all_profiles", {
    search_query: query,
    filter_role: role,
    filter_status: status,
    page_num: page,
    page_limit: limit,
  });

  if (error) throw error;

  return {
    data: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.total_pages || 1,
  };
};

/**
 * 
 */
export const updateUserRole = async (userId, newRole) => {
  const { data, error } = await supabase.rpc("update_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

  if (error) throw error;
  return data;
};

/**
 */
export const updateUserStatus = async (userId, newStatus) => {
  const { data, error } = await supabase.rpc("update_user_status", {
    target_user_id: userId,
    new_status: newStatus,
  });

  if (error) throw error;
  return data;
};

/**
 */
export const deleteUser = async (userId) => {
  const { data, error } = await supabase.rpc("delete_user_profile", {
    target_user_id: userId,
  });

  if (error) throw error;
  return data;
};

/**
 */
export const bulkDeleteUsers = async (userIds) => {
  const { data, error } = await supabase.rpc("bulk_delete_users", {
    user_ids: userIds,
  });

  if (error) throw error;
  return data; 
};


// CATEGORIES 

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_ar", { ascending: true });

  if (error) throw error;
  return data || [];
};
