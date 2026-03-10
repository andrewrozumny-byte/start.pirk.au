"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizStep from "../QuizStep";
import type { StepProps } from "../types";
import { ArrowLeft } from "lucide-react";

interface ProcedureOption {
  label: string;
  value: string;
}

const categories: ProcedureOption[] = [
  { label: "Breast", value: "breast" },
  { label: "Face", value: "face" },
  { label: "Body", value: "body" },
  { label: "Not sure yet", value: "not_sure" },
];

const subProcedures: Record<string, ProcedureOption[]> = {
  breast: [
    { label: "Augmentation", value: "breast_augmentation" },
    { label: "Lift", value: "breast_lift" },
    { label: "Reduction", value: "breast_reduction" },
    { label: "Combination / Other", value: "breast_other" },
  ],
  face: [
    { label: "Nose (Rhinoplasty)", value: "rhinoplasty" },
    { label: "Eyelids (Blepharoplasty)", value: "blepharoplasty" },
    { label: "Brow Lift", value: "brow_lift" },
    { label: "Facelift", value: "facelift" },
    { label: "Other", value: "face_other" },
  ],
  body: [
    { label: "Liposuction", value: "liposuction" },
    { label: "Tummy Tuck", value: "tummy_tuck" },
    { label: "Mummy Makeover", value: "mummy_makeover" },
    { label: "Other", value: "body_other" },
  ],
};

export default function ProcedureStep({ data, onAnswer, onNext }: StepProps) {
  const [category, setCategory] = useState<string>("");

  const handleCategorySelect = (value: string) => {
    if (value === "not_sure") {
      onAnswer("procedure", "not_sure");
      setTimeout(onNext, 200);
      return;
    }
    setCategory(value);
  };

  const handleProcedureSelect = (value: string) => {
    onAnswer("procedure", value);
    setTimeout(onNext, 200);
  };

  const showSubProcedures = category && subProcedures[category];

  return (
    <QuizStep
      title={
        showSubProcedures
          ? "Which procedure are you considering?"
          : "What area are you interested in?"
      }
    >
      <AnimatePresence mode="wait">
        {showSubProcedures ? (
          <motion.div
            key="sub"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setCategory("")}
              className="flex items-center gap-1.5 text-warm-grey hover:text-burgundy
                text-sm font-medium mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to categories
            </button>
            <div className="flex flex-col gap-3">
              {subProcedures[category].map((option) => {
                const isSelected = data.procedure === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleProcedureSelect(option.value)}
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
          </motion.div>
        ) : (
          <motion.div
            key="categories"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-2 gap-4"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2
                  border-gray-200 bg-white hover:border-coral-mid hover:shadow-sm
                  transition-all duration-200 cursor-pointer"
              >
                <span className="text-lg font-medium text-near-black">
                  {cat.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </QuizStep>
  );
}
