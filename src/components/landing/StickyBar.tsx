"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show after scrolling past hero (~600px)
    setVisible(latest > 600);
  });

  return (
    <motion.div
      className="fixed right-0 bottom-0 left-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between bg-coral px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <span className="text-sm font-semibold text-white">
          2-min quiz. No obligation.
        </span>
        <Link
          href="/quiz"
          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-coral transition-all hover:brightness-95"
        >
          Find My Surgeon
        </Link>
      </div>
    </motion.div>
  );
}
