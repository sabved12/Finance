"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { updateDefaultAccount } from '@/actions/accounts';
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';


const Accountcard = ({account}:{account: any}) => {
    const {name,type,balance,isDefault, id} = account;
    const {
        loading:updateDefaultLoading,
        fn:updateDefaultFn,
        data:updatedAccount,
        error
    }=useFetch(updateDefaultAccount);

    const handleDefaultChange=async(event:any)=>{

        event?.preventDefault();
        if(isDefault){
            toast.warning("You need atleast one default account");
            return;
        }
        await updateDefaultFn(id);
    }

    useEffect(()=>{
        if(updatedAccount?.success){
            toast.success("Default account updated");
        }
}, [updatedAccount, updateDefaultLoading]);

useEffect(()=>{
    if(error){
        toast.error("Error in updating default account");
    }
})
  return (


       <Card
      className={`
        group relative transition-all duration-300
        border-none
        bg-gradient-to-tr from-indigo-100 via-violet-100 to-white
        dark:from-[#22185e] dark:via-[#2e174b] dark:to-[#22223b]
        shadow hover:shadow-2xl hover:-translate-y-1
        hover:ring-2 hover:ring-violet-400
        hover:scale-105
        overflow-hidden
      `}
    >
      <Link href={`/main/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold capitalize text-[#4b256a] dark:text-violet-100 tracking-tight">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="transition-all group-hover:ring-2 group-hover:ring-violet-500"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-black dark:text-violet-300 drop-shadow-sm">
            ₹{parseFloat(balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-black dark:text-violet-200 mt-0.5">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
      
        {/* Glow on hover */}
        <div
          className="
            absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-70
            transition-all duration-700 blur-md
            bg-gradient-to-r from-violet-300/30 via-white/0 to-indigo-200/30
          "
        ></div>
      </Link>
    </Card>
  )
}

export default Accountcard