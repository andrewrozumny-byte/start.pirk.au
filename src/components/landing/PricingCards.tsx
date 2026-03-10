"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  dailyPrice?: string;
  priceNote?: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  premium?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Know Your Options",
    price: "$149",
    dailyPrice: "$0.82/day",
    priceNote: "6 months of support",
    tagline: "See exactly who you should be talking to",
    features: [
      "Tell us what matters — we do the rest",
      "Your top surgeon matches, ranked for you",
      "Real qualifications & verified reviews",
      "Cost indications so there are no surprises",
      "Email support from our team",
    ],
    cta: "Get My Matches",
    href: "/quiz",
  },
  {
    name: "Choose With Confidence",
    price: "$699",
    dailyPrice: "$3.83/day",
    priceNote: "6 months of dedicated support",
    tagline: "Everything you need to choose and prepare",
    features: [
      "Everything in Know Your Options",
      "Side-by-side cost breakdowns across surgeons",
      "Wait times & current availability",
      "Curated before & after photos",
      "Payment plan options compared for you",
      "Know exactly what to ask at your consult",
      "We review your quotes so you\u2019re not overpaying",
      "A real person who picks up the phone",
    ],
    cta: "Get Started",
    href: "/quiz",
    popular: true,
  },
  {
    name: "Fully Guided",
    price: "Bespoke",
    priceNote: "Designed around your journey",
    tagline: "We handle everything so you don\u2019t have to",
    features: [
      "Everything in Choose With Confidence",
      "Your own dedicated Pirk coordinator",
      "We book and manage your consultations",
      "We negotiate with surgeons on your behalf",
      "Post-surgery check-ins & ongoing support",
      "Direct surgeon liaison throughout",
      "Completely personalised to your needs",
    ],
    cta: "Book a Free Call",
    href: "/book-call",
    premium: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PricingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="pricing" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How Much Support Do You Want?
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-center text-lg text-warm-grey"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          A single wrong consultation costs $200–$500. A revision costs $15,000+.
          The right guidance costs a fraction of one mistake.
        </motion.p>

        <div
          ref={ref}
          className="mt-14 grid items-stretch gap-6 md:grid-cols-3 md:gap-8"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={`relative flex flex-col rounded-xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md ${
                tier.popular
                  ? "border-coral shadow-md md:scale-105 md:shadow-lg"
                  : tier.premium
                    ? "border-burgundy/20"
                    : "border-gray-200"
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-coral px-4 py-1 text-xs font-bold tracking-wide text-white uppercase">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="text-center">
                <h3
                  className={`text-xl font-bold ${tier.premium ? "text-burgundy" : "text-near-black"}`}
                >
                  {tier.name}
                </h3>
                {tier.dailyPrice ? (
                  <div className="mt-4">
                    <p>
                      <span className="text-4xl font-extrabold text-burgundy">
                        {tier.dailyPrice.replace("/day", "")}
                      </span>
                      <span className="text-lg text-warm-grey">/day</span>
                    </p>
                    <p className="mt-1 text-sm text-warm-grey">
                      {tier.price} one-time
                      {tier.priceNote ? ` · ${tier.priceNote}` : ""}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-4">
                      <span className="text-4xl font-extrabold text-burgundy">
                        {tier.price}
                      </span>
                    </p>
                    {tier.priceNote && (
                      <p className="mt-1 text-xs font-medium text-coral">
                        {tier.priceNote}
                      </p>
                    )}
                  </>
                )}
                <p className="mt-2 text-sm text-warm-grey">{tier.tagline}</p>
              </div>

              {/* Features */}
              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-5 w-5 shrink-0 ${tier.premium ? "text-burgundy" : "text-coral"}`}
                    />
                    <span className="text-sm text-near-black">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.href}
                className={`mt-8 block rounded-full py-3 text-center font-semibold transition-all ${
                  tier.popular
                    ? "bg-coral text-white shadow-md hover:shadow-lg hover:brightness-105"
                    : tier.premium
                      ? "bg-burgundy text-cream hover:brightness-110"
                      : "border-2 border-coral text-coral hover:bg-coral hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Start with a chat option */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="mx-auto inline-flex items-center gap-3 rounded-xl border border-burgundy/10 bg-white px-6 py-4 shadow-sm">
            <MessageCircle className="h-5 w-5 text-coral" />
            <p className="text-near-black">
              Not sure which is right for you?{" "}
              <Link
                href="/book-call"
                className="font-semibold text-coral underline underline-offset-2 transition-colors hover:text-burgundy"
              >
                Start with a free chat
              </Link>{" "}
              — no commitment, no pressure.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
