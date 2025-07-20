"use client";

import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { useRef } from 'react';
import { scanImage } from '@/actions/transaction'
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
const ReceiptScanner = ({onScanComplete}) => {
    
    const fileInputRef=useRef();
    const {
        loading:scanReceiptLoading,
        fn:scanFn,
        data:scannedData,
    }=useFetch(scanImage)

    const handleImageScan= async(file)=>{
        if(file.size >5*1024*1024){
            toast.error("Please upload file of size less than 5MB");
            return;
        }

        await scanFn(file)
    }
    useEffect(()=>{
        if(scannedData && !scanReceiptLoading){
            onScanComplete(scannedData);
            toast.success("Receipt scanned successfully");
        }
    },[scanReceiptLoading, scannedData]);

    return (
    <div>
        <input type="file" ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        
        onChange={(e)=>{
            const file=e.target.files?.[0];
            if(file)handleImageScan(file);
        }}/>

        <Button
        onClick={()=>fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
        >
            
            {scanReceiptLoading?(<></>):(
            <><Camera className="mr-3"/>
            <span>Scan receipt with AI</span>
            </>
        )}</Button>
    </div>
  )
}

export default ReceiptScanner