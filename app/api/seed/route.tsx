import { seedTransactions } from "@/actions/dummydata";

export async function GET(){
    const result=await seedTransactions();
    return Response.json(result);
}