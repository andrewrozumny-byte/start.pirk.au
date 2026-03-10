"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  label,
}: ProgressBarProps) {
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-warm-grey">{label}</span>
        <span className="text-sm font-medium text-warm-grey">
          {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="w-full h-2 bg-coral-light rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-coral rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
