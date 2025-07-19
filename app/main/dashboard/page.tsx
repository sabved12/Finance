import React from 'react'
import {CreateAccountDrawer} from '@/components/createAccountDrawer';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { getUserAccounts } from '@/actions/dashboard';
import AccountCard from './_components/accountcard'; 
import ClientAccountInsights from './_components/clientAccInsights';


async function DashboardPage()  {

    const accounts=await getUserAccounts();
    
  return (
    <div className='px-5'> 
      {/* //budget */}

      {/* overview */}

      {/* accounts grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
 <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
      </div>
   
  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
  {/* <CreateAccountDrawer> */}
    {/* <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
      <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
        <Plus className="h-10 w-10 mb-2" />
        <p className="text-sm font-medium">Add New Account</p>
      </CardContent>
    </Card> */}
  {/* </CreateAccountDrawer> */}
  {accounts.map(account => (
    <AccountCard key={account.id} account={account} />
  ))}
</div>

    <ClientAccountInsights accounts={accounts} />;


    </div>
  )
}

export default DashboardPage