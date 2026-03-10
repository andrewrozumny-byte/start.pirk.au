"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("match_id");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-semibold text-near-black tracking-tight mb-2">
          Welcome to Full Support
        </h1>

        <p className="text-warm-grey text-sm mb-8 leading-relaxed">
          Your upgrade is confirmed. A member of the Pirk team will be in touch
          within 24 hours to kick things off. We&apos;re excited to guide you
          through the rest of your journey.
        </p>

        <div className="bg-white rounded-xl border border-coral-mid/30 p-5 mb-6 text-left">
          <h2 className="text-[10px] uppercase tracking-[3px] text-coral font-semibold mb-3">
            What happens next
          </h2>
          <ol className="space-y-2 text-sm text-near-black">
            <li className="flex gap-2">
              <span className="text-coral font-semibold">1.</span>
              We&apos;ll review your match results and surgeon shortlist
            </li>
            <li className="flex gap-2">
              <span className="text-coral font-semibold">2.</span>
              Your dedicated concierge will reach out to introduce themselves
            </li>
            <li className="flex gap-2">
              <span className="text-coral font-semibold">3.</span>
              We&apos;ll start booking consultations on your behalf
            </li>
          </ol>
        </div>

        {matchId && (
          <Link
            href={`/match/${matchId}`}
            className="inline-flex items-center gap-2 text-sm text-coral hover:text-coral/80 font-medium transition-colors"
          >
            View your match results <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-warm-grey">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
