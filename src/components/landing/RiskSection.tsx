"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { UserX, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    icon: UserX,
    stat: "1 in 5",
    description: "patients are unhappy with their surgeon choice",
  },
  {
    icon: DollarSign,
    stat: "$5,000–$15,000",
    description: "average revision surgery cost",
  },
  {
    icon: Clock,
    stat: "6–12 months",
    description: "additional recovery time",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function RiskSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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
          What Happens When You Choose Wrong
        </motion.h2>

        {/* Stat cards */}
        <div
          ref={ref}
          className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-xl border border-cream/10 bg-cream/5 p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/20">
                <item.icon className="h-7 w-7 text-coral" />
              </div>
              <p className="mt-5 text-3xl font-bold text-coral md:text-4xl">
                {item.stat}
              </p>
              <p className="mt-2 text-cream/80">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          className="mx-auto mt-12 max-w-2xl text-center text-lg text-cream/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          We mystery shop every surgeon in our network regularly — so you never
          have to gamble with your health.
        </motion.p>

        {/* Body confidence image */}
        <motion.div
          className="mx-auto mt-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Image
            src="/images/confidence-body.jpg"
            alt="Body confidence"
            width={640}
            height={360}
            className="w-full rounded-2xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
