"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Clock, DollarSign, Award, Shield } from "lucide-react";
import BlurredContent from "./BlurredContent";

interface SurgeonData {
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
}

interface SurgeonMatchCardProps {
  surgeon: SurgeonData;
  rank: number;
  score: number;
  matchReason: string;
  strengthsSummary: string;
  isLocked: boolean;
  index: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-warm-grey">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ScoreBadge({ score, rank }: { score: number; rank: number }) {
  const percentage = Math.round(score * 100);
  const rankLabels = ["Top Match", "Strong Match", "Great Match"];

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
        #{rank}
      </div>
      <div className="rounded-full bg-coral-light px-3 py-1 text-xs font-semibold text-coral">
        {percentage}% Match
      </div>
      <span className="text-xs font-medium text-warm-grey">
        {rankLabels[rank - 1] || "Match"}
      </span>
    </div>
  );
}

export default function SurgeonMatchCard({
  surgeon,
  rank,
  score,
  matchReason,
  strengthsSummary,
  isLocked,
  index,
}: SurgeonMatchCardProps) {
  // Parse strengths
  let strengths: string[] = [];
  try {
    strengths = JSON.parse(strengthsSummary || "[]");
  } catch {
    if (strengthsSummary) strengths = [strengthsSummary];
  }

  // Parse price ranges for display
  let priceDisplay = "";
  try {
    const prices = JSON.parse(surgeon.priceRanges || "{}");
    const entries = Object.entries(prices);
    if (entries.length > 0) {
      const first = entries[0] as [string, { min?: number; max?: number }];
      if (first[1]?.min && first[1]?.max) {
        priceDisplay = `$${first[1].min.toLocaleString()} - $${first[1].max.toLocaleString()}`;
      }
    }
  } catch {
    // No price data available
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.3,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-coral-light/50 bg-white shadow-lg"
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-white to-coral-light/20 p-6">
        <ScoreBadge score={score} rank={rank} />
        <h3 className="mt-3 text-2xl font-bold text-burgundy">
          {surgeon.name}
        </h3>
        <p className="text-warm-grey">{surgeon.practiceName}</p>
        <div className="mt-2 flex items-center gap-4">
          <StarRating rating={surgeon.googleRating} />
          <span className="text-xs text-warm-grey">
            ({surgeon.googleReviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-6">
        {/* Always visible: Location */}
        <div className="flex items-center gap-2 text-sm text-warm-grey">
          <MapPin className="h-4 w-4 text-coral" />
          <span>
            {surgeon.suburb}
            {surgeon.suburb && surgeon.state ? ", " : ""}
            {surgeon.state}
          </span>
        </div>

        {/* Match Reason - always visible as teaser */}
        <p className="text-sm leading-relaxed text-near-black">
          {matchReason || "Strong match based on your criteria."}
        </p>

        {/* Locked sections */}
        {isLocked ? (
          <>
            {/* Qualifications - blurred */}
            <BlurredContent label="qualifications">
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-4 w-4 text-coral" />
                <div>
                  <p className="text-sm font-medium text-near-black">Qualifications</p>
                  <p className="text-sm text-warm-grey">
                    {surgeon.experienceQualification || "FRACS qualified, specialist training details available"}
                  </p>
                </div>
              </div>
            </BlurredContent>

            {/* Cost Breakdown - blurred */}
            <BlurredContent label="cost details">
              <div className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-coral" />
                <div>
                  <p className="text-sm font-medium text-near-black">Cost Breakdown</p>
                  <p className="text-sm text-warm-grey">
                    Consultation: {surgeon.consultCost || "$250 - $350"}
                  </p>
                  {priceDisplay && (
                    <p className="text-sm text-warm-grey">
                      Surgery: {priceDisplay}
                    </p>
                  )}
                </div>
              </div>
            </BlurredContent>

            {/* Wait Times - blurred */}
            <BlurredContent label="wait times">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-coral" />
                <div>
                  <p className="text-sm font-medium text-near-black">Wait Times</p>
                  <p className="text-sm text-warm-grey">
                    Consultation: {surgeon.consultWaitTime || "2-4 weeks"}
                  </p>
                  <p className="text-sm text-warm-grey">
                    Surgery: {surgeon.surgeryWaitTime || "3-6 months"}
                  </p>
                </div>
              </div>
            </BlurredContent>

            {/* Payment Plans - blurred */}
            <BlurredContent label="payment options">
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 text-coral" />
                <div>
                  <p className="text-sm font-medium text-near-black">Payment Options</p>
                  <p className="text-sm text-warm-grey">
                    {surgeon.paymentPlansAvailable
                      ? `Payment plans available: ${surgeon.paymentPlanDetails || "Details on request"}`
                      : "Payment plan details available"}
                  </p>
                </div>
              </div>
            </BlurredContent>

            {/* Strengths - blurred */}
            {strengths.length > 0 && (
              <BlurredContent label="detailed strengths">
                <div>
                  <p className="mb-2 text-sm font-medium text-near-black">
                    Why This Surgeon Is Right For You
                  </p>
                  <ul className="space-y-1">
                    {strengths.map((s, i) => (
                      <li key={i} className="text-sm text-warm-grey">
                        - {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurredContent>
            )}
          </>
        ) : (
          <>
            {/* Qualifications - visible */}
            {surgeon.experienceQualification && (
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-4 w-4 text-coral" />
                <div>
                  <p className="text-sm font-medium text-near-black">Qualifications</p>
                  <p className="text-sm text-warm-grey">
                    {surgeon.experienceQualification}
                  </p>
                </div>
              </div>
            )}

            {/* Cost Breakdown - visible */}
            <div className="flex items-start gap-2">
              <DollarSign className="mt-0.5 h-4 w-4 text-coral" />
              <div>
                <p className="text-sm font-medium text-near-black">Cost Breakdown</p>
                {surgeon.consultCost && (
                  <p className="text-sm text-warm-grey">
                    Consultation: {surgeon.consultCost}
                  </p>
                )}
                {priceDisplay && (
                  <p className="text-sm text-warm-grey">
                    Surgery: {priceDisplay}
                  </p>
                )}
              </div>
            </div>

            {/* Wait Times - visible */}
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-coral" />
              <div>
                <p className="text-sm font-medium text-near-black">Wait Times</p>
                {surgeon.consultWaitTime && (
                  <p className="text-sm text-warm-grey">
                    Consultation: {surgeon.consultWaitTime}
                  </p>
                )}
                {surgeon.surgeryWaitTime && (
                  <p className="text-sm text-warm-grey">
                    Surgery: {surgeon.surgeryWaitTime}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Plans - visible */}
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 text-coral" />
              <div>
                <p className="text-sm font-medium text-near-black">Payment Options</p>
                <p className="text-sm text-warm-grey">
                  {surgeon.paymentPlansAvailable
                    ? `Payment plans available: ${surgeon.paymentPlanDetails || "Details on request"}`
                    : "No payment plans listed"}
                </p>
              </div>
            </div>

            {/* Strengths - visible */}
            {strengths.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-near-black">
                  Why This Surgeon Is Right For You
                </p>
                <ul className="space-y-1">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-warm-grey">
                      <span className="mt-0.5 text-coral">&#10003;</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Website link */}
            {surgeon.website && (
              <a
                href={surgeon.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-coral underline underline-offset-2 transition-colors hover:text-burgundy"
              >
                Visit Website
              </a>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
