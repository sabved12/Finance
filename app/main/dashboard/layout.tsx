import React from 'react'
import DashboardPage from './page'
import { Suspense } from 'react';
import BarLoader from 'react-spinners/BarLoader';
const DashboardLayout = () => {
  return (
    <div> 
      
   
    <Suspense fallback={<BarLoader className="mt-5"color="#36d7b7" width={"100%"}/>}>
        <DashboardPage/>

    </Suspense>
    </div>
  )
}

export default DashboardLayout