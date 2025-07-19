"use server";
import { db } from "@/lib/prisma";

export async function getExpensesByCategory(accountId: string) {
  // Only group transactions where type is "EXPENSE" and account matches!
  const expenses = await db.transaction.groupBy({
    by: ['category'],
    where: {
      accountId,
      type: "EXPENSE",
    },
    _sum: { amount: true }
  });
  // For chart: { category: "groceries", value: 1200 }
  return expenses.map(e => ({
    category: e.category,      // just the category name (e.g., "groceries")
    value: Number(e._sum.amount ?? 0)
  }));
}
