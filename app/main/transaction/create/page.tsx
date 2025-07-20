import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from "../_components/AddTransactionForm"
import { getTransaction } from '@/actions/transaction';

const AddTransactionPage =async ({searchparams}) => {

const accounts=await getUserAccounts();

const editId=searchparams?.edit;

let initialData=null;
  if(editId){
      const transaction= await getTransaction(editId);
      initialData=transaction;
  }

  return (
    <div className=' mx-auto-px-5 items-center justify-center '>
        

        <AddTransactionForm
            accounts={accounts}
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData}
        />
    </div>
  )
}

export default AddTransactionPage