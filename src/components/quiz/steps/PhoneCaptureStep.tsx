"use client";

import { motion } from "framer-motion";
import type { StepProps } from "../types";
import { Phone, Clock, ShieldCheck } from "lucide-react";

interface PhoneCaptureStepProps extends StepProps {
  onSkip: () => void;
}

export default function PhoneCaptureStep({
  data,
  onAnswer,
  onNext,
  onSkip,
}: PhoneCaptureStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <Phone className="w-8 h-8 text-coral" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-burgundy mb-2 text-pirk-heading">
          One last thing — can we call you?
        </h2>
        <p className="text-warm-grey text-lg">
          Your matches are almost ready. A quick 5-minute call with your Pirk
          advisor means we can tailor your results and answer any questions
          before you see your surgeons.
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
            htmlFor="quiz-phone"
            className="block text-sm font-medium text-near-black mb-1.5"
          >
            Your phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-grey" />
            <input
              id="quiz-phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onAnswer("phone", e.target.value)}
              placeholder="04XX XXX XXX"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white
                text-near-black placeholder:text-warm-grey/50 focus:outline-none
                focus:border-coral transition-colors"
            />
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 py-2 text-xs text-warm-grey">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            5 mins max
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            No pressure, ever
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-coral text-white rounded-xl text-lg font-semibold
            hover:bg-coral/90 transition-all duration-200 shadow-lg hover:shadow-xl
            cursor-pointer"
        >
          Yes, Call Me
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSkip}
            className="text-warm-grey hover:text-burgundy text-sm underline underline-offset-4
              transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </motion.form>
    </div>
  );
}
