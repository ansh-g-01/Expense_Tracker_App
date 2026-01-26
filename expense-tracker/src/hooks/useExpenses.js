import { useEffect, useState } from "react";
import { getExpensesByMonth } from "../services/expenses";

/**
 * Custom hook to fetch expenses for a given month
 */
export function useExpenses(selectedMonth) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const startOfMonth = selectedMonth.startOf("month").toISOString();
      const endOfMonth = selectedMonth.endOf("month").toISOString();

      const data = await getExpensesByMonth(startOfMonth, endOfMonth);
      setExpenses(data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
  };
}
