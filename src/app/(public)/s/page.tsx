"use client";

import SocialHero from "@/components/landing/SocialHero";
import ProofStrip from "@/components/landing/ProofStrip";
import SocialOverwhelm from "@/components/landing/SocialOverwhelm";
import WhyDifferent from "@/components/landing/WhyDifferent";
import SocialProof from "@/components/landing/SocialProof";
import CostAnchor from "@/components/landing/CostAnchor";

/**
 * Short-form social landing page — optimised for paid social traffic (Meta/TikTok).
 * Fast path: Hero → Proof → Pain → Differentiation → Reviews → Price anchor → Quiz
 */
export default function SocialLandingPage() {
  return (
    <>
      <SocialHero />
      <ProofStrip />
      <SocialOverwhelm />
      <WhyDifferent />
      <SocialProof />
      <CostAnchor />
    </>
  );
}
