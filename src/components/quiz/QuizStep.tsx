"use client";

import { motion } from "framer-motion";

interface QuizStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function QuizStep({ title, subtitle, children }: QuizStepProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {subtitle && (
        <p className="text-warm-grey text-sm italic mb-4 text-center leading-relaxed">
          {subtitle}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-burgundy text-center mb-8 text-pirk-heading">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export { slideVariants };
