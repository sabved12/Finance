import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import AccountChart from "../_components/AccountChart";
import { PdfUploadButton } from "../_components/PdfUploadButton";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className=" mt-15 px-10 pt-10 pb-20 bg-gradient-to-br from-[#19182d] via-[#201e3e] to-[#231c34] min-h-screen text-white">
      {/* ACCOUNT OVERVIEW */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight gradient-title capitalize
            bg-gradient-to-r from-pink-400 via-violet-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg whitespace-normal"
          >
            {account.name}
          </h1>
          <div className="text-violet-200/80 mt-2 text-lg font-medium">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end justify-end gap-2">
          <div className="bg-[#231f36]/80 border border-violet-600/30 rounded-xl px-6 py-4 shadow-xl
            text-3xl sm:text-4xl font-bold tracking-tighter text-cyan-200 text-shadow"
          >
            ₹{parseFloat(account.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-sm text-violet-300">
            {account._count.transactions} Transaction{account._count.transactions === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* PDF UPLOAD BUTTON */}
      <div className="flex justify-start">
        <div className="rounded-2xl bg-gradient-to-br from-[#221b38]/70 to-[#1b1930]/70 border border-violet-900/30 backdrop-blur px-4 py-5 shadow-lg">
          <PdfUploadButton accountId={params.id} />
        </div>
      </div>

      {/* CHART */}
      <Suspense
        fallback={<BarLoader className="my-8" width={"100%"} color="#9333ea" />}
      >
        <div className="rounded-2xl bg-gradient-to-br from-[#211d34]/90 to-[#232138]/80 border border-violet-900/40 shadow-lg py-8 px-0 sm:px-6">
          <AccountChart transactions={transactions} />
        </div>
      </Suspense>

      {/* TRANSACTION TABLE */}
      <Suspense
        fallback={<BarLoader className="mt-8" width={"100%"} color="#9333ea" />}
      >
        <div className="rounded-2xl bg-gradient-to-br from-[#221b35]/85 to-[#181729]/80 border border-violet-900/20 shadow-lg px-2 sm:px-6 py-2 sm:py-5">
          <TransactionTable transactions={transactions} />
        </div>
      </Suspense>
    </div>
  );
}
