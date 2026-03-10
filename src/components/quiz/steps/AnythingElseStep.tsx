"use client";

import QuizStep from "../QuizStep";
import type { StepProps } from "../types";

export default function AnythingElseStep({
  data,
  onAnswer,
  onNext,
}: StepProps) {
  return (
    <QuizStep
      title="Is there anything important we should know about you?"
      subtitle="This is completely optional — but it helps us find the best match for your situation."
    >
      <textarea
        value={data.anythingElse}
        onChange={(e) => onAnswer("anythingElse", e.target.value)}
        placeholder="e.g. I've had a previous surgery, I have a specific concern, I've been thinking about this for years..."
        rows={5}
        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-near-black
          placeholder:text-warm-grey/50 focus:outline-none focus:border-coral transition-colors
          resize-none mb-6"
      />
      <button
        onClick={onNext}
        className="w-full py-4 bg-coral text-white rounded-xl text-base font-semibold
          hover:bg-coral/90 transition-all duration-200 shadow-md cursor-pointer"
      >
        {data.anythingElse.trim() ? "Continue" : "Skip"}
      </button>
    </QuizStep>
  );
}
