import { supabase } from "../lib/supabase";

/**
 * Fetch expenses for a month
 */
export async function getExpensesByMonth(startISO, endISO) {
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      amount,
      description,
      expense_date,
      tag_id,
      tags (
        name,
        color
      )
    `)
    .gte("expense_date", startISO)
    .lte("expense_date", endISO)
    .order("expense_date", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Add expense
 */
export async function addExpense(payload) {
  const { error } = await supabase
    .from("expenses")
    .insert(payload);

  if (error) throw error;
}

/**
 * Update expense
 */
export async function updateExpense(id, payload) {
  const { error } = await supabase
    .from("expenses")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

/**
 * Delete expense
 */
export async function deleteExpense(id) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
