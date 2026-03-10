"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

const painPoints = [
  "Check FRACS accreditation for every surgeon",
  "Compare hidden pricing across clinics",
  "Book 3–5 consultations at $100–$500 each",
  "Verify hospital privileges & insurance",
  "Find real before & after photos",
  "Understand revision & complication policies",
  "Check payment plan availability",
  "Read hundreds of reviews you can't verify",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function SocialOverwhelm() {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.h2
          className="text-pirk-heading text-2xl font-extrabold text-burgundy md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Here&apos;s What You&apos;re Up Against
        </motion.h2>
        <motion.p
          className="mt-3 text-warm-grey"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          To find the right surgeon on your own, you&apos;d need to:
        </motion.p>

        <motion.ul
          ref={ref}
          className="mt-8 space-y-2 text-left"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {painPoints.map((item, i) => (
            <motion.li
              key={i}
              variants={itemVariants}
              className="flex items-center gap-3 rounded-lg bg-red-50/60 px-4 py-2.5"
            >
              <X className="h-4 w-4 shrink-0 text-red-400" />
              <span className="text-sm text-near-black">{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-lg font-bold text-burgundy">
            That&apos;s 50+ hours and thousands of dollars.
          </p>
          <p className="mt-1 text-2xl font-extrabold text-coral md:text-3xl">
            Or 2 minutes with Pirk.
          </p>
          <Link
            href="/quiz"
            className="mt-6 inline-block rounded-full bg-coral px-8 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
          >
            Match Me With a Surgeon
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
