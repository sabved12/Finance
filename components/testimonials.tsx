"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { testimonialsData } from "../data/landing"; // Update path as needed
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_INTERVAL = 5000; // 5 seconds per slide

  // Function to reset the auto-advance timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Auto-advance logic
  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(
        () =>
          setCurrentIndex((prevIndex) =>
            prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
          ),
        SLIDE_INTERVAL
      );
    }
    return () => resetTimeout();
  }, [currentIndex, isPaused]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const goToPrev = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonialsData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonialsData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <section 
      className="py-20 bg-gradient-to-b from-[#191326] via-[#221b37] to-[#251d38] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Glows */}
      <div className="absolute -left-20 -top-40 w-72 h-56 bg-pink-400/20 blur-2xl rounded-full" />
      <div className="absolute right-0 top-1/4 w-72 h-72 bg-violet-700/20 blur-3xl rounded-full" />
      
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-violet-100 tracking-tight">
          What Our Users Say
        </h2>

        <div className="relative w-full max-w-2xl mx-auto h-72">
          {/* Main slider content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full p-8 bg-black/20 border border-violet-700/30 rounded-2xl shadow-xl text-center flex flex-col items-center"
            >
              <p className="text-violet-100 text-lg md:text-xl italic mb-6">
                "{testimonialsData[currentIndex].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={testimonialsData[currentIndex].image}
                  alt={testimonialsData[currentIndex].name}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-violet-500/80"
                />
                <div className="text-left">
                  <div className="font-bold text-white">
                    {testimonialsData[currentIndex].name}
                  </div>
                  <div className="text-violet-300 text-sm">
                    {testimonialsData[currentIndex].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button onClick={goToPrev} className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft className="h-6 w-6 text-white"/>
          </button>
          <button onClick={goToNext} className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronRight className="h-6 w-6 text-white"/>
          </button>
        </div>
        
        {/* Indicator dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonialsData.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === slideIndex ? "w-6 bg-violet-400" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Testimonials