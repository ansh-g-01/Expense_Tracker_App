import { supabase } from "../lib/supabase";

/**
 * Get budget for month
 */
export async function getBudget(monthDate) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", monthDate)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

/**
 * Upsert budget
 */
export async function upsertBudget(monthDate, amount) {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to set budgets");
  }

  const { error } = await supabase
    .from("budgets")
    .upsert({
      month: monthDate,
      amount,
      user_id: user.id
    }, {
      onConflict: 'month,user_id'  // Updated to include user_id in conflict resolution
    });

  if (error) throw error;
}
