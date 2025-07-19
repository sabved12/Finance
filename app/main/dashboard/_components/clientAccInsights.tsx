// ClientAccountInsights.tsx
"use client";
import { useState } from "react";
import Insights from "./insights";
import ExpensesByCategoryChart from "./charts/expensesByCategory";
export default function ClientAccountInsights({ accounts }) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? "");
  return (
    <Insights
  accounts={accounts}
  selectedAccountId={selectedAccountId}
  onAccountSelect={setSelectedAccountId}
>
  <div className="grid md:grid-cols-2 gap-8">
    {/* <TransactionsTrendChart data={...} /> */}
    <ExpensesByCategoryChart data={[]} />
  </div>
</Insights>

  );
}
