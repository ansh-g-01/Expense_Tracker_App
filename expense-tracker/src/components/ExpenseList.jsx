import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useExpenses } from "../hooks/useExpenses";
import { deleteExpense } from "../services/expenses";

export default function ExpenseList({ selectedMonth, refreshKey }) {
  const { expenses, loading, error, refresh } = useExpenses(selectedMonth);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      refresh();
    }
  }, [refreshKey]);

  async function handleDelete(id) {
    try {
      setDeleting(true);
      await deleteExpense(id);
      setDeleteConfirm(null);
      refresh();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense: " + err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        Loading expenses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg border text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">
          Expenses
        </h3>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No expenses for this month.
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">
                    ₹ {expense.amount}
                  </p>

                  <p className="text-sm text-gray-500">
                    {expense.description || "—"}{" "}
                    {expense.tags && (
                      <>
                        •{" "}
                        <span
                          className="font-medium"
                          style={{ color: expense.tags.color }}
                        >
                          {expense.tags.name}
                        </span>
                      </>
                    )}
                    {" • "}
                    {dayjs(expense.expense_date).format(
                      "DD MMM YYYY, h:mm A"
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="text-blue-600 text-sm hover:underline">
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-sm hover:underline"
                    onClick={() => setDeleteConfirm(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Expense</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
