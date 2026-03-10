export interface QuizData {
  procedure: string;
  location: string;
  priceTransparency: string;
  paymentPlans: string;
  timeSpent: string;
  consultations: string;
  consultationSurgeonName: string;
  priorities: string[];
  confidence: string;
  budget: string;
  requirements: string[];
  travelWillingness: string;
  anythingElse: string;
  email: string;
  name: string;
  phone: string;
}

export const initialQuizData: QuizData = {
  procedure: "",
  location: "",
  priceTransparency: "",
  paymentPlans: "",
  timeSpent: "",
  consultations: "",
  consultationSurgeonName: "",
  priorities: [],
  confidence: "",
  budget: "",
  requirements: [],
  travelWillingness: "",
  anythingElse: "",
  email: "",
  name: "",
  phone: "",
};

export type QuizField = keyof QuizData;

export interface StepProps {
  data: QuizData;
  onAnswer: (field: QuizField, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface InsightCardData {
  icon: string;
  stat: string;
  description: string;
}

export type StepConfig =
  | { type: "step"; component: string; label: string }
  | { type: "insight"; data: InsightCardData };
