"use client";

import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getExpensesByCategory } from "@/actions/dashboard-charts";

// Register necessary chart.js components once
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesByCategoryChart({ accountId }: { accountId: string }) {
  const [data, setData] = useState<{ category: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    getExpensesByCategory(accountId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [accountId]);

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: "Expenses",
        data: data.map(d => d.value),
        backgroundColor: [
          "#8b5cf6", "#5b21b6", "#22c55e", "#3b0764", "#6d28d9",
          "#a78bfa", "#ede9fe", "#312e81",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Display loading or empty UI for clean UX
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md flex items-center justify-center min-h-[240px] text-gray-500">
        Loading...
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md flex items-center justify-center min-h-[240px] text-gray-500">
        No expenses for this account.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Expenses by Category</h3>
      <Pie data={chartData} />
    </div>
  );
}
