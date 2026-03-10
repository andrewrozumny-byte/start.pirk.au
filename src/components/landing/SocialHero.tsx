"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Shield, CheckCircle } from "lucide-react";

export default function SocialHero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cream via-cream to-coral-light/30" />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Empathy-first pre-headline */}
          <p className="text-sm font-semibold uppercase tracking-wider text-coral">
            You&apos;ve made the decision. Now let us help.
          </p>

          <h1 className="text-pirk-heading mt-4 text-4xl font-extrabold leading-tight text-burgundy md:text-5xl lg:text-6xl">
            Choosing a surgeon is overwhelming.{" "}
            <span className="text-coral">It doesn&apos;t have to be.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-warm-grey md:text-xl">
            Most people spend 50+ hours researching, comparing, and second-guessing.
            We match you with the right surgeon in 2 minutes — vetted, verified,
            and personally recommended.
          </p>

          {/* Primary CTA */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              href="/quiz"
              className="inline-block rounded-full bg-coral px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
            >
              Find My Surgeon — Free Quiz
            </Link>
            <p className="mt-3 text-sm text-warm-grey">
              Takes 2 minutes. No obligation. No spam.
            </p>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-grey">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              5.0 rated
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-grey">
              <Shield className="h-3.5 w-3.5 text-coral" />
              200+ surgeons vetted
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-grey">
              <CheckCircle className="h-3.5 w-3.5 text-coral" />
              2,500+ clients matched
            </span>
          </motion.div>

          {/* Mini testimonial */}
          <motion.div
            className="mx-auto mt-10 max-w-lg rounded-xl border border-coral/10 bg-white/60 px-6 py-4 shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="mt-2 text-sm italic text-near-black">
              &ldquo;I wish I had found Pirk sooner. It saved time, money and a lot
              of disappointment. They are the perfect beauty brokers.&rdquo;
            </p>
            <p className="mt-1 text-xs font-semibold text-burgundy">— Lins</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
