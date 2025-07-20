"use server";
import {auth } from "@clerk/nextjs/server";
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
  
export async function createAccount(data: any){
    try{
        const {userId}=await auth()
        if(!userId)throw new Error("User not authenticated");
        
        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        });
        if(!user) throw new Error("User not found");

        const balance=parseFloat(data.balance);
        if(isNaN(balance)) throw new Error("Invalid balance");
        
        const existingAccount= await db.account.findMany({
            where:{userId:user.id}
        });

        const shouldBedefault=existingAccount.length===0? true:data.isDefault;
        if(shouldBedefault){
            await db.account.updateMany({
                where:{userId:user.id},
                data:{isDefault:false}
            });
        }

        const account=await db.account.create({
            data:{
                ... data,
                balance:balance,
                userId:user.id,
                isDefault:shouldBedefault
            },
            
        });

        const serializedAccount= serializeTransaction(account);
        revalidatePath("/main/dashboard");
        return {success:true, account:serializedAccount};
    }

    catch(error){
        throw new Error("Failed to create account")
    }
}

export async function getUserAccounts(){
    const {userId}=await auth()
        if(!userId)throw new Error("User not authenticated");
        
        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        });
        if(!user) throw new Error("User not found");

        const accounts=await db.account.findMany({
            where:{userId:user.id},
            orderBy:{createdAt:"desc"},
            include:{
                _count:{
                    select:{
                        transactions:true
                    }
                }
            }
        });

        const serializedAccounts=accounts.map(serializeTransaction);
        return serializedAccounts;
}


export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}