import type { Metadata } from "next";
import QuizContainer from "@/components/quiz/QuizContainer";

export const metadata: Metadata = {
  title: "Find Your Surgeon — Pirk",
  description:
    "Tell us what matters to you and get matched with vetted surgeons across Australia.",
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-cream">
      <QuizContainer />
    </main>
  );
}
