"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, MessageCircle } from "lucide-react";
import { trackInitiateCheckout } from "@/lib/tracking";

interface TierUpgradeCardsProps {
  matchId: string;
  clientEmail: string;
}

const guidedFeatures = [
  "Full surgeon profiles unlocked",
  "Side-by-side cost breakdowns",
  "Wait times & current availability",
  "Payment plan comparisons",
  "Know exactly what to ask at your consult",
  "A real person who picks up the phone",
];

const conciergeFeatures = [
  "Everything in Choose With Confidence, plus:",
  "Your own dedicated Pirk coordinator",
  "We book and manage your consultations",
  "We negotiate with surgeons on your behalf",
  "Post-surgery check-ins & ongoing support",
  "Completely personalised to your journey",
];

// $149 over 6 months = ~$0.82/day
const GUIDED_DAILY = "$0.82";
const GUIDED_TOTAL = "$149";
// $699 over 6 months = ~$3.83/day
const CONCIERGE_DAILY = "$3.83";
const CONCIERGE_TOTAL = "$699";

function LoadingSpinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M4 12a8 8 0 018-8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-75"
        />
      </svg>
      Redirecting...
    </span>
  );
}

export default function TierUpgradeCards({
  matchId,
  clientEmail,
}: TierUpgradeCardsProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleCheckout(tier: "guided" | "concierge") {
    setLoadingTier(tier);
    trackInitiateCheckout(tier);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          clientEmail,
          tier,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setLoadingTier(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingTier(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-12"
    >
      <div className="mb-8 text-center">
        <h2 className="text-pirk-heading text-3xl font-bold text-burgundy">
          Unlock Your Full Results
        </h2>
        <p className="mt-2 text-warm-grey">
          6 months of expert support — for less than a coffee a day.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {/* Choose With Confidence — $149 */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-coral bg-white shadow-lg">
          {/* Badge */}
          <div className="absolute top-0 right-0 rounded-bl-xl bg-coral px-4 py-1.5">
            <span className="text-xs font-bold tracking-wide text-white uppercase">
              Most Popular
            </span>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-coral" />
              <h3 className="text-lg font-bold text-burgundy">
                Choose With Confidence
              </h3>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-near-black">
                  {GUIDED_DAILY}
                </span>
                <span className="text-warm-grey">/day</span>
              </div>
              <p className="mt-1 text-sm text-warm-grey">
                {GUIDED_TOTAL} one-time for 6 months of support
              </p>
            </div>

            <p className="mt-3 text-sm text-warm-grey">
              Unlock full surgeon profiles with all the details you need to
              choose with confidence.
            </p>

            <ul className="mt-6 space-y-3">
              {guidedFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                  <span className="text-sm text-near-black">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout("guided")}
              disabled={loadingTier !== null}
              className="mt-8 w-full rounded-full bg-coral px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingTier === "guided" ? (
                <LoadingSpinner />
              ) : (
                "Unlock Full Profiles"
              )}
            </button>
          </div>
        </div>

        {/* Fully Guided — $699 */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-burgundy bg-white shadow-lg">
          {/* Badge */}
          <div className="absolute top-0 right-0 rounded-bl-xl bg-burgundy px-4 py-1.5">
            <span className="text-xs font-bold tracking-wide text-white uppercase">
              Premium
            </span>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-burgundy" />
              <h3 className="text-lg font-bold text-burgundy">Fully Guided</h3>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-near-black">
                  {CONCIERGE_DAILY}
                </span>
                <span className="text-warm-grey">/day</span>
              </div>
              <p className="mt-1 text-sm text-warm-grey">
                {CONCIERGE_TOTAL} one-time for 6 months of support
              </p>
            </div>

            <p className="mt-3 text-sm text-warm-grey">
              A dedicated advisor who guides you through every step, from
              shortlist to surgery day.
            </p>

            <ul className="mt-6 space-y-3">
              {conciergeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                  <span className="text-sm text-near-black">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <a
                href="/book-call"
                className="block w-full rounded-full border-2 border-burgundy bg-burgundy px-6 py-3.5 text-center font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
              >
                Book a Free Strategy Call
              </a>

              <button
                onClick={() => handleCheckout("concierge")}
                disabled={loadingTier !== null}
                className="w-full rounded-full border-2 border-burgundy bg-white px-6 py-3 text-center text-sm font-semibold text-burgundy transition-all hover:bg-burgundy/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingTier === "concierge" ? (
                  <LoadingSpinner />
                ) : (
                  `Or Pay Now — ${CONCIERGE_TOTAL}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Package */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-warm-grey/30 bg-white/80 shadow-sm">
          <div className="flex h-full flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-warm-grey" />
                <h3 className="text-lg font-bold text-burgundy">
                  Custom Package
                </h3>
              </div>

              <div className="mt-4">
                <span className="text-4xl font-extrabold text-near-black">
                  Bespoke
                </span>
              </div>

              <p className="mt-3 text-sm text-warm-grey">
                Need something specific? We&apos;ll build a package around your
                exact situation — whether it&apos;s a revision, multiple
                procedures, or complex requirements.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-warm-grey" />
                  <span className="text-sm text-near-black">
                    Tailored to your exact needs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-warm-grey" />
                  <span className="text-sm text-near-black">
                    Multiple procedures or revisions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-warm-grey" />
                  <span className="text-sm text-near-black">
                    Extended support beyond 6 months
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-warm-grey" />
                  <span className="text-sm text-near-black">
                    Pricing agreed before you commit
                  </span>
                </li>
              </ul>
            </div>

            <a
              href="/book-call"
              className="mt-8 block w-full rounded-full border-2 border-warm-grey/30 bg-white px-6 py-3.5 text-center font-semibold text-burgundy shadow-sm transition-all hover:border-burgundy hover:shadow-md"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>

      {/* Cost anchor */}
      <p className="mt-6 text-center text-sm text-warm-grey">
        A single wrong consultation costs $200–$500. A revision costs $15,000+.
        Expert guidance starts at {GUIDED_DAILY}/day.
      </p>
    </motion.div>
  );
}
