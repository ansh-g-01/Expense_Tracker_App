import { useState, useEffect } from "react";
import { getBudget, upsertBudget } from "../services/budgets";
import { useExpenses } from "../hooks/useExpenses";

export default function BudgetSummary({ selectedMonth, refreshKey }) {
  const [budget, setBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [saving, setSaving] = useState(false);

  const { expenses, loading: expensesLoading } = useExpenses(selectedMonth);

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth]);

  // Recalculate when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      // Budget will auto-recalculate via expenses dependency
    }
  }, [refreshKey]);

  async function fetchBudget() {
    try {
      const monthDate = selectedMonth.startOf("month").format("YYYY-MM-DD");
      const data = await getBudget(monthDate);
      if (data) {
        setBudget(data.amount);
        setBudgetInput(data.amount.toString());
      } else {
        setBudget(null);
        setBudgetInput("");
      }
    } catch (err) {
      console.error("Error fetching budget:", err);
    }
  }

  async function handleBudgetSave() {
    const amount = parseFloat(budgetInput);

    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid budget amount");
      return;
    }

    try {
      setSaving(true);
      const monthDate = selectedMonth.startOf("month").format("YYYY-MM-DD");
      await upsertBudget(monthDate, amount);
      setBudget(amount);
    } catch (err) {
      console.error("Error saving budget:", err);
      alert("Failed to save budget: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // Calculate total spent
  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const remaining = budget ? budget - totalSpent : 0;
  const isOverBudget = budget && totalSpent > budget;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Budget
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter monthly budget"
            className="border p-2 rounded w-full sm:w-64"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onBlur={handleBudgetSave}
            step="0.01"
            min="0"
          />
          {saving && <span className="text-sm text-gray-500 self-center">Saving...</span>}
        </div>

        {!expensesLoading && (
          <>
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className={`font-semibold ${isOverBudget ? 'text-red-600' : ''}`}>
                  ₹ {totalSpent.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ₹ {remaining.toFixed(2)}
                </p>
              </div>

              {budget && (
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">₹ {budget.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {budget && budget > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  style={{ width: `${Math.min((totalSpent / budget) * 100, 100)}%` }}
                />
              </div>
            )}

            {isOverBudget && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ You've exceeded your budget by ₹ {Math.abs(remaining).toFixed(2)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
