import React from 'react'

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-[#19182d] via-[#201e3e] to-[#231c34]"'>{children}</div>
  )
}

export default Mainlayout