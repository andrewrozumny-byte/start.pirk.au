"use client";

import { motion } from "framer-motion";
import { Clock, FileText, Phone } from "lucide-react";

const steps = [
  {
    icon: FileText,
    time: "Immediately",
    title: "Your matches are prepared",
    description:
      "Our algorithm scores surgeons on 15+ criteria and shortlists the best fits for your goals, budget, and location.",
  },
  {
    icon: Phone,
    time: "Within 24 hours",
    title: "Your consultant reaches out",
    description:
      "A real person from our team calls to walk you through your matches, answer questions, and help you decide next steps.",
  },
  {
    icon: Clock,
    time: "At your pace",
    title: "You choose — we support",
    description:
      "Book consultations when you're ready. We prep you on what to ask, review your quotes, and stay with you through recovery.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function WhatHappensNext() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Happens After You Sign Up
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-xl text-center text-lg text-warm-grey"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          No waiting around. No guesswork. Here&apos;s exactly what to expect.
        </motion.p>

        <div className="mt-12 space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-px bg-coral/20" />
              )}

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/10">
                <step.icon className="h-5 w-5 text-coral" />
              </div>

              {/* Content */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-coral">
                  {step.time}
                </p>
                <h3 className="mt-1 text-lg font-bold text-near-black">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-warm-grey">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
