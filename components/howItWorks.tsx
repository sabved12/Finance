import { howItWorksData } from "@/data/landing";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HowItWorksSection() {
  // Framer Motion variants for main card animation
  const cardVariants = {
    offscreen: { opacity: 0, y: 60 },
    onscreen: (idx) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: idx * 0.15,
        duration: 0.7,
        ease: [0.19, 1, 0.22, 1],
      },
    }),
  };

  // Variants for dot "pop in" effect
  const dotVariants = {
    initial: { scale: 0.7, opacity: 0 },
    animate: {
      scale: 1.1,
      opacity: 1,
      boxShadow:
        "0px 0px 32px 0px #a78bfa80, 0px 0px 8px 0px #1f0b5650",
      transition: { duration: 0.5, type: "spring" },
    },
    whileHover: { scale: 1.35, boxShadow: "0px 0px 48px 6px #d0bfff" },
  };

  return (
    <section
      id="how"
      className={cn(
        "py-20 md:py-28",
        "bg-gradient-to-b from-[#1f1336] via-[#292247] to-[#161225] relative overflow-hidden"
      )}
    >
      {/* Subtle blurred luxury blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-0 w-1/2 h-60 bg-gradient-to-br from-indigo-600/40 to-transparent blur-3xl opacity-20" />
        <div className="absolute right-0 top-24 w-80 h-60 bg-gradient-to-tr from-pink-500/30 to-transparent rounded-full blur-2xl opacity-20" />
        <div className="absolute left-2/3 bottom-0 w-64 h-48 bg-gradient-to-br from-violet-500/30 to-transparent rounded-full blur-3xl opacity-20" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-violet-200 bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 text-transparent drop-shadow-xl">
          How it works
        </h2>
        <p className="max-w-xl mx-auto text-center text-violet-300 mb-12 font-medium">
          See how easy it is to track, analyze, and optimize your finances with AI-powered tools.
        </p>
        {/* DESKTOP HORIZONTAL TIMELINE */}
        <div className="hidden md:flex items-end justify-between relative">
          {/* Animated Timeline line */}
          <motion.div
            className="absolute left-0 right-0 top-16 h-1 bg-gradient-to-r from-violet-700/40 via-blue-600/20 to-purple-900/40 rounded-full shadow-sm z-0 mx-12"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          />
          {howItWorksData.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative flex flex-col items-center flex-1"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-20%" }}
              custom={idx}
              variants={cardVariants}
            >
              {/* Animated Glowing Dot */}
              <motion.div
                className={cn(
                  "z-10 w-11 h-11 rounded-full mb-2 border-4 border-[#35245b] cursor-pointer",
                  idx === 0
                    ? "bg-gradient-to-br from-pink-500 to-violet-500"
                    : idx === howItWorksData.length - 1
                    ? "bg-gradient-to-br from-blue-500 to-violet-400"
                    : "bg-gradient-to-br from-purple-400 to-blue-600"
                )}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              {/* Card */}
              <motion.div
                whileHover={{
                  boxShadow: "0 6px 42px 0 #8b5cf6cc, 0 2px 12px 0 #11092533",
                  y: -14,
                }}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl px-8 py-7 bg-gradient-to-b from-[#22203a]/95 to-[#1d1932]/90",
                  "backdrop-blur-lg border border-violet-900/40 shadow-xl",
                  "mt-2 min-w-[240px] max-w-xs transition-all duration-300"
                )}
                transition={{ type: "spring", bounce: 0.24, duration: 0.45 }}
              >
                <div className="mb-5 flex items-center justify-center animate-fade-in-up">
                  <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-bl from-blue-900/70 via-violet-700 to-purple-700 shadow ring-2 ring-violet-600/30 w-14 h-14 border-2 border-[#2a1e41] mb-2 scale-100 group-hover:scale-105 transition">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-violet-100 mb-1 text-center tracking-wide">{step.title}</h3>
                <p className="text-violet-300/95 text-sm text-center">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        {/* MOBILE: VERTICAL TIMELINE */}
        <div className="md:hidden flex flex-col gap-14 mt-8">
          {howItWorksData.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative flex flex-col items-center"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-20%" }}
              custom={idx}
              variants={cardVariants}
            >
              <motion.div
                className={cn(
                  "z-10 w-9 h-9 rounded-full shadow-lg border-4 border-[#23213c]",
                  idx === 0
                    ? "bg-gradient-to-br from-pink-500 to-violet-500"
                    : idx === howItWorksData.length - 1
                    ? "bg-gradient-to-br from-blue-500 to-violet-400"
                    : "bg-gradient-to-br from-purple-400 to-blue-600"
                )}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
              />
              <motion.div
                whileHover={{
                  boxShadow: "0 4px 32px 0 #8b5cf6cc, 0 2px 12px 0 #11092550",
                  y: -9,
                }}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl px-6 py-6 bg-gradient-to-b from-[#2c2252]/90 to-[#18162c]/90",
                  "backdrop-blur border border-violet-900/30 shadow-lg",
                  "mt-3 min-w-[210px] max-w-[90vw] transition-all duration-300"
                )}
                transition={{ type: "spring", bounce: 0.22, duration: 0.35 }}
              >
                <div className="mb-5 flex items-center justify-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-bl from-blue-900/70 via-violet-700 to-purple-700 shadow ring-2 ring-violet-600/30 w-12 h-12 border-2 border-[#2a1e41] mb-2">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-base text-violet-100 mb-1 text-center">{step.title}</h3>
                <p className="text-violet-300/95 text-sm text-center">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
