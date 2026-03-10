"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { DollarSign, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BudgetOption {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}

// Budget ranges by procedure category
function getBudgetOptions(procedure: string): BudgetOption[] {
  // Face procedures — generally lower cost
  if (
    procedure.startsWith("face") ||
    procedure === "rhinoplasty" ||
    procedure === "blepharoplasty" ||
    procedure === "brow_lift" ||
    procedure === "facelift"
  ) {
    return [
      {
        label: "Under $8,000",
        value: "under_8k",
        icon: DollarSign,
        hint: "Typically newer or regional surgeons",
      },
      {
        label: "$8,000–$15,000",
        value: "8k_to_15k",
        icon: DollarSign,
        hint: "Most common range with experienced surgeons",
      },
      {
        label: "$15,000+",
        value: "over_15k",
        icon: DollarSign,
        hint: "Highly sought-after surgeons & premium hospitals",
      },
      { label: "Not sure yet", value: "not_sure", icon: HelpCircle },
    ];
  }

  // Body procedures — higher cost (tummy tuck, mummy makeover)
  if (
    procedure === "tummy_tuck" ||
    procedure === "mummy_makeover"
  ) {
    return [
      {
        label: "Under $15,000",
        value: "under_15k",
        icon: DollarSign,
        hint: "Typically newer or regional surgeons",
      },
      {
        label: "$15,000–$25,000",
        value: "15k_to_25k",
        icon: DollarSign,
        hint: "Most common range with experienced surgeons",
      },
      {
        label: "$25,000+",
        value: "over_25k",
        icon: DollarSign,
        hint: "Highly sought-after surgeons & premium hospitals",
      },
      { label: "Not sure yet", value: "not_sure", icon: HelpCircle },
    ];
  }

  // Liposuction
  if (procedure === "liposuction") {
    return [
      {
        label: "Under $8,000",
        value: "under_8k",
        icon: DollarSign,
        hint: "Single area, newer or regional surgeons",
      },
      {
        label: "$8,000–$15,000",
        value: "8k_to_15k",
        icon: DollarSign,
        hint: "Most common range, 1–2 areas",
      },
      {
        label: "$15,000+",
        value: "over_15k",
        icon: DollarSign,
        hint: "Multiple areas or premium surgeons",
      },
      { label: "Not sure yet", value: "not_sure", icon: HelpCircle },
    ];
  }

  // Default — breast procedures and everything else
  return [
    {
      label: "Under $12,000",
      value: "under_12k",
      icon: DollarSign,
      hint: "Typically newer or regional surgeons",
    },
    {
      label: "$12,000–$18,000",
      value: "12k_to_18k",
      icon: DollarSign,
      hint: "Most common range with experienced surgeons",
    },
    {
      label: "$18,000+",
      value: "over_18k",
      icon: DollarSign,
      hint: "Highly sought-after surgeons & premium hospitals",
    },
    { label: "Not sure yet", value: "not_sure", icon: HelpCircle },
  ];
}

export default function BudgetStep({ data, onAnswer, onNext }: StepProps) {
  const [showMessage, setShowMessage] = useState(false);
  const options = getBudgetOptions(data.procedure);

  const handleSelect = (value: string) => {
    onAnswer("budget", value);
    setShowMessage(true);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  return (
    <QuizStep title="What's your approximate budget?">
      <AnimatePresence mode="wait">
        {showMessage ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-coral-light flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-coral" />
            </div>
            <p className="text-xl font-bold text-burgundy mb-2">Good news!</p>
            <p className="text-warm-grey">
              We know the exact pricing for every surgeon in our network.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="options"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = data.budget === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
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
                  <div>
                    <span
                      className={`text-base font-medium ${
                        isSelected ? "text-burgundy" : "text-near-black"
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.hint && (
                      <p className="text-xs text-warm-grey mt-0.5">
                        {option.hint}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </QuizStep>
  );
}
