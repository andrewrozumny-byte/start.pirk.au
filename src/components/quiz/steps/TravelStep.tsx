"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { MapPin, Navigation, Plane, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: LucideIcon;
}

const options: Option[] = [
  { label: "I want to stay local", value: "local", icon: MapPin },
  { label: "I'd travel within my state", value: "within_state", icon: Navigation },
  { label: "I'd travel interstate for the right surgeon", value: "interstate", icon: Plane },
  { label: "I'm open to anywhere", value: "anywhere", icon: Globe },
];

export default function TravelStep({ data, onAnswer, onNext }: StepProps) {
  const handleSelect = (value: string) => {
    onAnswer("travelWillingness", value);
    setTimeout(onNext, 200);
  };

  return (
    <QuizStep
      title="Would you travel for the right surgeon?"
      subtitle="The best match might not be in your suburb — but they could be worth the trip."
    >
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = data.travelWillingness === option.value;
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
