import React, { Suspense } from "react";
import { CreateAccountDrawer } from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/accountcard";
import DashboardOverview from "./_components/DashboardOverview";

async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  return (
    <div className="mt-15 py-8 px-2 md:px-6 bg-gradient-to-br from-[#17152a] via-[#22203a] to-[#18162c] min-h-screen text-white">
      {/* Overview, budget (if any) */}

      {/* Accounts grid (Add + All) */}
      <h2 className="text-2xl font-bold mb-4 text-violet-200 tracking-tight">
        Accounts
      </h2>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 mb-14">
        {/* Add New Account Card */}
        <CreateAccountDrawer>
          <Card className="hover:shadow-violet-400/40 bg-gradient-to-br from-[#25204a]/50 via-[#1c1b33]/60 to-[#231a42]/70 border border-violet-800/40 hover:scale-105 hover:border-violet-300/60 transition-all cursor-pointer border-dashed min-h-[160px] flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center text-violet-300 h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {/* All Account Cards */}
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
      
      {/* Dashboard Overview Section */}
      <section className="mt-10">
        <Suspense fallback={<div className="text-violet-200">Loading Overview...</div>}>
          <DashboardOverview accounts={accounts} transactions={transactions || []} />
        </Suspense>
      </section>
    </div>
  );
}

export default DashboardPage;
