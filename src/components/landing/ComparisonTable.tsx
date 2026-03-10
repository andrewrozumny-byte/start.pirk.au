"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const rows = [
  {
    feature: "Finding the right surgeon",
    alone: "50–70+ hours of Googling",
    pirk: "2 minutes — we match you",
  },
  {
    feature: "Knowing the real cost",
    alone: "Hidden until you book a consult",
    pirk: "Real pricing, upfront",
  },
  {
    feature: "Trusting reviews",
    alone: "Anonymous, possibly fake",
    pirk: "Mystery-shopped & verified by us",
  },
  {
    feature: "Getting a fair price",
    alone: "Pay whatever they quote",
    pirk: "We negotiate on your behalf",
  },
  {
    feature: "Consultations",
    alone: "3–5 paid consults ($200–$500 each)",
    pirk: "Often just 1 — we match you right",
  },
  {
    feature: "Knowing what to ask",
    alone: "Wing it and hope for the best",
    pirk: "Consultation prep & red flags guide",
  },
  {
    feature: "Comparing payment plans",
    alone: "Call every clinic separately",
    pirk: "Side-by-side for your matches",
  },
  {
    feature: "If something goes wrong",
    alone: "You're on your own",
    pirk: "We're with you — before and after",
  },
  {
    feature: "Before & after photos",
    alone: "Scattered across Instagram",
    pirk: "Curated and organised by surgeon",
  },
  {
    feature: "Confidence in your choice",
    alone: "Second-guessing until surgery day",
    pirk: "Data-backed, expert-guided certainty",
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Doing It Alone vs. Doing It With Pirk
        </motion.h2>

        {/* Desktop table */}
        <motion.div
          className="mt-14 hidden overflow-hidden rounded-xl border border-gray-200 md:block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="px-6 py-4 text-left text-sm font-semibold text-warm-grey" />
                <th className="px-6 py-4 text-center text-sm font-semibold text-warm-grey">
                  Doing It Alone
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-coral">
                  With Pirk
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}
                >
                  <td className="px-6 py-4 font-medium text-near-black">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600">
                      <X className="h-4 w-4" />
                      {row.alone}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1 text-sm text-green-700">
                      <Check className="h-4 w-4" />
                      {row.pirk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-burgundy/20 bg-burgundy/5">
                <td className="px-6 py-5 text-lg font-bold text-burgundy">
                  Total estimated cost
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-lg font-bold text-red-600">
                    $3,100–$22,500+
                  </span>
                  <p className="mt-0.5 text-xs text-warm-grey">
                    research time + consults + risk of revision
                  </p>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-lg font-bold text-green-700">
                    From $149
                  </span>
                  <p className="mt-0.5 text-xs text-warm-grey">
                    expert guidance included
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </motion.div>

        {/* Mobile stacked cards */}
        <div className="mt-10 space-y-4 md:hidden">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <p className="mb-3 font-semibold text-burgundy">{row.feature}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span className="text-sm text-red-600">{row.alone}</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-sm text-green-700">{row.pirk}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Mobile total summary */}
          <motion.div
            className="rounded-xl border-2 border-burgundy/20 bg-burgundy/5 p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="font-bold text-burgundy">Total estimated cost</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-lg font-bold text-red-600">$3,100–$22,500+</p>
                <p className="mt-0.5 text-xs text-warm-grey">doing it alone</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-lg font-bold text-green-700">From $149</p>
                <p className="mt-0.5 text-xs text-warm-grey">with Pirk</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
