"use client";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  BarChart, Bar, Rectangle,
  XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const DATE_RANGES = {
  "7D": { label: "Last 7 days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "1Y": { label: "Last 1 Year", days: 365 },
  ALL: { label: "All time", days: null },
};

const EXPENSE_PIE_COLORS = [
  "#8b5cf6", "#6d28d9", "#a78bfa", "#5b21b6",
  "#3b0764", "#6366f1", "#ede9fe", "#312e81",
];
const INCOME_PIE_COLORS = [
  "#16a34a", "#22c55e", "#4ade80", "#86efac",
  "#15803d", "#bbf7d0", "#166534"
];

const animation = {
  initial: { opacity: 0, y: 16 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.46, type: "spring" }
  }),
};

export default function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const [activeLegend, setActiveLegend] = useState({ type: null, idx: null });

  // --- DATA --- //
  const filteredTransactionsByDate = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));
    return transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );
  }, [transactions, dateRange]);

  const timeGroupedData = useMemo(() => {
    const grouped = filteredTransactionsByDate.reduce((acc, t) => {
      const date = format(new Date(t.date), "MMM dd");
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      if (t.type === "INCOME") acc[date].income += t.amount;
      else acc[date].expense += t.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );
  }, [filteredTransactionsByDate]);

  const total = useMemo(() => {
    return filteredTransactionsByDate.reduce(
      (acc, t) => {
        if (t.type === "INCOME") acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactionsByDate]);

  const expensePieData = useMemo(() => {
    const grouped = filteredTransactionsByDate
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return Object.entries(grouped).map(([category, value]) => ({ category, value }));
  }, [filteredTransactionsByDate]);
  const incomePieData = useMemo(() => {
    const grouped = filteredTransactionsByDate
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return Object.entries(grouped).map(([category, value]) => ({ category, value }));
  }, [filteredTransactionsByDate]);
  const sortedExpenses = useMemo(() => {
    return [...expensePieData].sort((a, b) => b.value - a.value).slice(0, 7);
  }, [expensePieData]);
  const expenseTotal = expensePieData.reduce((sum, d) => sum + d.value, 0);
  const incomeTotal = incomePieData.reduce((sum, d) => sum + d.value, 0);

  function getPercent(value, total) {
    if (!total) return "0%";
    return ((value / total) * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%";
  }

  return (
    <Card className="bg-gradient-to-br from-[#1f1930]/80 via-[#2f255c]/65 to-[#201a32]/90 border border-violet-700/20 shadow-2xl text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Transactions Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] bg-[#2c2357]/70 border-violet-700/40 text-violet-100 ring-0 focus:ring-violet-400">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent className="bg-[#231d3e] border-violet-800/40 text-violet-200">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Main Bar Chart */}
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={timeGroupedData} margin={{ top: 8, right: 40, left: 12, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b3360" />
            <XAxis dataKey="date" stroke="#c4aefc" />
            <YAxis tick={{ fill: "#b6bbcd", fontWeight: 700 }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: "#231d34",
                border: "1px solid #8b5cf6",
                borderRadius: 10,
                fontSize: "16px",
                color: "#fff"
              }}
              formatter={(value) => `₹${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              labelStyle={{ color: "#a78bfa", fontWeight: 600 }}
              cursor={{ fill: "#a78bfa22" }}
            />
            <Bar dataKey="income" fill="#22c55e" name="Income"
              activeBar={<Rectangle fill="#86efac" stroke="#16a34a" />} radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#8b5cf6" name="Expense"
              activeBar={<Rectangle fill="#c4b5fd" stroke="#8b5cf6" />} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {/* Animated summary bar */}
        <div className="mt-6 flex flex-row flex-wrap gap-8 text-lg md:text-xl justify-center">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 bg-[#232044]/70 rounded-xl shadow-inner text-green-300 font-bold"
          >
            Income: <span className="text-green-400">₹{total.income.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 bg-[#231d34]/70 rounded-xl shadow-inner text-pink-300 font-bold"
          >
            Expenses: <span className="text-pink-400">₹{total.expense.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </motion.div>
        </div>

        {/* --- LAYOUT: Two Pie Charts & Top Expense Horizontal Bar --- */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full">

          {/* LEFT: Expenses by Category (Pie) */}
          <motion.div className="flex flex-col items-center justify-center bg-[#19162c]/60 rounded-2xl p-5 shadow-lg">
            <h4 className="font-semibold text-base text-violet-100 mb-3">Expenses by Category</h4>
            {!!expensePieData.length ? (
              <>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%" cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      paddingAngle={1}
                      labelLine={false}
                      isAnimationActive
                      onMouseEnter={(_, idx) => setActiveLegend({ type: "expense", idx })}
                      onMouseLeave={() => setActiveLegend({ type: null, idx: null })}
                    >
                      {expensePieData.map((entry, idx) => (
                        <Cell key={entry.category}
                          fill={EXPENSE_PIE_COLORS[idx % EXPENSE_PIE_COLORS.length]}
                          stroke={activeLegend.type === "expense" && activeLegend.idx === idx ? "#FFF" : "#232044"}
                          strokeWidth={activeLegend.type === "expense" && activeLegend.idx === idx ? 4 : 1}
                          style={{
                            filter: activeLegend.type === "expense" && activeLegend.idx === idx ? "drop-shadow(0 0 12px #a78bfa88)" : undefined,
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                      contentStyle={{
                        background: "pink",
                        border: "1px solid #8b5cf6",
                        borderRadius: 12,
                        color: "white"
                      }}
                      labelStyle={{ color: "#a78bfa", fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="w-full mt-4 space-y-1">
                  <AnimatePresence>
                    {expensePieData.map((entry, idx) => (
                      <motion.li
                        key={`legend-expense-${idx}`}
                        initial={animation.initial}
                        animate={animation.animate(idx)}
                        exit={{ opacity: 0, y: 8 }}
                        onMouseEnter={() => setActiveLegend({ type: "expense", idx })}
                        onMouseLeave={() => setActiveLegend({ type: null, idx: null })}
                        className={`flex items-center justify-between py-1.5 px-2 text-sm font-medium rounded-md transition cursor-pointer
                          ${activeLegend.type === "expense" && activeLegend.idx === idx
                            ? "bg-purple-200/30 text-white"
                            : "bg-transparent text-violet-100"
                          }`
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ background: EXPENSE_PIE_COLORS[idx % EXPENSE_PIE_COLORS.length] }} />
                          <span className="capitalize">{entry.category}</span>
                        </span>
                        <span>
                          ₹{Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          <span className="ml-3 text-xs bg-violet-900/60 px-1.5 py-0.5 rounded-md font-normal">
                            {getPercent(entry.value, expenseTotal)}
                          </span>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </>
            ) : (
              <div className="text-gray-400 h-[190px] flex items-center">No expense data.</div>
            )}
          </motion.div>

          {/* RIGHT: Income by Category Pie */}
          <motion.div className="flex flex-col items-center justify-center bg-[#19162c]/60 rounded-2xl p-5 shadow-lg">
            <h4 className="font-semibold text-base text-emerald-100 mb-3">Income by Category</h4>
            {!!incomePieData.length ? (
              <>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      paddingAngle={1}
                      labelLine={false}
                      isAnimationActive
                      onMouseEnter={(_, idx) => setActiveLegend({ type: "income", idx })}
                      onMouseLeave={() => setActiveLegend({ type: null, idx: null })}
                    >
                      {incomePieData.map((entry, idx) => (
                        <Cell key={entry.category}
                          fill={INCOME_PIE_COLORS[idx % INCOME_PIE_COLORS.length]}
                          stroke={activeLegend.type === "income" && activeLegend.idx === idx ? "#FFF" : "#232044"}
                          strokeWidth={activeLegend.type === "income" && activeLegend.idx === idx ? 4 : 1}
                          style={{
                            filter: activeLegend.type === "income" && activeLegend.idx === idx ? "drop-shadow(0 0 12px #4ade80cc)" : undefined,
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                      contentStyle={{
                        background: "teal",
                        border: "1px solid #34d399",
                        borderRadius: 12,
                        color: "white"
                      }}
                      labelStyle={{ color: "#4ade80", fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="w-full mt-4 space-y-1">
                  <AnimatePresence>
                    {incomePieData.map((entry, idx) => (
                      <motion.li
                        key={`legend-income-${idx}`}
                        initial={animation.initial}
                        animate={animation.animate(idx)}
                        exit={{ opacity: 0, y: 8 }}
                        onMouseEnter={() => setActiveLegend({ type: "income", idx })}
                        onMouseLeave={() => setActiveLegend({ type: null, idx: null })}
                        className={`flex items-center justify-between py-1.5 px-2 text-sm font-medium rounded-md transition cursor-pointer
                          ${activeLegend.type === "income" && activeLegend.idx === idx
                            ? "bg-emerald-700/25 text-white"
                            : "bg-transparent text-emerald-100"
                          }`
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ background: INCOME_PIE_COLORS[idx % INCOME_PIE_COLORS.length] }} />
                          <span className="capitalize">{entry.category}</span>
                        </span>
                        <span>
                          ₹{Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          <span className="ml-3 text-xs bg-emerald-900/60 px-1.5 py-0.5 rounded-md font-normal">
                            {getPercent(entry.value, incomeTotal)}
                          </span>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </>
            ) : (
              <div className="text-gray-400 h-[190px] flex items-center">No income data.</div>
            )}
          </motion.div>
        </div>

        {/* BAR: Top Expense Categories */}
        <div className="w-full max-w-2xl mx-auto mt-10">
          <h4 className="font-semibold text-base text-violet-200 mb-3">Top Expense Categories</h4>
          {sortedExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sortedExpenses} layout="vertical" margin={{ top: 5, right: 16, left: 22, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category" type="category" width={110}
                  tick={{ fill: "#bcb3e6", fontSize: 15, fontWeight: 700 }}
                  stroke="#674dac"
                />
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  contentStyle={{ background: "#1e1e2b", border: "1px solid #8b5cf6", borderRadius: 10, color: "#fff" }}
                  labelClassName="text-violet-200"
                />
                <Bar dataKey="value" fill="#8b5cf6" barSize={28} radius={[0, 6, 6, 0]}>
                  {sortedExpenses.map((_, idx) => (
                    <Cell key={`cell-bar-${idx}`} fill={EXPENSE_PIE_COLORS[idx % EXPENSE_PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 pl-2 mt-6">No expense trends to show.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
