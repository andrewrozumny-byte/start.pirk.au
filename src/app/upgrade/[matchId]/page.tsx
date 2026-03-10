"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  Calendar,
  MessageCircle,
  Shield,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Calendar,
    title: "We Book Your Consultations",
    desc: "We contact your matched surgeons, schedule appointments, and handle all the back-and-forth so you don't have to.",
  },
  {
    icon: MessageCircle,
    title: "Pre-Appointment Prep",
    desc: "Personalised question guides for each surgeon, so you walk into every consult feeling prepared and confident.",
  },
  {
    icon: Shield,
    title: "Quote Comparison & Negotiation",
    desc: "We break down every quote, compare inclusions, and ensure you understand exactly what you're paying for.",
  },
  {
    icon: Heart,
    title: "Post-Op Recovery Support",
    desc: "Check-ins throughout your recovery, coordination with your surgeon's team, and a direct line to us whenever you need it.",
  },
  {
    icon: Star,
    title: "Dedicated Pirk Concierge",
    desc: "One person who knows your case inside out — from first consult to full recovery.",
  },
];

export default function UpgradePage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#4D0121] to-[#6a0230] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-coral/5 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10 text-center">
          <p className="text-[11px] uppercase tracking-[4px] text-coral font-semibold mb-4">
            Your surgeon shortlist is ready
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4 tracking-tight">
            This is just the beginning.{" "}
            <span className="text-coral">Now let us do the rest.</span>
          </h1>
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            You have the information — but navigating consultations, comparing
            quotes, and coordinating surgery is a journey in itself. Upgrade to
            Full Support and let Pirk handle everything.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl border border-coral-mid/30 shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-[10px] uppercase tracking-[3px] text-coral font-semibold mb-6">
              What&apos;s Included
            </h2>

            <div className="space-y-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-near-black mb-0.5">
                      {f.title}
                    </h3>
                    <p className="text-xs text-warm-grey leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-coral-mid/30 bg-cream/50 p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full sm:w-auto bg-coral text-white hover:bg-coral/90 disabled:opacity-50 rounded-full px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {loading ? "Redirecting..." : "Upgrade Now"}
                {!loading && <ArrowRight className="w-3 h-3" />}
              </button>

              <a
                href="https://calendly.com/pirk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white text-near-black border border-coral-mid/30 hover:bg-cream rounded-full px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4 text-coral" />
                Book a Chat First
              </a>
            </div>

            <p className="text-[11px] text-warm-grey mt-4 text-center sm:text-left">
              One-time fee &middot; No lock-in contracts &middot; 100% money-back
              guarantee if you're not satisfied
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial / Trust */}
      <div className="max-w-3xl mx-auto px-6 py-10 text-center">
        <p className="text-xs text-warm-grey">
          Trusted by clients across Australia &middot; AHPRA-compliant &middot;{" "}
          <a
            href="https://www.pirk.com.au/terms-and-conditions"
            className="text-coral hover:underline"
          >
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
}
