"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// Luxurious, modern clarified violet/cyan color palette:
const COLORS = [
  "#9F7AEA", // violet-400
  "#7156D9", // violet-600
  "#57C8F7", // cyan
  "#F683AC", // pink
  "#FFDD57", // gold
  "#7FD6C2", // teal
  "#1f2937", // slate-900
];

// Helper: percent by category
function getPercent(value, total) {
  if (!total) return "0%";
  return ((value / total) * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%";
}

const animation = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.48, type: "spring" }
  }),
};

const DashboardOverview = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const [activeIndex, setActiveIndex] = useState(null);

  // Filter and sort
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Expenses by category for this account/month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });
  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const pieChartData = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: category,
    value,
  }));
  const totalPie = pieChartData.reduce((s, d) => s + d.value, 0);

  // Pie chart interactive slice highlighting
  const handlePieEnter = (data, idx) => setActiveIndex(idx);
  const handlePieLeave = () => setActiveIndex(null);

  return (
    <div className="relative grid gap-6 md:grid-cols-2 mt-4">
      {/* Recent Transactions Card */}
      <Card className="bg-gradient-to-bl from-[#22203a]/80 to-[#18162c]/80 border border-violet-800/30 shadow-2xl text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-bold text-violet-100">Recent Transactions</CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[160px] bg-[#211d32]/80 border-violet-600/30 text-violet-100">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="bg-[#1f1937] border-violet-700/40 text-violet-200">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="hover:bg-violet-700/30">
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-violet-300 py-4">No recent transactions for this account.</p>
            ) : (
              <AnimatePresence>
                {recentTransactions.map((transaction, idx) => (
                  <motion.div
                    key={transaction.id}
                    className={cn(
                      "flex items-center justify-between py-2 px-2 rounded-lg group transition cursor-pointer",
                      idx === 0 && "bg-gradient-to-r from-violet-900/25 to-cyan-800/10 shadow-violet-500/30"
                    )}
                    initial={animation.initial}
                    animate={animation.animate(idx)}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 6px 18px #674dac11"
                    }}
                  >
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-medium leading-none text-violet-100 group-hover:text-cyan-200">
                        {transaction.description || "Untitled Transaction"}
                      </span>
                      <span className="text-sm text-violet-300 group-hover:text-cyan-100">
                        {format(new Date(transaction.date), "PP")}
                      </span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 text-right font-semibold",
                      transaction.type === "EXPENSE"
                        ? "text-pink-400 group-hover:text-pink-300"
                        : "text-teal-300 group-hover:text-teal-200"
                    )}>
                      {transaction.type === "EXPENSE" ? <ArrowDownRight className="mr-1 h-4 w-4" /> : <ArrowUpRight className="mr-1 h-4 w-4" />}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Monthly Expenses Card with Interactive Pie */}
      <Card className="bg-gradient-to-bl from-[#211b32]/90 to-[#2a1e41]/90 border border-violet-800/20 shadow-2xl text-white flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-violet-100">Monthly Expenses</CardTitle>
          <CardDescription className="text-violet-300">
            A breakdown of your spending by category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {pieChartData.length === 0 ? (
            <div className="flex h-[246px] items-center justify-center">
              <p className="text-violet-300">No expenses this month</p>
            </div>
          ) : (
            <>
            <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-bold text-violet-200">
                Total This Month
            </span>
            <span className="text-2xl font-extrabold text-pink-400 dark:text-pink-300 drop-shadow-sm">
                ₹{totalPie.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            </div>
              <ResponsiveContainer width="100%" height={226}>
                <PieChart>
                  <Tooltip
                    formatter={(v) => `₹${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    contentStyle={{
                      backgroundColor: "pink",
                      border: "1px solid #8b5cf6",
                      borderRadius: 12,
                      color: "white"
                    }}
                  />
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive={true}
                    onMouseEnter={handlePieEnter}
                    onMouseLeave={handlePieLeave}
                    activeIndex={activeIndex}
                    // No pie labels directly (visually neater)
                  >
                    {pieChartData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[i % COLORS.length]}
                        stroke={activeIndex === i ? "#fff" : "rgba(0,0,0,0)"}
                        strokeWidth={activeIndex === i ? 4 : 1}
                        style={{
                          cursor: "pointer",
                          filter: activeIndex === i ? "drop-shadow(0 0 16px #a78bfa88)" : undefined
                        }}
                        onMouseOver={() => setActiveIndex(i)}
                        onMouseOut={handlePieLeave}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Custom animated legend */}
              <motion.div className="flex flex-col gap-2 text-sm mt-4">
                {pieChartData.map((entry, i) => (
                  <motion.div
                    key={entry.name}
                    layout
                    className={cn(
                      "flex items-center justify-between px-2 py-2 rounded-md transition bg-transparent cursor-pointer group",
                      activeIndex === i && "bg-violet-900/40 text-white"
                    )}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={handlePieLeave}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full block border-2 border-white/35 mr-1 text-white"
                        style={{
                          background: COLORS[i % COLORS.length],
                          boxShadow: activeIndex === i ? "0 0 8px #a78bfa66" : undefined
                        }}
                      />
                      <span className={cn("font-medium tracking-wide", activeIndex === i && "text-violet-100")}>
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="text-violet-200 font-semibold">₹{entry.value.toFixed(2)}</span>
                      <span className="text-xs  bg-violet-800/70 px-2 py-1 rounded-full text-white border border-violet-900/40 ml-2">
                        {getPercent(entry.value, totalPie)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
