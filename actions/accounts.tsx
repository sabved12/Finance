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



// ... your other functions ...

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // 1. Find the transactions to be deleted to identify the affected accounts
    const transactionsToDelete = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
      select: {
        accountId: true, // We only need the account IDs
      },
    });

    if (transactionsToDelete.length !== transactionIds.length) {
      return { success: false, error: "Some transactions could not be found." };
    }
    
    // Get a unique list of all account IDs that will be affected
    const affectedAccountIds = [...new Set(transactionsToDelete.map(t => t.accountId))];

    // 2. Use a transaction to ensure data integrity
    await db.$transaction(async (tx) => {
      // First, delete the transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // 3. Now, loop through each affected account and recalculate its balance
      for (const accountId of affectedAccountIds) {
        // Find all remaining transactions for the account
        const remainingTransactions = await tx.transaction.findMany({
          where: { accountId: accountId },
        });

        // Calculate the new, correct balance from scratch
        const newBalance = remainingTransactions.reduce((sum, t) => {
          return t.type === "INCOME" ? sum + t.amount.toNumber() : sum - t.amount.toNumber();
        }, 0);

        // Update the account with the correct balance
        await tx.account.update({
          where: { id: accountId },
          data: { balance: newBalance },
        });
      }
    });

    // 4. Revalidate all affected pages
    revalidatePath("/main/dashboard");
    for (const accountId of affectedAccountIds) {
      revalidatePath(`/main/account/${accountId}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Server error" };
  }
}