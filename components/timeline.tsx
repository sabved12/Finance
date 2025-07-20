import { useRef, useEffect, useState, forwardRef } from "react";

// Hook to detect on-screen visibility
function useOnScreen(ref, threshold = 0.15) {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return isIntersecting;
}

// Timeline item preserves all previous card styling and effects
const TimelineItem = forwardRef(function TimelineItem({ side, feature }, ref) {
  const visible = useOnScreen(ref, 0.15);
  return (
    <div
      ref={ref}
      className={`relative flex items-center w-full ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      {/* Small, clear dot */}
      <div
        className={`absolute left-1/2 top-1 w-4 h-4 rounded-full bg-violet-400 ring-2 ring-[#8b5cf6]/30 z-20 
          transition-all duration-500
          ${visible ? "scale-105 opacity-95" : "scale-95 opacity-60"}`}
        style={{ transform: "translate(-50%,0)" }}
      />
      {/* Card: same depth, shadow, color, hover/active ring and shadow */}
      <div
        className={`
          max-w-md px-8 py-7 rounded-3xl border border-[#23213e] shadow-2xl shadow-violet-700/30 bg-[#201e37]/80 relative z-30
          text-violet-100 backdrop-blur-md transition-all duration-500
          ${side === "left" ? "mr-auto ml-4 md:ml-0 md:mr-[calc(50%+38px)]" : "ml-auto mr-4 md:mr-0 md:ml-[calc(50%+38px)]"}
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}
          group
          hover:ring-2 hover:ring-violet-400/70 hover:shadow-violet-500/50 hover:-translate-y-2
        `}
      >
        <div className="flex items-center gap-3 mb-4 text-violet-300/90">
          <span className="text-2xl">{feature.icon}</span>
          <span className="font-semibold text-lg">{feature.title}</span>
        </div>
        <div className="text-violet-200 text-base">{feature.description}</div>
      </div>
    </div>
  );
});

export default function EverythingTimeline({ featuresData }) {
  // Create a ref for each timeline step
  const stepRefs = featuresData.map(() => useRef());
  // Track the last visible step as user scrolls
  const [maxVisibleIdx, setMaxVisibleIdx] = useState(-1);
  const stepVisibilities = stepRefs.map(ref => useOnScreen(ref, 0.44));

  useEffect(() => {
    const lastVisible = stepVisibilities.lastIndexOf(true);
    if (lastVisible !== maxVisibleIdx) setMaxVisibleIdx(lastVisible);
  }, [stepVisibilities, maxVisibleIdx]);

  const total = featuresData.length;
  const fillPercent =
    maxVisibleIdx < 0 ? 0 : ((maxVisibleIdx + 1) / total) * 100;

  return (
    <section className="py-20 relative bg-gradient-to-b from-[#1a1833] via-[#201e37] to-[#26223d]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-violet-100 mb-14 tracking-wide drop-shadow-lg">
          Everything you need to stay financially sound
        </h2>
        <div className="relative flex flex-col items-center">
          {/* Very faint static line */}
          <div
            className="absolute left-1/2 top-10 bottom-10 w-px bg-violet-500/10 z-0 rounded"
            style={{ transform: "translateX(-50%)" }}
          />
          {/* Subtle animated glow fill */}
          <div
            className="absolute left-1/2 top-10 w-px z-10 rounded pointer-events-none"
            style={{
              transform: "translateX(-50%)",
              height: `calc(${fillPercent}% - 12px)`,
              background: "linear-gradient(to bottom, #a78bfa33 0%, #8b5cf6 85%, #fff0 100%)",
              boxShadow: fillPercent > 4 ? "0 3px 24px 2px #8b5cf650" : "none"
            }}
          />
          {/* Timeline steps */}
          <div className="space-y-14 w-full max-w-2xl z-20">
            {featuresData.map((feature, idx) => (
              <TimelineItem
                key={idx}
                ref={stepRefs[idx]}
                side={idx % 2 === 0 ? "left" : "right"}
                feature={feature}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
