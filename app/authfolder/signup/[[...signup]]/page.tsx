import { SignUp } from '@clerk/nextjs'
import React from 'react'
import AuthLayout from '../../layout';
// import Header from "../../components/Header";
// If Header is located elsewhere, update the path below:

const page = () => {
  return (
    <div>
   
    <SignUp/>
    </div>
    
  )
}

export default page