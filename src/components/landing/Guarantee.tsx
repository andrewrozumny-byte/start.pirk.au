"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Guarantee() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/10">
            <ShieldCheck className="h-8 w-8 text-coral" />
          </div>

          <h2 className="text-pirk-heading mt-6 text-3xl font-extrabold text-burgundy md:text-4xl">
            Our Match Guarantee
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-warm-grey">
            If we can&apos;t find you a suitable surgeon match,
            you&apos;ll receive a <strong className="text-near-black">full refund</strong>.
            No questions asked. We&apos;re that confident in our network of
            200+ vetted surgeons across Australia.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/quiz"
              className="inline-block rounded-full bg-coral px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
            >
              Find My Surgeon
            </Link>
            <p className="text-sm text-warm-grey">
              100% risk-free. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
