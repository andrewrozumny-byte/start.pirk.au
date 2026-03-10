"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  DollarSign,
  ShieldCheck,
  TrendingUp,
};

interface InsightCardProps {
  icon: string;
  stat: string;
  description: string;
}

export default function InsightCard({
  icon,
  stat,
  description,
}: InsightCardProps) {
  const IconComponent = iconMap[icon] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl shadow-lg border border-coral-light max-w-md mx-auto"
    >
      <div className="w-16 h-16 rounded-full bg-coral-light flex items-center justify-center mb-6">
        <IconComponent className="w-8 h-8 text-coral" />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-5xl font-bold text-burgundy mb-2"
      >
        {stat}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-warm-grey text-lg"
      >
        {description}
      </motion.p>
      {/* Auto-advance progress indicator */}
      <motion.div
        className="w-full h-1 bg-coral-light rounded-full mt-8 overflow-hidden"
      >
        <motion.div
          className="h-full bg-coral rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
