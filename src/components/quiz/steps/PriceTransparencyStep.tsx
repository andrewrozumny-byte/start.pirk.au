"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { AlertCircle, ThumbsUp, Meh } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: LucideIcon;
}

const options: Option[] = [
  { label: "Very Important", value: "very_important", icon: AlertCircle },
  { label: "Somewhat Important", value: "somewhat_important", icon: ThumbsUp },
  { label: "Not a Priority", value: "not_priority", icon: Meh },
];

export default function PriceTransparencyStep({
  data,
  onAnswer,
  onNext,
}: StepProps) {
  const handleSelect = (value: string) => {
    onAnswer("priceTransparency", value);
    setTimeout(onNext, 200);
  };

  return (
    <QuizStep
      title="How important is price transparency to you?"
      subtitle="Did you know surgeon costs for the same procedure can vary by $5,000–$10,000?"
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = data.priceTransparency === option.value;
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
                  isSelected ? "bg-coral text-white" : "bg-coral-light text-coral"
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
      </div>
    </QuizStep>
  );
}
