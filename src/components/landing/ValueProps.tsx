"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Shield, Heart, Users, Phone } from "lucide-react";
import Link from "next/link";

const checklist = [
  "We listen to what you actually want — not what's convenient",
  "Your top surgeon matches, chosen for your goals and budget",
  "Real pricing — no hidden costs, no surprises",
  "Finance and Medicare guidance included",
  "Priority consultation pathways where available",
  "We coordinate bookings so you don't have to chase clinics",
  "Support that continues through surgery and recovery",
];

const cards = [
  {
    icon: Shield,
    title: "You're in trusted hands",
    description:
      "Every surgeon in our network is handpicked based on experience, qualifications, and patient outcomes — not paid placements or promotions.",
  },
  {
    icon: Heart,
    title: "We make it personal",
    description:
      "Your journey is unique. Based on your answers, we handpick 1–3 surgeons who are genuinely right for you — not just whoever's available.",
  },
  {
    icon: Users,
    title: "Support from start to finish",
    description:
      "From your first enquiry to post-op recovery, we're with you every step of the way — answering questions, reviewing quotes, and making sure you never feel alone in this.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ValueProps() {
  const listRef = useRef<HTMLUListElement>(null);
  const listInView = useInView(listRef, { once: true, margin: "-80px" });
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-burgundy py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-cream md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          We Don&apos;t Just Match You — We Guide You
        </motion.h2>

        {/* Checklist */}
        <motion.ul
          ref={listRef}
          className="mx-auto mt-12 max-w-2xl space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate={listInView ? "visible" : "hidden"}
        >
          {checklist.map((item, i) => (
            <motion.li
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 rounded-lg bg-cream/5 px-4 py-3"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
              <span className="text-cream/90">{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Three emphasis cards */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              className="rounded-xl border border-cream/10 bg-cream/5 p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/20">
                <card.icon className="h-7 w-7 text-coral" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-cream">
                {card.title}
              </h3>
              <p className="mt-3 leading-relaxed text-cream/70">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Phone CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="tel:1800577017"
            className="inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-cream"
          >
            <Phone className="h-4 w-4" />
            or call us at 1800 577 017
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
