"use client";

import { motion } from "framer-motion";

interface NarrowingIndicatorProps {
  /** Progress from 0 to 1 (e.g. step 3 of 15 = 0.2) */
  progress: number;
}

/**
 * Subtle background narrowing indicator — shows dots/lines funneling
 * down as the user progresses through the quiz. Reinforces that
 * Pirk is actively narrowing their options.
 */
export default function NarrowingIndicator({
  progress,
}: NarrowingIndicatorProps) {
  // Number of dots that are still "active"
  const totalDots = 24;
  const remaining = Math.max(3, Math.round(totalDots * (1 - progress * 0.85)));

  return (
    <div className="mb-6">
      {/* Narrowing dots */}
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: totalDots }).map((_, i) => {
          const isActive = i < remaining;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: isActive ? 0.5 : 0.08,
                scale: isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.4, delay: isActive ? 0 : i * 0.015 }}
              className={`h-1.5 rounded-full ${
                isActive ? "w-3 bg-coral/40" : "w-1.5 bg-gray-300/30"
              }`}
            />
          );
        })}
      </div>

      {/* Caption */}
      <motion.p
        className="mt-2 text-center text-xs text-warm-grey"
        key={remaining}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {progress < 0.1 ? (
          "Searching our full network"
        ) : progress > 0.85 ? (
          <>
            Narrowing to your{" "}
            <span className="font-semibold text-coral">top matches</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-coral">Narrowing</span> your
            options based on your answers
          </>
        )}
      </motion.p>
    </div>
  );
}
