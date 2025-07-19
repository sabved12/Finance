"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

type Account = {
  id: string;
  name: string;
};

type DashboardChartsProps = {
  accounts: Account[];
  selectedAccountId: string;
  onAccountSelect: (id: string) => void;
  children?: React.ReactNode;
};

const Insights: React.FC<DashboardChartsProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
  children,
}) => (
  <section
    className="w-full bg-violet-100 border border-violet-200 rounded-2xl px-0 md:px-6 py-7 mt-8 shadow-lg"
    // px-0 so charts inside can go edge-to-edge if needed; adjust as you please
  >
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 px-6">
      <h2 className="text-2xl font-bold text-violet-900">Your Insights</h2>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <span className="text-violet-700 text-sm font-medium">Account:</span>
        <Select value={selectedAccountId} onValueChange={onAccountSelect}>
          <SelectTrigger className="min-w-[180px] bg-white border-violet-200 text-violet-900">
            <SelectValue placeholder="Choose an account" />
          </SelectTrigger>
          <SelectContent className="bg-white border-violet-200">
            {accounts.length === 0 ? (
              <div className="text-gray-400 px-4 py-2">No accounts found</div>
            ) : (
              accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="text-violet-900"
                >
                  {account.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="px-6">{children}</div>
  </section>
);

export default Insights;
