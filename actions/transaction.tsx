"use server";

import { db } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";


function calcNextRecurDate(startDate, interval){
    const date= new Date(startDate);

    switch(interval){
        case "YEARLY":
            date.setDate(date.getFullYear()+1);
            break;
        case "MONTHLY":
            date.setDate(date.getMonth()+1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate()+7);
            break;
        case "DAILY":
            date.setDate(date.getDate()+1);
            break;
    }
    return date;
}

const serializeAmount=(obj)=>({
    ...obj,
    amount:obj.amount.toNumber()
})

export async function createTransaction(data){

    try{
        const {userId}=await auth();
        if(!userId)throw new Error("Unauthorized");

        const user= await db.user.findUnique({
            where:{clerkUserId: userId},
        });
        if(!user)throw new Error("User not found");

        const account =await db.account.findUnique({
            where:{
                id:data.accountId,
                userId:user.Id,
            },
        })

        const balanceChange=data.type==="EXPENSE"
                ?-data.amount: data.amount;
        const newBalance=account.balance.toNumber()+ balanceChange;

        const transaction= await db.$transaction(async(tx)=>{  //reserved prisma transaction
        const newTransaction = await tx.transaction.create({
                data:{
                    ...data,
                    userId:user.id,
                    nextRecurringDate:data.isRecurring && data.recurringInterval?
                        calcNextRecurDate(data.date, data.recurringInterval): null
                }
            });

            await tx.account.update({
                where:{id: data.accountId},
                data:{balance:newBalance},
            });
            return newTransaction
            })

        revalidatePath("/main/dashboard");
        revalidatePath(`/main/account/${transaction.accountId}`);
        
        return {success:true, data:serializeAmount(transaction)};

    }
    catch(error){
        throw new Error(error.message);
    }
}