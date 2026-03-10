"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import {
  User,
  Award,
  Flower2,
  Zap,
  Building2,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RequirementOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const requirements: RequirementOption[] = [
  { label: "Female surgeon", value: "female_surgeon", icon: User },
  { label: "Highly experienced", value: "highly_experienced", icon: Award },
  { label: "Known for natural results", value: "natural_results", icon: Flower2 },
  { label: "Fast availability", value: "fast_availability", icon: Zap },
  { label: "Premium hospital", value: "premium_hospital", icon: Building2 },
  { label: "I\u2019m not sure yet", value: "not_sure", icon: HelpCircle },
];

export default function RequirementsStep({
  data,
  onAnswer,
  onNext,
}: StepProps) {
  const selected = data.requirements || [];

  const toggleRequirement = (value: string) => {
    if (value === "not_sure") {
      onAnswer("requirements", ["not_sure"]);
      return;
    }

    const withoutNone = selected.filter((v) => v !== "not_sure");
    const newSelection = withoutNone.includes(value)
      ? withoutNone.filter((v) => v !== value)
      : [...withoutNone, value];
    onAnswer("requirements", newSelection);
  };

  return (
    <QuizStep title="What matters most in a surgeon?">
      <p className="text-sm text-warm-grey text-center mb-4">
        Select all that apply
      </p>
      <div className="flex flex-col gap-3 mb-8">
        {requirements.map((req) => {
          const Icon = req.icon;
          const isSelected = selected.includes(req.value);
          return (
            <button
              key={req.value}
              onClick={() => toggleRequirement(req.value)}
              className={`
                flex items-center gap-3 px-5 py-4 rounded-xl border-2
                transition-all duration-200 cursor-pointer text-left
                ${
                  isSelected
                    ? "border-coral bg-coral-light text-burgundy shadow-sm"
                    : "border-gray-200 bg-white text-near-black hover:border-coral-mid"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isSelected ? "text-coral" : "text-warm-grey"
                }`}
              />
              <span className="text-base font-medium">{req.label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={selected.length === 0}
        className={`
          w-full py-4 rounded-xl text-base font-semibold transition-all duration-200
          ${
            selected.length > 0
              ? "bg-coral text-white hover:bg-coral/90 shadow-md cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Continue
      </button>
    </QuizStep>
  );
}
