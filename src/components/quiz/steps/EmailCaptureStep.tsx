"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { StepProps } from "../types";
import { Mail, Sparkles, ShieldCheck } from "lucide-react";

export default function EmailCaptureStep({
  data,
  onAnswer,
  onNext,
}: StepProps) {
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!data.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    if (!data.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-coral-light flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-coral" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-burgundy mb-2 text-pirk-heading">
          Your matches are ready!
        </h2>
        <p className="text-warm-grey text-lg">
          Where should we send your personalised surgeon report?
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="quiz-name"
            className="block text-sm font-medium text-near-black mb-1.5"
          >
            Your name
          </label>
          <input
            id="quiz-name"
            type="text"
            value={data.name}
            onChange={(e) => onAnswer("name", e.target.value)}
            placeholder="Enter your first name"
            className={`
              w-full px-4 py-3.5 rounded-xl border-2 bg-white text-near-black
              placeholder:text-warm-grey/50 focus:outline-none transition-colors
              ${errors.name ? "border-red-400" : "border-gray-200 focus:border-coral"}
            `}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="quiz-email"
            className="block text-sm font-medium text-near-black mb-1.5"
          >
            Your email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-grey" />
            <input
              id="quiz-email"
              type="email"
              value={data.email}
              onChange={(e) => onAnswer("email", e.target.value)}
              placeholder="you@example.com"
              className={`
                w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-near-black
                placeholder:text-warm-grey/50 focus:outline-none transition-colors
                ${errors.email ? "border-red-400" : "border-gray-200 focus:border-coral"}
              `}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-coral text-white rounded-xl text-lg font-semibold
            hover:bg-coral/90 transition-all duration-200 shadow-lg hover:shadow-xl
            cursor-pointer mt-2"
        >
          Get My Matches
        </button>

        <div className="flex items-center justify-center gap-2 pt-2">
          <ShieldCheck className="w-4 h-4 text-warm-grey" />
          <p className="text-xs text-warm-grey">
            We&apos;ll never spam you. Unsubscribe anytime.
          </p>
        </div>
      </motion.form>
    </div>
  );
}
