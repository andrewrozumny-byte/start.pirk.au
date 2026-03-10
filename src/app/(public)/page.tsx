"use client";

import Hero from "@/components/landing/Hero";
// import AsSeenIn from "@/components/landing/AsSeenIn"; // Re-enable when real press logos are available
import ProofStrip from "@/components/landing/ProofStrip";
import OverwhelmSection from "@/components/landing/OverwhelmSection";
import RiskSection from "@/components/landing/RiskSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import ValueProps from "@/components/landing/ValueProps";
import ComparisonTable from "@/components/landing/ComparisonTable";
import CostAnchor from "@/components/landing/CostAnchor";
import PricingCards from "@/components/landing/PricingCards";
import Guarantee from "@/components/landing/Guarantee";
import WhatHappensNext from "@/components/landing/WhatHappensNext";
import FounderStory from "@/components/landing/FounderStory";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";

/**
 * Long-form trust-building landing page.
 *
 * Flow: Hero → Credibility → Pain → Solution → Proof → Value → Price → Trust → CTA
 * - AsSeenIn commented out until real press logos are available
 * - Guarantee section after pricing (risk reversal)
 * - Procedure selector in hero for interactive engagement
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* <AsSeenIn /> — Re-enable when real press logos are available */}
      <ProofStrip />
      <OverwhelmSection />
      <RiskSection />
      <HowItWorks />
      <Testimonials />
      <ValueProps />
      <ComparisonTable />
      <CostAnchor />
      <PricingCards />
      <Guarantee />
      <WhatHappensNext />
      <FounderStory />
      <FAQ />
      <FinalCTA />
    </>
  );
}
