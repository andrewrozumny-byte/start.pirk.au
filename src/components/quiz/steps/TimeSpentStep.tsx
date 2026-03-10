"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { Clock, Timer, Hourglass, AlarmClock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: LucideIcon;
}

const options: Option[] = [
  { label: "Less than 5 hours", value: "under_5", icon: Clock },
  { label: "5–20 hours", value: "5_to_20", icon: Timer },
  { label: "20–50 hours", value: "20_to_50", icon: Hourglass },
  { label: "50+ hours", value: "over_50", icon: AlarmClock },
];

export default function TimeSpentStep({ data, onAnswer, onNext }: StepProps) {
  const handleSelect = (value: string) => {
    onAnswer("timeSpent", value);
    setTimeout(onNext, 200);
  };

  return (
    <QuizStep
      title="How much time have you spent researching so far?"
      subtitle="Most people spend 50–70+ hours researching surgeons before making a decision."
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = data.timeSpent === option.value;
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
