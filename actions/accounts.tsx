"use server";
import {auth} from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const serializeTransaction = (transaction:any) => {
    const serialized={...transaction};

    if(transaction.balance){
        serialized.balance=transaction.balance.toNumber();
    }
    if(transaction.amount){
        serialized.amount=transaction.amount.toNumber();
    }
    return serialized;
}

export async function updateDefaultAccount(accountId: string) {
    try{
        const {userId}=await auth();
        if(!userId)throw new Error("User not authenticated");

        const user=await db.user.findUnique({
            where:{clerkUserId: userId}
        });

        if(!user)throw new Error ("User not  found");

        await db.account.updateMany({ //unset any existing default account
            where:{
                userId:user.id,
                isDefault:true,
            },
                data:{isDefault:false}
            
            
        });

        const updatedAccount= await db.account.update({
            where:{
                id: accountId,
                userId:user.id
            },
            data:{isDefault:true}
        });

        revalidatePath("/main/dashboard");

        return {success:true, data:serializeTransaction(updatedAccount)};
    
        
    }
    catch(error){
        throw new Error("Failed to update default account");
    }
}

export async function getAccountWithTransactions(accountId:string){
    const {userId}=await auth();
        if(!userId)throw new Error("User not authenticated");

        const user=await db.user.findUnique({
            where:{clerkUserId: userId}
        });

        if(!user)throw new Error ("User not  found");

        const account=await db.account.findUnique({
            where:{
                id:accountId,
                userId:user.id
            },
            include: {
            transactions: true, // ...other includes if needed
            _count: { select: { transactions: true } }, // << KEY PART
        },
        });
 
        if(!account)return null;
        return{
            ...serializeTransaction(account),
            transactions:account.transactions.map(serializeTransaction)
        }

}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    // Step 1: Authenticate Clerk User
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    // Step 2: Lookup the user in the Prisma DB
    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });
    if (!user) throw new Error("User not found");

    // Step 3: Find the transactions to be deleted and calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      }
    });

    // Step 4: Compute account balance changes for all involved accounts
    // - Deleting an EXPENSE increases balance, deleting INCOME decreases
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      // If expense: add back the amount; If income: subtract the amount
      const amount = transaction.amount.toNumber(); 
      const change = transaction.type === "EXPENSE" ? amount : -amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {} as Record<string, number>);

    // Step 5: Delete transactions and update balances atomically
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        }
      });

      for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange
            }
          }
        });
      }
    });

    // Step 6: Cache revalidation (use paths that affect related UI)
    revalidatePath("/main/dashboard");
    // Optionally revalidate affected accounts, if user navigates there
    // If you have all account IDs, you can also loop and revalidate accounts
    revalidatePath("/main/account/[id]");

    // Step 7: Return
    return { success: true };
  } catch (error: any) {
    // For debug, you can log:
    // console.error("Bulk delete failed:", error);
    return { success: false, error: error.message || "Server error" };
  }
}