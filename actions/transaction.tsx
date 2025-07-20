"use server";

import { db } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import {GoogleGenerativeAI} from "@google/generative-ai"


const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const allowedCategories = [
  "housing", "transportation", "groceries", "utilities", "entertainment",
  "food", "shopping", "healthcare", "education", "personal", "travel",
  "insurance", "gifts", "bills", "other expense", "other-expense", "uncategorized"
];

function normalizeCategory(str) {
  return str ? str.trim().toLowerCase().replace(/[\s_-]+/g, "") : "";
}
function matchCategory(aiCategory, allowedCategories) {
  if (!aiCategory) return "uncategorized";
  const normAI = normalizeCategory(aiCategory);
  for (const cat of allowedCategories) {
    if (normalizeCategory(cat) === normAI) return cat;
  }
  return "uncategorized";
}


function calcNextRecurDate(startDate, interval){
    const date= new Date(startDate);

    switch(interval){
        case "YEARLY":
            date.setFullYear(date.getFullYear()+1);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth()+1);
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

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // FIXED: user.id (lowercase), not user.Id
    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    // You may want to check if account is null and throw error

    const balanceChange = data.type === "EXPENSE"
      ? -data.amount
      : data.amount;

    const newBalance = account.balance.toNumber() + balanceChange; // not strictly needed here

    // RETURN the result of the transaction, not assign to unused variable
    return await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calcNextRecurDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            // Use increment/decrement for atomic and safer updates
            [data.type === "EXPENSE" ? "decrement" : "increment"]: data.amount,
          },
        },
      });

      revalidatePath("/main/dashboard");
      revalidatePath(`/main/account/${newTransaction.accountId}`);

      return { success: true, data: serializeAmount(newTransaction) };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function scanImage(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}

export async function getTransaction(id){
    const {userId}=await auth();
    if(!userId)throw new Error("Unauthorized");

    const user=await db.user.findUnique({
        where:{clerkUserId:userId},
    });
    if(!user)throw new Error("User not found");

    const transaction=await db.transaction.findUnique({
        where:{
            id,
            userId:user.id
        }
    })
    if(!transaction)throw new Error("Transaction not found");

    return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calcNextRecurDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/main/dashboard");
    revalidatePath(`/main/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}


// Add this new function to your actions/transaction.ts file

export async function scanPdf(file: File) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt =  `
      You are an expert financial assistant. Analyze the provided PDF document which contains a table of financial transactions. Your task is to extract all transaction rows and enrich them with a category.

  For each transaction, extract the following information:
  - "date": The transaction date in YYYY-MM-DD format.
  - "description": The merchant name or transaction description.
  - "amount": The amount as a positive number.
  - "type": Classify as either "INCOME" or "EXPENSE".
  - "category": Based on the description, suggest the most logical category from the following list:
    - Housing
    - Transportation
    - Groceries
    - Utilities
    - Entertainment
    - Food
    - Shopping
    - Healthcare
    - Education
    - Personal
    - Travel
    - Insurance
    - Gifts
    - Bills
    - Other Expense
  
  If no category from the list is a good fit, assign "Other Expense".

  Return ONLY a valid JSON array of objects. Do not include any other text, markdown, or explanations.
    `;

    // Convert the file to the format Gemini needs
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const pdfPart = {
      inlineData: { data: base64String, mimeType: file.type },
    };

    const result = await model.generateContent([prompt, pdfPart]);
    const responseText = result.response.text().replace(/^```json\n|```$/g, "").trim();

    // Parse the JSON array returned by the AI
    const transactions = JSON.parse(responseText);
    
    if (!Array.isArray(transactions)) {
        throw new Error("AI did not return a valid array.");
    }

    return { data: transactions }; // Return the extracted data

  } catch (error) {
    console.error("Error scanning PDF:", error);
    return { error: "Failed to scan PDF." };
  }
}


export async function processPdfForAccount(formData: FormData, accountId: string) {
  try {
    // --- ✅ THE FIX: Step 1 ---
    // Authenticate the user at the beginning of the action
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");
    
    // --- End of Fix Step 1 ---


    if (!accountId) return { error: "Account ID is missing." };
    const file = formData.get("pdfStatement") as File;
    if (!file || file.size === 0) return { error: "No PDF file provided." };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an expert financial assistant. Analyze the provided PDF document which contains a table of financial transactions. Your task is to extract all transaction rows and enrich them with a category.

  For each transaction, extract the following information:
  - "date": The transaction date in YYYY-MM-DD format.
  - "description": The merchant name or transaction description.
  - "amount": The amount as a positive number.
  - "type": Classify as either "INCOME" or "EXPENSE".
  - "category": Based on the description, suggest the most logical category from the following list:
    - Housing
    - Transportation
    - Groceries
    - Utilities
    - Entertainment
    - Food
    - Shopping
    - Healthcare
    - Education
    - Personal
    - Travel
    - Insurance
    - Gifts
    - Bills
    - Other Expense
  
  If no category from the list is a good fit, assign "Other Expense".

  Return ONLY a valid JSON array of objects. Do not include any other text, markdown, or explanations.
    `;

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfPart = {
      inlineData: { data: fileBuffer.toString("base64"), mimeType: "application/pdf" },
    };

    const result = await model.generateContent([prompt, pdfPart]);
    // Get the raw text and trim whitespace from the ends

    const responseText = result.response.text().replace(/^```json\n|```$/g, "").trim();
    const cleanedWrapper = responseText.replace(/^```(json)?\n?|```$/g, "").trim();
    
    // Step 2: Remove ALL backticks from anywhere inside the string
    const sanitizedText = cleanedWrapper.replace(/`/g, "");

    // Now, parse the fully sanitized text
    const transactions = JSON.parse(sanitizedText);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { success: "PDF processed, but no transactions were found." };
    }
    
    let totalBalanceChange = 0;
    const transactionsToCreate = transactions.map(t => {
      const change = t.type === "INCOME" ? t.amount : -t.amount;
      totalBalanceChange += change;

      return {
        date: new Date(t.date),
        description: t.description,
        amount: t.amount,
        type: t.type,
        accountId: accountId,
        category: t.category,
        userId: user.id,
      };
    });

    await db.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: totalBalanceChange } },
      });
      await tx.transaction.createMany({
        data: transactionsToCreate,
        skipDuplicates: true,
      });
    });

    revalidatePath(`/main/account/${accountId}`);
    return { success: `Successfully imported ${transactionsToCreate.length} transactions and updated the balance.` };

  } catch (error: any) {
    console.error("--- PDF Processing Failed ---", error);
    return { error: `Failed to process PDF. Details: ${error.message}` };
  }
}