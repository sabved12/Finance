import React from 'react'
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <h4>Sorry! Page not found</h4>
        <Link className="font-bold"href="/"> Return Home</Link>
    </div>
  )
}

export default NotFound;