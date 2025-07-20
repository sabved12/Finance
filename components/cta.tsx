"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden bg-[#1a1833]">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/30 rounded-full blur-3xl animate-pulse animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200 mb-4"
          >
            Ready to Take Control?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-violet-200/80 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of users who are building a better financial future
            with FinTrack. Get started for free—no credit card required.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r bg-white text-black hover:text-white opacity-90 transition-opacity shadow-lg shadow-violet-500/40"
              >
                Sign Up Now!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;