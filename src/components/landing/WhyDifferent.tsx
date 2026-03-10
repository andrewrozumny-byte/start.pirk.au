"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Clock } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "We mystery shop every surgeon",
    description:
      "We don't just list surgeons — we secretly assess them as patients. You see what we see.",
  },
  {
    icon: Heart,
    title: "We match you, not sell you",
    description:
      "Surgeons don't pay us to be featured. Your match is based on your goals, not their marketing budget.",
  },
  {
    icon: Clock,
    title: "We've already done the 50+ hours",
    description:
      "Credentials, pricing, wait times, reviews, revision policies — we've checked it all so you don't have to.",
  },
];

export default function WhyDifferent() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-2xl font-extrabold text-burgundy md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why This Time, It&apos;ll Be Different
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl bg-cream/50 p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/10">
                <item.icon className="h-6 w-6 text-coral" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-burgundy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-warm-grey">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
