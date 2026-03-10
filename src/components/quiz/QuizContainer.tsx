"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProgressBar from "./ProgressBar";
import NarrowingIndicator from "./SurgeonGrid";
import InsightCard from "./InsightCard";
import { slideVariants } from "./QuizStep";
import type { QuizData, QuizField, InsightCardData } from "./types";
import { initialQuizData } from "./types";

import ProcedureStep from "./steps/ProcedureStep";
import LocationStep from "./steps/LocationStep";
import TravelStep from "./steps/TravelStep";
import PriceTransparencyStep from "./steps/PriceTransparencyStep";
import PaymentPlansStep from "./steps/PaymentPlansStep";
import TimeSpentStep from "./steps/TimeSpentStep";
import ConsultationsStep from "./steps/ConsultationsStep";
import PrioritiesStep from "./steps/PrioritiesStep";
import ConfidenceStep from "./steps/ConfidenceStep";
import BudgetStep from "./steps/BudgetStep";
import RequirementsStep from "./steps/RequirementsStep";
import AnythingElseStep from "./steps/AnythingElseStep";
import EmailCaptureStep from "./steps/EmailCaptureStep";
import PhoneCaptureStep from "./steps/PhoneCaptureStep";

// ---- Step Definitions ----

type StepEntry =
  | { type: "step"; id: string; label: string }
  | { type: "insight"; id: string; data: InsightCardData };

const STEPS: StepEntry[] = [
  // Phase 1: Easy start
  { type: "step", id: "procedure", label: "Procedure" },
  { type: "step", id: "location", label: "Location" },
  {
    type: "insight",
    id: "insight-1",
    data: {
      icon: "ShieldCheck",
      stat: "200+",
      description: "surgeons vetted across Australia — and we know which ones are right for you",
    },
  },
  // Phase 2: Complexity reveal
  { type: "step", id: "travelWillingness", label: "Travel" },
  { type: "step", id: "priceTransparency", label: "Pricing" },
  { type: "step", id: "paymentPlans", label: "Financing" },
  {
    type: "insight",
    id: "insight-2",
    data: {
      icon: "DollarSign",
      stat: "$600–$2,500",
      description: "saved vs. booking 3–5 consultations on your own",
    },
  },
  { type: "step", id: "timeSpent", label: "Research" },
  { type: "step", id: "consultations", label: "Consultations" },
  {
    type: "insight",
    id: "insight-3",
    data: {
      icon: "TrendingUp",
      stat: "50–70 hrs",
      description: "of research — done for you in 2 minutes",
    },
  },
  // Phase 3: Preferences
  { type: "step", id: "priorities", label: "Priorities" },
  { type: "step", id: "confidence", label: "Confidence" },
  { type: "step", id: "budget", label: "Budget" },
  { type: "step", id: "requirements", label: "Preferences" },
  {
    type: "insight",
    id: "insight-4",
    data: {
      icon: "Users",
      stat: "2,500+",
      description: "patients guided — you're in good hands",
    },
  },
  // Phase 4: Emotional capture + lead
  { type: "step", id: "anythingElse", label: "About You" },
  { type: "step", id: "emailCapture", label: "Your Details" },
  { type: "step", id: "phoneCapture", label: "Priority Access" },
];

// Count only real steps (not insights) for the progress bar
const REAL_STEPS = STEPS.filter((s) => s.type === "step");
const TOTAL_REAL_STEPS = REAL_STEPS.length;

function getRealStepIndex(currentIndex: number): number {
  let count = 0;
  for (let i = 0; i < currentIndex; i++) {
    if (STEPS[i].type === "step") count++;
  }
  // If current step is a real step, include it
  if (STEPS[currentIndex]?.type === "step") count++;
  return count;
}

function getCurrentLabel(currentIndex: number): string {
  const step = STEPS[currentIndex];
  if (!step) return "";
  if (step.type === "step") return step.label;
  return "Loading...";
}

export default function QuizContainer() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<QuizData>(initialQuizData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = STEPS[currentIndex];

  // Auto-advance insight cards after 2.5 seconds
  useEffect(() => {
    if (currentStep?.type === "insight") {
      const timer = setTimeout(() => {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentStep?.type]);

  const handleAnswer = useCallback(
    (field: QuizField, value: string | string[]) => {
      setData((prev) => ({ ...prev, [field]: value } as QuizData));
    },
    []
  );

  const goNext = useCallback(() => {
    if (currentIndex < STEPS.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      // Skip insight cards when going back
      let target = currentIndex - 1;
      while (target > 0 && STEPS[target].type === "insight") {
        target--;
      }
      setCurrentIndex(target);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/results/${result.matchId}`);
      } else {
        // If the API fails, still try to redirect with a generated ID
        const fallbackId = crypto.randomUUID();
        router.push(`/results/${fallbackId}`);
      }
    } catch {
      const fallbackId = crypto.randomUUID();
      router.push(`/results/${fallbackId}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, router]);

  const handlePhoneNext = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handlePhoneSkip = useCallback(() => {
    handleAnswer("phone", "");
    handleSubmit();
  }, [handleAnswer, handleSubmit]);

  // Build the step props shared by all step components
  const stepProps = {
    data,
    onAnswer: handleAnswer,
    onNext: goNext,
    onBack: goBack,
  };

  // Determine whether to show back button
  const showBack =
    currentIndex > 0 && currentStep?.type === "step";

  // Render the content for the current step
  const renderStep = () => {
    if (!currentStep) return null;

    if (currentStep.type === "insight") {
      return (
        <InsightCard
          icon={currentStep.data.icon}
          stat={currentStep.data.stat}
          description={currentStep.data.description}
        />
      );
    }

    switch (currentStep.id) {
      case "procedure":
        return <ProcedureStep {...stepProps} />;
      case "location":
        return <LocationStep {...stepProps} />;
      case "travelWillingness":
        return <TravelStep {...stepProps} />;
      case "priceTransparency":
        return <PriceTransparencyStep {...stepProps} />;
      case "paymentPlans":
        return <PaymentPlansStep {...stepProps} />;
      case "timeSpent":
        return <TimeSpentStep {...stepProps} />;
      case "consultations":
        return <ConsultationsStep {...stepProps} />;
      case "priorities":
        return <PrioritiesStep {...stepProps} />;
      case "confidence":
        return <ConfidenceStep {...stepProps} />;
      case "budget":
        return <BudgetStep {...stepProps} />;
      case "requirements":
        return <RequirementsStep {...stepProps} />;
      case "anythingElse":
        return <AnythingElseStep {...stepProps} />;
      case "emailCapture":
        return <EmailCaptureStep {...stepProps} />;
      case "phoneCapture":
        return (
          <PhoneCaptureStep
            {...stepProps}
            onNext={handlePhoneNext}
            onSkip={handlePhoneSkip}
          />
        );
      default:
        return null;
    }
  };

  const realStepNumber = getRealStepIndex(currentIndex);
  const stepLabel = getCurrentLabel(currentIndex);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Progress bar -- hidden on insight cards */}
      {currentStep?.type === "step" && (
        <>
          <ProgressBar
            currentStep={realStepNumber}
            totalSteps={TOTAL_REAL_STEPS}
            label={stepLabel}
          />
          <NarrowingIndicator progress={realStepNumber / TOTAL_REAL_STEPS} />
        </>
      )}

      {/* Back button */}
      {showBack && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-warm-grey hover:text-burgundy
            text-sm font-medium mb-6 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Step content with animations */}
      <div className="flex-1 flex items-start justify-center pt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep?.id ?? currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Loading overlay for submission */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cream/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm mx-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-coral border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-burgundy">
                Finding your matches...
              </p>
              <p className="text-sm text-warm-grey mt-1">
                This will only take a moment.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
