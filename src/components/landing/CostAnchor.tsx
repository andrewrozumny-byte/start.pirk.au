"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const costs = [
  { label: "Wasted consultations", value: "$600–$2,500", note: "3–5 consults at $200–$500 each" },
  { label: "Hours lost researching", value: "50–70+", note: "hours you won't get back" },
  { label: "If you choose wrong", value: "$10,000–$20,000", note: "revision surgery + 6–12 months recovery" },
];

export default function CostAnchor() {
  return (
    <section className="bg-burgundy py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/20">
            <AlertTriangle className="h-6 w-6 text-coral" />
          </div>
          <h2 className="text-pirk-heading mt-4 text-2xl font-extrabold text-cream md:text-3xl">
            The Cost of Getting It Wrong
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {costs.map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-cream/10 bg-cream/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <p className="text-sm text-cream/60">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-coral md:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-cream/50">{item.note}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-lg text-cream/80">
            Expert guidance costs less than{" "}
            <span className="font-bold text-coral">one wrong consultation</span>.
          </p>
          <p className="mt-2 text-2xl font-extrabold text-cream md:text-3xl">
            Start with Pirk from $149.
          </p>
          <Link
            href="/quiz"
            className="mt-6 inline-block rounded-full bg-coral px-8 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
          >
            Find My Surgeon Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
