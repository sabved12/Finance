import { RecurringInterval } from "@prisma/client";
import {z} from "zod";

export const AccountSchema = z.object({
    name:z.string().min(1, "Name is required"),
    type:z.enum(["CURRENT", "SAVINGS",]),
    balance:z.string().min(1,"Initial balance must be greater than 0"),
    isDefault:z.boolean().default(false),
});

export const TransactionSchema = z.object({
    
    type:z.enum(["INCOME", "EXPENSE",]),
   amount:z.string().min(1,"Amount is required"),
    description: z.string().optional(),
    accountId:z.string().min(1, "Account is required"),
    category:z.string().min(1, "Category is required"),
    date:z.date({required_error:"Date is required"}),
    isRecurring:z.boolean().default(false),
    recurringInterval: z.enum([
        "YEARLY", "MONTHLY", "WEEKLY", "DAILY"
    ]).optional()
}).superRefine((data, ctx)=>{
    if(data.isRecurring && !data.recurringInterval){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message: "Recurring Interval is required",
            path: ["recurringInterval"]
        })
    }
});