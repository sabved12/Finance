"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, CheckCircle, PieChart } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion";
import { useEffect } from "react";

// Floating animation for background blobs
const blobVariants = {
  initial: { scale: 1, opacity: 1 },
  animate: (extra = 1) => ({
    y: [0, 30 * extra, 0, -30 * extra, 0],
    x: [0, 20 * extra, 0, -20 * extra, 0],
    scale: [1, 1.13, 1, 0.98, 1],
    transition: {
      duration: 14 + Math.random() * 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  })
};

export function Hero() {
  return (
    <section className="relative w-full bg-[#1a1833] text-white overflow-hidden min-h-[100vh] pb-10">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-[-10rem] left-[-10rem] w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -z-0"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        custom={1}
      />
      <motion.div
        className="absolute bottom-[-10rem] right-[-10rem] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl -z-0"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        custom={-1}
      />

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
        <motion.h1
          className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text 
          bg-gradient-to-r from-white to-violet-300 py-2"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          Clarity, Control, and Confidence
          <br />
          in Your Finances.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg text-violet-200/80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        >
          FinTrack is the all-in-one platform to track your spending, manage
          budgets, and achieve your financial goals faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.7, type: "spring" }}
          className="flex justify-center"
        >
          <Link className="cursor-pointer" href="/authfolder/signup">
            <Button
            as={motion.button}
              size="lg"
              className="mt-8 bg-violet-200 text-black hover:bg-black hover:text-white text-lg shadow-lg  px-8"
              whileHover={{
                scale: 1.09,
                boxShadow: "0 4px 24px 0 #a78bfa60"
              }}
             
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Card Preview Animation */}
      <motion.div
        className="relative container mx-auto px-4 pb-20 -mt-16 md:-mt-24 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.8, type: "spring"}}
      >
        <motion.div
          className="relative max-w-3xl mx-auto p-2 rounded-2xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl shadow-violet-500/20"
          initial={{ scale: 0.97, opacity: 0.96 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, type: "spring"}}
        >
          <div className="p-6 rounded-lg bg-[#1a1833]/80 backdrop-blur-md">
            {/* Mock UI Card */}
            <motion.div
              className="flex flex-col md:flex-row gap-6"
              initial={{ opacity: 0.85, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring"}}
            >
              {/* Left Side: Inputs */}
              <div className="flex-1 space-y-4">
                <motion.p
                  className="font-semibold text-violet-100"
                  animate={{ x: [0, 6, 0], opacity: [1, 0.98, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Monthly Budget Check
                </motion.p>
                <motion.div
                  className="p-3 rounded-md bg-white/5 flex justify-between items-center"
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(139,92,246,0.09)" }}
                >
                  <span className="text-violet-200">Groceries Spending</span>
                  <CheckCircle
                    className="text-green-400"
                    animate={{ scale: [1, 1.17, 1] }}
                    transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
                  />
                </motion.div>
                <motion.div
                  className="p-3 rounded-md bg-white/10 ring-2 ring-violet-500 flex justify-between items-center"
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(139,92,246,0.14)" }}
                >
                  <span className="text-white font-medium">Entertainment Budget</span>
                  <BarChart
                    className="text-sky-400 animate-bounce-slow"
                    style={{ animationDuration: "2.5s" }}
                  />
                </motion.div>
                <motion.div
                  className="p-3 rounded-md bg-white/5 flex justify-between items-center"
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(139,92,246,0.09)" }}
                >
                  <span className="text-violet-200">Upcoming Bills</span>
                  <CheckCircle className="text-green-400" />
                </motion.div>
              </div>
              {/* Right Side: Chart */}
              <motion.div
                className="w-full md:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-violet-500/20 to-sky-500/20 rounded-lg flex items-center justify-center"
                animate={{ scale: [1.01, 1.07, 1.01], rotate: [0, 6, 0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <PieChart className="text-white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
