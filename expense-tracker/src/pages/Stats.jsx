import { useState } from "react";
import dayjs from "dayjs";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import MonthSwitcher from "../components/MonthSwitcher";
import { useExpenses } from "../hooks/useExpenses";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Stats() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const { expenses, loading } = useExpenses(selectedMonth);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  // Calculate daily spending
  const dailySpending = {};
  const daysInMonth = selectedMonth.daysInMonth();

  // Initialize all days to 0
  for (let i = 1; i <= daysInMonth; i++) {
    dailySpending[i] = 0;
  }

  // Aggregate expenses by day
  expenses.forEach((expense) => {
    const day = dayjs(expense.expense_date).date();
    dailySpending[day] = (dailySpending[day] || 0) + parseFloat(expense.amount);
  });

  // Calculate category-wise spending
  const categorySpending = {};
  expenses.forEach((expense) => {
    const tagName = expense.tags?.name || "Uncategorized";
    const tagColor = expense.tags?.color || "#6B7280";

    if (!categorySpending[tagName]) {
      categorySpending[tagName] = {
        amount: 0,
        color: tagColor,
      };
    }
    categorySpending[tagName].amount += parseFloat(expense.amount);
  });

  // Calculate summary stats
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map(e => parseFloat(e.amount)))
    : 0;

  // Daily spending chart data
  const dailyChartData = {
    labels: Object.keys(dailySpending),
    datasets: [
      {
        label: "Daily Spending (₹)",
        data: Object.values(dailySpending),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹ ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  // Category-wise chart data
  const categoryLabels = Object.keys(categorySpending);
  const categoryData = categoryLabels.map(label => categorySpending[label].amount);
  const categoryColors = categoryLabels.map(label => categorySpending[label].color);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Spending by Category",
        data: categoryData,
        backgroundColor: categoryColors,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const percentage = ((value / totalSpent) * 100).toFixed(1);
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Statistics & Analytics</h2>
        <p className="text-gray-600">Visual insights into your spending patterns</p>
      </div>

      <MonthSwitcher selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold">₹ {totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Average Expense</p>
          <p className="text-2xl font-bold">₹ {averageExpense.toFixed(2)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <p className="text-gray-500">No expenses for this month. Add some expenses to see analytics!</p>
        </div>
      ) : (
        <>
          {/* Daily Spending Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Daily Spending</h3>
            <div style={{ height: "300px" }}>
              <Bar data={dailyChartData} options={dailyChartOptions} />
            </div>
          </div>

          {/* Category-wise Spending Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <div className="flex justify-center" style={{ height: "300px" }}>
              <Pie data={categoryChartData} options={categoryChartOptions} />
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <div className="space-y-2">
              {Object.entries(categorySpending)
                .sort((a, b) => b[1].amount - a[1].amount)
                .map(([name, data]) => (
                  <div key={name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className="text-gray-600">
                      ₹ {data.amount.toFixed(2)} ({((data.amount / totalSpent) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
