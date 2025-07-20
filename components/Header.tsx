// "use client";
import { checkUser } from "@/lib/checkUser";
import React from "react";
import Link from "next/link";
import { PenBox, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button"; // (Assuming you're using shadcn/ui or similar)
import Dashboard from "@/app/main/dashboard/page";

const Header: React.FC = async () => {
  await checkUser();
  return (
    <header className="
      fixed top-0 w-full z-50
      bg-gradient-to-r from-[#211a32] via-[#191730] to-[#181429]
      bg-opacity-90 backdrop-blur-[10px]
      border-b border-violet-500/20 shadow-md
    ">
      <nav className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Welth Logo"
            width={160}
            height={44}
            className="h-12 w-auto object-contain rounded-xl shadow"
            priority
          />
          <span className="text-2xl font-bold tracking-tight text-violet-200 dark:text-cyan-200 hidden sm:inline">
            Fintrack Finance
          </span>
        </Link>

        {/* Nav links (for public) */}
        <div className="hidden md:flex items-center gap-8">
          <SignedOut>

          </SignedOut>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/main/dashboard" className="flex items-center gap-2 hover: cursor-pointer text-blue-800 dark:text-blue-200 transition">
              <Button
            variant="outline"
            className="flex items-center gap-2
             text-gray-800 dark:text-white border-gray-300
              dark:border-gray-600 bg-gray-100 dark:bg-gray-800 transition
        hover: cursor-pointer text-blue-900 bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/main/transaction/create" className="flex items-center gap-2">
              <Button
      className="flex items-center gap-2 bg-gray-800 text-white transition
        hover: cursor-pointer text-white bg-gray-900 hover:shadow-md">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/authfolder/signin">
              <Button variant="outline" className="min-w-[90px] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Login
              </Button>
            </Link>
            <Link href="/authfolder/signup">
              <Button variant="outline" className="min-w-[90px] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Sign Up
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-cyan-400 shadow" } }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;