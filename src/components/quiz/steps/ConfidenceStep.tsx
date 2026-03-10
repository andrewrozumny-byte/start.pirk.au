"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { ThumbsUp, Minus, ThumbsDown, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: LucideIcon;
}

const options: Option[] = [
  { label: "Very confident", value: "very_confident", icon: ThumbsUp },
  { label: "Somewhat confident", value: "somewhat_confident", icon: Minus },
  { label: "Not confident at all", value: "not_confident", icon: ThumbsDown },
  { label: "Haven't really started", value: "not_started", icon: HelpCircle },
];

export default function ConfidenceStep({ data, onAnswer, onNext }: StepProps) {
  const handleSelect = (value: string) => {
    onAnswer("confidence", value);
    setTimeout(onNext, 200);
  };

  return (
    <QuizStep
      title="How confident do you feel about choosing a surgeon?"
      subtitle="Most people feel uncertain — that's completely normal and exactly why we exist."
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = data.confidence === option.value;
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
