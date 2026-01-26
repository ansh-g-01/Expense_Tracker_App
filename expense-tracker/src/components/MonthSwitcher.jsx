import dayjs from "dayjs";

export default function MonthSwitcher({ selectedMonth, setSelectedMonth }) {
  const now = dayjs();
  const twoMonthsAgo = now.subtract(2, "month").startOf("month");

  // Check if we can go previous (not older than 2 months ago)
  const canGoPrevious = selectedMonth.isAfter(twoMonthsAgo, "month");

  // Check if we can go next (not into future)
  const canGoNext = selectedMonth.isBefore(now, "month");

  return (
    <div className="flex items-center justify-between">
      <button
        className={`px-3 py-1 border rounded ${canGoPrevious
            ? "hover:bg-gray-100"
            : "opacity-50 cursor-not-allowed"
          }`}
        onClick={() => {
          if (canGoPrevious) {
            setSelectedMonth(selectedMonth.subtract(1, "month"));
          }
        }}
        disabled={!canGoPrevious}
      >
        ← Previous
      </button>

      <h2 className="text-lg font-semibold">
        {selectedMonth.format("MMMM YYYY")}
      </h2>

      <button
        className={`px-3 py-1 border rounded ${canGoNext
            ? "hover:bg-gray-100"
            : "opacity-50 cursor-not-allowed"
          }`}
        onClick={() => {
          if (canGoNext) {
            setSelectedMonth(selectedMonth.add(1, "month"));
          }
        }}
        disabled={!canGoNext}
      >
        Next →
      </button>
    </div>
  );
}
