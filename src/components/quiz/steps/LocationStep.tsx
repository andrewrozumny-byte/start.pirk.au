"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { MapPin } from "lucide-react";

const locations = [
  { label: "New South Wales", value: "nsw" },
  { label: "Victoria", value: "vic" },
  { label: "Queensland", value: "qld" },
  { label: "South Australia", value: "sa" },
  { label: "Western Australia", value: "wa" },
  { label: "Tasmania", value: "tas" },
  { label: "ACT", value: "act" },
  { label: "Northern Territory", value: "nt" },
];

export default function LocationStep({ data, onAnswer, onNext }: StepProps) {
  const handleSelect = (value: string) => {
    onAnswer("location", value);
    setTimeout(onNext, 200);
  };

  return (
    <QuizStep title="Where are you located?">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {locations.map((loc) => {
          const isSelected = data.location === loc.value;
          return (
            <button
              key={loc.value}
              onClick={() => handleSelect(loc.value)}
              className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2
                transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-coral bg-coral-light shadow-md"
                    : "border-gray-200 bg-white hover:border-coral-mid hover:shadow-sm"
                }
              `}
            >
              <MapPin
                className={`w-5 h-5 ${
                  isSelected ? "text-coral" : "text-warm-grey"
                }`}
              />
              <span
                className={`text-sm font-medium text-center ${
                  isSelected ? "text-burgundy" : "text-near-black"
                }`}
              >
                {loc.label}
              </span>
            </button>
          );
        })}
      </div>
    </QuizStep>
  );
}
