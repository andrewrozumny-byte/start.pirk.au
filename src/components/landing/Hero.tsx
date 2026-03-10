"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Phone, Shield, CheckCircle, Star, Users } from "lucide-react";

function AnimatedCounter({
  target,
  suffix = "",
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-coral md:text-4xl">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-warm-grey">{label}</p>
    </div>
  );
}

const trustBadges = [
  { icon: Shield, label: "Every surgeon mystery-shopped" },
  { icon: CheckCircle, label: "Full refund if we can't match you" },
  { icon: Users, label: "No obligation, ever" },
  { icon: Star, label: "5.0 from verified clients" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cream via-cream to-coral-light/30" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-pirk-heading text-4xl font-extrabold leading-tight text-burgundy md:text-5xl lg:text-6xl">
              You&apos;ve made the decision.{" "}
              <span className="text-coral">Now choose the right surgeon.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-warm-grey md:text-xl">
              Choosing a surgeon shouldn&apos;t feel like a gamble. We&apos;ve
              mystery-shopped and vetted 200+ surgeons across Australia so you
              don&apos;t have to spend months researching alone. Tell us what
              matters to you — we&apos;ll show you who to trust.
            </p>

            {/* Procedure selector */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="mb-3 text-sm font-medium text-warm-grey">
                I&apos;m interested in:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Breast", href: "/quiz?procedure=breast" },
                  { label: "Face", href: "/quiz?procedure=face" },
                  { label: "Body", href: "/quiz?procedure=body" },
                  { label: "Not sure yet", href: "/quiz" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-lg border border-coral/20 bg-white px-5 py-3 text-sm font-medium text-near-black transition-all hover:border-coral hover:bg-coral hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                href="/quiz"
                className="inline-block rounded-full bg-coral px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
              >
                Find My Surgeon
              </Link>
              <Link
                href="tel:1800577017"
                className="inline-flex items-center justify-center gap-2 text-warm-grey transition-colors hover:text-coral"
              >
                <Phone className="h-4 w-4" />
                or call us at 1800 577 017
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="mt-6 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {trustBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-grey"
                >
                  <badge.icon className="h-3.5 w-3.5 text-coral" />
                  {badge.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-4"
          >
            <Image
              src="/images/hero-group.jpg"
              alt="Group of confident women — Pirk clients"
              width={800}
              height={600}
              className="w-full rounded-xl object-cover"
              priority
            />
            {/* Mini testimonial in hero */}
            <div className="rounded-lg border border-coral/8 bg-white/70 px-5 py-4 backdrop-blur-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-2 text-sm italic text-near-black">
                &ldquo;Without Pirk I&apos;d still be staring at my vision board,
                now I&apos;m picking between excellent surgeons.&rdquo;
              </p>
              <p className="mt-1 text-xs font-semibold text-burgundy">
                — Audrey Isabella
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stat counters */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-6 rounded-xl border border-coral/5 bg-white/60 px-6 py-8 backdrop-blur-sm md:mt-20 md:gap-12 md:px-12 md:py-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AnimatedCounter target={200} suffix="+" label="Surgeons vetted across Australia" />
          <AnimatedCounter target={2500} suffix="+" label="Patients guided" />
          <AnimatedCounter
            target={15}
            suffix=""
            label="Criteria per surgeon assessment"
          />
        </motion.div>
      </div>
    </section>
  );
}
