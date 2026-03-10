"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import {
  ShieldCheck,
  Star,
  Camera,
  DollarSign,
  Clock,
  CreditCard,
  Award,
  RotateCcw,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PriorityOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const priorities: PriorityOption[] = [
  { label: "FRACS Accreditation", value: "fracs_accreditation", icon: ShieldCheck },
  { label: "Patient Reviews", value: "patient_reviews", icon: Star },
  { label: "Before & After Photos", value: "before_after_photos", icon: Camera },
  { label: "Cost & Pricing", value: "cost_pricing", icon: DollarSign },
  { label: "Wait Times", value: "wait_times", icon: Clock },
  { label: "Payment Plans", value: "payment_plans", icon: CreditCard },
  { label: "Surgeon Experience", value: "surgeon_experience", icon: Award },
  { label: "Revision Policy", value: "revision_policy", icon: RotateCcw },
  { label: "Location / Proximity", value: "location_proximity", icon: MapPin },
];

export default function PrioritiesStep({ data, onAnswer, onNext }: StepProps) {
  const selected = data.priorities || [];

  const togglePriority = (value: string) => {
    const newSelection = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onAnswer("priorities", newSelection);
  };

  return (
    <QuizStep
      title="What matters most to you?"
      subtitle="Choosing a surgeon involves checking accreditation, hospital privileges, reviews, costs, wait times, revision policies, and more."
    >
      <p className="text-sm text-warm-grey text-center mb-4">
        Select all that apply
      </p>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {priorities.map((priority) => {
          const Icon = priority.icon;
          const isSelected = selected.includes(priority.value);
          return (
            <button
              key={priority.value}
              onClick={() => togglePriority(priority.value)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl border-2
                transition-all duration-200 cursor-pointer text-sm font-medium
                ${
                  isSelected
                    ? "border-coral bg-coral-light text-burgundy shadow-sm"
                    : "border-gray-200 bg-white text-near-black hover:border-coral-mid"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-coral" : "text-warm-grey"}`} />
              {priority.label}
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
