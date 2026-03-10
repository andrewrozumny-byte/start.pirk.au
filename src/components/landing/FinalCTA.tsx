"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-coral py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-coral via-coral to-[#e8604d]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
              You&apos;ve read this far for a reason
            </p>
            <h2 className="text-pirk-heading mt-2 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              Stop researching. Start feeling confident.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/85 lg:mx-0">
              Two minutes is all it takes. Tell us what you&apos;re looking for
              and we&apos;ll match you with vetted surgeons who are right for
              your goals, your body, and your budget.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link
                href="/quiz"
                className="inline-block rounded-full bg-white px-10 py-4 text-center text-lg font-bold text-coral shadow-lg transition-all hover:shadow-xl hover:brightness-95"
              >
                Find My Surgeon Now
              </Link>
              <Link
                href="/book-call"
                className="inline-block text-center text-sm font-medium text-white/90 underline underline-offset-2 transition-colors hover:text-white"
              >
                or Book a Free Call
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-6 lg:justify-start">
              <Link
                href="tel:1800577017"
                className="inline-flex items-center justify-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                1800 577 017
              </Link>
              <Link
                href="mailto:hello@pirk.au"
                className="inline-flex items-center justify-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                hello@pirk.au
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Image
              src="/images/women-close.jpg"
              alt="Happy Pirk clients"
              width={800}
              height={600}
              className="w-full rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
