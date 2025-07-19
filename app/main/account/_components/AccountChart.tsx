"use client";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "1Y": { label: "Last 1 Year", days: 365 },
  ALL: { label: "All time", days: null },
};
const PIE_COLORS = [
  "#8b5cf6", "#6d28d9", "#a78bfa", "#5b21b6",
  "#3b0764", "#6366f1", "#ede9fe", "#312e81",
];

const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("1M");

  // Time-grouped
  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));
    const filtered = transactions.filter(
      (t) =>
        new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );
    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  // Overall totals
  const total = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // Expenses by category for pie/legend/bar
  const pieData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));
    const filteredExpenses = transactions.filter(
      (t) =>
        t.type === "EXPENSE" &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endOfDay(now)
    );
    const grouped = filteredExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([category, value]) => ({
      category,
      value,
    }));
  }, [transactions, dateRange]);

  // Horizontal bar (big, right): top expense categories
  const sortedExpenses = useMemo(() => {
    return [...pieData].sort((a, b) => b.value - a.value).slice(0, 7);
  }, [pieData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Transactions Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* BAR CHART: Large and easy to read */}
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={filteredData}
            margin={{
              top: 8,
              right: 40,
              left: 12,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="income"
              fill="green"
              name="Income"
              activeBar={<Rectangle fill="green" stroke="#b4b8ee" />}
            />
            <Bar
              dataKey="expense"
              fill="#8b5cf6"
              name="Expense"
              activeBar={<Rectangle fill="#ede9fe" stroke="#8b5cf6" />}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-row gap-8 text-sm md:text-base">
          <div>
            Income: <span className="font-semibold text-indigo-600">
              ₹{total.income.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span>
          </div>
          <div>
            Expenses: <span className="font-semibold text-purple-700">
              ₹{total.expense.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span>
          </div>
        </div>

        {/* Two-column analytics area */}
        <div className="mt-16 flex flex-col md:flex-row gap-14 items-start justify-between w-full">
          {/* LEFT: Pie Chart */}
          <div className="w-full md:w-[340px] flex flex-col items-center">
            <h4 className="font-semibold text-base text-gray-800 mb-3">
              Expenses by Category
            </h4>
            {pieData.length ? (
              <ResponsiveContainer width={260} height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={46}
                    paddingAngle={2}
                    // Custom label that shows percentage, rounded to 1 decimal place
                    label={({ value, percent }) =>
                        `${(percent * 100).toFixed(1)}%`
                    }
                    >
                    {pieData.map((entry, idx) => (
                        <Cell
                        key={entry.category}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                    ))}
                    </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 mt-3">
                No expense data for this period.
              </div>
            )}
            <ul className="w-full mt-8 space-y-2">
              {pieData.map((entry, idx) => (
                <li
                  key={entry.category}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#f7f4fd] transition"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="capitalize font-medium">{entry.category}</span>
                  </span>
                  <span className="text-violet-700 font-semibold">
                    ₹{Number(entry.value).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </li>
              ))}
              {!pieData.length && (
                <li className="text-gray-400 py-4 pl-2">No categories this period.</li>
              )}
            </ul>
          </div>

          {/* RIGHT: Horizontal Bar Chart - Top Expense Trends */}
          <div className="flex-1 w-full max-w-2xl mt-10 md:mt-0">
            <h4 className="font-semibold text-base text-gray-800 mb-3">
              Top Categories (By Total Expense)
            </h4>
            {sortedExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={sortedExpenses}
                  layout="vertical"
                  margin={{ top: 12, right: 16, left: 22, bottom: 12 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 14 }} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    barSize={28}
                    radius={[6, 6, 6, 6]}
                  >
                    {sortedExpenses.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 pl-2 mt-6">No expense trends for this period.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
