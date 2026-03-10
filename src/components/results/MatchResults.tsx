"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Star, MapPin, User, Lock } from "lucide-react";
import SurgeonMatchCard from "./SurgeonMatchCard";
import TierUpgradeCards from "./TierUpgradeCards";
import { trackPurchase } from "@/lib/tracking";

interface MatchSurgeonData {
  id: string;
  rank: number;
  finalScore: number;
  matchReason: string;
  strengthsSummary: string;
  considerationsSummary: string;
  surgeon: {
    id: string;
    name: string;
    practiceName: string;
    suburb: string;
    state: string;
    googleRating: number;
    googleReviewCount: number;
    experienceQualification: string;
    consultWaitTime: string;
    consultCost: string;
    surgeryWaitTime: string;
    paymentPlansAvailable: boolean;
    paymentPlanDetails: string;
    priceRanges: string;
    beforeAfterAvailable: boolean;
    website: string;
  };
}

interface MatchData {
  id: string;
  status: string;
  tier: string;
  client: {
    id: string;
    name: string;
    email: string;
    procedure: string;
    tier: string;
  };
  matchSurgeons: MatchSurgeonData[];
}

interface MatchResultsProps {
  match: MatchData;
}

// Map procedure codes to human-readable specialist labels
function getProcedureLabel(procedure: string): string {
  const labels: Record<string, string> = {
    breast_augmentation: "Breast Augmentation",
    breast_lift: "Breast Lift",
    breast_reduction: "Breast Reduction",
    breast_other: "Breast Surgery",
    rhinoplasty: "Rhinoplasty",
    blepharoplasty: "Blepharoplasty",
    brow_lift: "Brow Lift",
    facelift: "Facelift",
    face_other: "Facial Surgery",
    liposuction: "Liposuction",
    tummy_tuck: "Tummy Tuck",
    mummy_makeover: "Mummy Makeover",
    body_other: "Body Contouring",
    not_sure: "Cosmetic Surgery",
  };
  return labels[procedure] || "Cosmetic Surgery";
}

// Placeholder data for blurred cards when matches haven't been generated yet
const placeholderSurgeons = [
  {
    rank: 1,
    score: 0.94,
    label: "Top Match",
    initials: "SM",
  },
  {
    rank: 2,
    score: 0.89,
    label: "Strong Match",
    initials: "JT",
  },
  {
    rank: 3,
    score: 0.85,
    label: "Great Match",
    initials: "ER",
  },
];

function PlaceholderCard({
  surgeon,
  index,
  procedureLabel,
}: {
  surgeon: (typeof placeholderSurgeons)[0];
  index: number;
  procedureLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-coral-light/50 bg-white shadow-lg"
    >
      {/* Match badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
          {Math.round(surgeon.score * 100)}%
        </div>
      </div>

      <div className="p-6 text-center">
        {/* Circle avatar */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-coral-light to-coral/20">
          <User className="h-10 w-10 text-coral/50" />
        </div>

        {/* Name — redacted */}
        <h3 className="text-xl font-bold text-burgundy">Dr. XXXXX</h3>
        <p className="mt-1 text-sm font-medium text-coral">
          {procedureLabel} Specialist
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-4 w-4 fill-amber-400 text-amber-400"
            />
          ))}
          <span className="ml-1 text-sm text-warm-grey">4.8+</span>
        </div>

        {/* Rank label */}
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-warm-grey">
          #{surgeon.rank} {surgeon.label}
        </p>

        {/* Blurred details */}
        <div className="relative mt-5 rounded-xl bg-gray-50 p-4">
          <div
            className="select-none space-y-2"
            style={{
              filter: "blur(6px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            <p className="text-sm text-near-black">
              FRACS qualified with 15+ years experience
            </p>
            <p className="text-sm text-near-black">
              Consultation: $250 | Surgery: $14,500
            </p>
            <p className="text-sm text-near-black">
              Wait time: 3 weeks | Availability: Open
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50">
            <div className="flex items-center gap-1.5 rounded-full bg-coral-light px-4 py-2">
              <Lock className="h-3.5 w-3.5 text-coral" />
              <span className="text-xs font-semibold text-coral">
                Unlock full profile
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MatchResults({ match }: MatchResultsProps) {
  const searchParams = useSearchParams();
  const [currentTier, setCurrentTier] = useState(match.tier || "free");

  // Check if the user just paid
  useEffect(() => {
    const paid = searchParams.get("paid");
    const tier = searchParams.get("tier");

    if (paid === "true" && tier) {
      setCurrentTier(tier);

      // Fire purchase tracking
      const value = tier === "concierge" ? 699 : 149;
      trackPurchase(tier, value);
    }
  }, [searchParams]);

  const isLocked = currentTier === "free";
  const hasRealMatches = match.matchSurgeons.length > 0;
  const procedureLabel = getProcedureLabel(match.client.procedure);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-cream via-cream to-coral-light/30 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pirk-sub text-coral">Your Surgeon Matches</p>
            <h1 className="text-pirk-heading mt-3 text-3xl font-bold text-burgundy md:text-4xl lg:text-5xl">
              {match.client.name}, we found your top {procedureLabel.toLowerCase()} surgeons
            </h1>
            <p className="mt-4 text-lg text-warm-grey">
              {isLocked
                ? "Unlock to see full profiles, costs, wait times, and everything you need to choose."
                : `Your personalised ${procedureLabel.toLowerCase()} surgeon matches are ready.`}
            </p>

            {!isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
              >
                <Shield className="h-4 w-4" />
                Full profiles unlocked
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Match cards */}
      <div className="mx-auto max-w-5xl px-5 py-10">
        {hasRealMatches && !isLocked ? (
          // Real surgeon matches — full width stacked when unlocked
          <div className="space-y-8">
            {match.matchSurgeons.map((ms, index) => (
              <SurgeonMatchCard
                key={ms.id}
                surgeon={ms.surgeon}
                rank={ms.rank}
                score={ms.finalScore}
                matchReason={ms.matchReason}
                strengthsSummary={ms.strengthsSummary}
                isLocked={false}
                index={index}
              />
            ))}
          </div>
        ) : (
          // Side-by-side blurred placeholder cards
          <div className="grid gap-6 md:grid-cols-3">
            {placeholderSurgeons.map((surgeon, index) => (
              <PlaceholderCard
                key={surgeon.rank}
                surgeon={surgeon}
                index={index}
                procedureLabel={procedureLabel}
              />
            ))}
          </div>
        )}

        {/* Upgrade section - shown when locked */}
        {isLocked && (
          <TierUpgradeCards
            matchId={match.id}
            clientEmail={match.client.email}
          />
        )}

        {/* Footer trust section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 border-t border-gray-200 pt-10 text-center"
        >
          <p className="text-sm text-warm-grey">
            All surgeons are independently verified by Pirk. We have no
            commercial relationships with any listed surgeons.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-warm-grey">
            <span>FRACS Verified</span>
            <span className="text-coral-mid">|</span>
            <span>Mystery Shopped</span>
            <span className="text-coral-mid">|</span>
            <span>Patient Reviewed</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
