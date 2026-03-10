"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import {
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: LucideIcon;
  askSurgeon?: boolean;
}

const options: Option[] = [
  { label: "Not yet", value: "not_yet", icon: Search },
  {
    label: "Yes, one",
    value: "one",
    icon: MessageCircle,
    askSurgeon: true,
  },
  {
    label: "Yes, multiple",
    value: "multiple",
    icon: MessagesSquare,
    askSurgeon: true,
  },
  {
    label: "I've already chosen (but want a second opinion)",
    value: "second_opinion",
    icon: MessageSquare,
    askSurgeon: true,
  },
];

export default function ConsultationsStep({
  data,
  onAnswer,
  onNext,
}: StepProps) {
  const [showSurgeonInput, setShowSurgeonInput] = useState(false);

  const handleSelect = (value: string, askSurgeon?: boolean) => {
    onAnswer("consultations", value);
    if (askSurgeon) {
      setShowSurgeonInput(true);
    } else {
      setTimeout(onNext, 200);
    }
  };

  const handleSurgeonSubmit = () => {
    onNext();
  };

  return (
    <QuizStep
      title={
        showSurgeonInput
          ? "Which surgeon have you seen?"
          : "Have you had any consultations yet?"
      }
      subtitle={
        showSurgeonInput
          ? "This helps us compare and give you a more informed recommendation."
          : "Consultation fees range from $100–$500, and some are non-refundable. Many patients book 2–3 before deciding."
      }
    >
      <AnimatePresence mode="wait">
        {showSurgeonInput ? (
          <motion.div
            key="surgeon-input"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={data.consultationSurgeonName}
              onChange={(e) =>
                onAnswer("consultationSurgeonName", e.target.value)
              }
              placeholder="e.g. Dr. Smith, Sydney Cosmetic Clinic..."
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-near-black
                placeholder:text-warm-grey/50 focus:outline-none focus:border-coral transition-colors"
              autoFocus
            />
            <button
              onClick={handleSurgeonSubmit}
              className="w-full py-4 bg-coral text-white rounded-xl text-base font-semibold
                hover:bg-coral/90 transition-all duration-200 shadow-md cursor-pointer"
            >
              {data.consultationSurgeonName.trim() ? "Continue" : "Skip"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="options"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-3"
          >
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = data.consultations === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    handleSelect(option.value, option.askSurgeon)
                  }
                  className={`
                    flex items-center gap-4 p-5 rounded-xl border-2
                    transition-all duration-200 cursor-pointer text-left
                    ${
                      isSelected
                        ? "border-coral bg-coral-light shadow-md"
                        : "border-gray-200 bg-white hover:border-coral-mid hover:shadow-sm"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-coral text-white"
                        : "bg-coral-light text-coral"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-base font-medium ${
                      isSelected ? "text-burgundy" : "text-near-black"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </QuizStep>
  );
}
