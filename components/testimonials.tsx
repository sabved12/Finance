"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { testimonialsData } from "../data/landing"; // Adjust the import path as needed

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  function next() { setIdx((idx + 1) % testimonialsData.length); }
  function prev() { setIdx((idx - 1 + testimonialsData.length) % testimonialsData.length); }

  return (
    <section className="py-20 bg-gradient-to-b from-[#191326] via-[#221b37] to-[#251d38] relative overflow-hidden">
      {/* Gradient blobs for luxury effect */}
      <div className="absolute -left-20 -top-40 w-72 h-56 bg-pink-400/20 blur-2xl rounded-full z-0" />
      <div className="absolute right-0 top-1/4 w-72 h-72 bg-violet-700/20 blur-3xl rounded-full z-0" />
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-violet-100 tracking-tight">
          What Our Users Say
        </h2>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.96, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -30 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="p-8 bg-gradient-to-br from-[#231d36]/95 to-[#1b1830]/90 border border-violet-700/30 rounded-2xl shadow-2xl text-center flex flex-col items-center"
              >
                <p className="text-violet-100 text-lg md:text-xl italic mb-6">"{testimonialsData[idx].quote}"</p>
                <div className="flex items-center justify-center gap-4">
                  <Image
                    src={testimonialsData[idx].image}
                    alt={testimonialsData[idx].name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-violet-500/80 shadow"
                  />
                  <div className="text-left">
                    <div className="font-bold text-white leading-tight">{testimonialsData[idx].name}</div>
                    <div className="text-violet-300 text-xs font-medium">{testimonialsData[idx].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Navigation arrows */}
            <button
              aria-label="Previous"
              onClick={prev}
              className="absolute -left-10 top-1/2 -translate-y-1/2 bg-violet-800/70 text-white hover:bg-violet-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
            >‹</button>
            <button
              aria-label="Next"
              onClick={next}
              className="absolute -right-10 top-1/2 -translate-y-1/2 bg-violet-800/70 text-white hover:bg-violet-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
            >›</button>
          </div>
          {/* Indicator dots */}
          <div className="flex gap-3 justify-center mt-6">
            {testimonialsData.map((_, i) => (
              <span
                key={i}
                className={`inline-block w-3 h-3 rounded-full transition
                  ${i === idx ? "bg-gradient-to-br from-pink-400 via-violet-500 to-blue-400 shadow" : "bg-white/10"}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
