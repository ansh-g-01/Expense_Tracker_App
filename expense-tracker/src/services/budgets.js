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
  const { error } = await supabase
    .from("budgets")
    .upsert({
      month: monthDate,
      amount
    }, {
      onConflict: 'month'  // Specify the unique constraint column
    });

  if (error) throw error;
}
