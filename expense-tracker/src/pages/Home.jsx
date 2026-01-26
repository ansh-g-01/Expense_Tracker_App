import { useState } from "react";
import dayjs from "dayjs";

import BudgetSummary from "../components/BudgetSummary";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthSwitcher from "../components/MonthSwitcher";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    // Trigger refresh by incrementing key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <MonthSwitcher
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <BudgetSummary selectedMonth={selectedMonth} refreshKey={refreshKey} />

      <ExpenseForm
        selectedMonth={selectedMonth}
        onExpenseAdded={handleExpenseAdded}
      />

      <ExpenseList
        selectedMonth={selectedMonth}
        refreshKey={refreshKey}
      />
    </div>
  );
}
