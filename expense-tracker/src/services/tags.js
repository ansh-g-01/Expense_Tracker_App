import { supabase } from "../lib/supabase";

/**
 * Fetch tags
 */
export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

/**
 * Create tag
 */
export async function createTag(payload) {
  const { error } = await supabase
    .from("tags")
    .insert(payload);

  if (error) throw error;
}

/**
 * Delete tag (only if unused)
 */
export async function deleteTag(tagId) {
  const { count, error: countError } = await supabase
    .from("expenses")
    .select("*", { count: "exact", head: true })
    .eq("tag_id", tagId);

  if (countError) throw countError;

  if (count > 0) {
    throw new Error(
      "This tag is used in existing expenses and cannot be deleted."
    );
  }

  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tagId);

  if (error) throw error;
}
