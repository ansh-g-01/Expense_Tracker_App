import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getTags } from "../services/tags";
import { addExpense } from "../services/expenses";

export default function ExpenseForm({ selectedMonth, onExpenseAdded }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [tagId, setTagId] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    dayjs().format("YYYY-MM-DDTHH:mm")
  );

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      const data = await getTags();
      setTags(data || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      await addExpense({
        amount: parseFloat(amount),
        description: description.trim() || null,
        tag_id: tagId || null,
        expense_date: dayjs(expenseDate).toISOString(),
      });

      // Clear form
      setAmount("");
      setDescription("");
      setTagId("");
      setExpenseDate(dayjs().format("YYYY-MM-DDTHH:mm"));

      // Notify parent to refresh
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">
        Add Expense
      </h3>

      <form className="grid grid-cols-1 sm:grid-cols-4 gap-4" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
          min="0.01"
        />

        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
        >
          <option value="">Select Tag (Optional)</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="border p-2 rounded"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />

        <button
          type="submit"
          className="sm:col-span-4 bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
