"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardCheck, Shield, Heart } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    step: "1",
    title: "Take Our 2-Minute Quiz",
    description:
      "Tell us about your procedure, location, and what matters most to you.",
  },
  {
    icon: Shield,
    step: "2",
    title: "Get Matched With Vetted Surgeons",
    description:
      "Our algorithm scores every surgeon on 15+ criteria to find your perfect match.",
  },
  {
    icon: Heart,
    step: "3",
    title: "Get Supported Through Your Journey",
    description:
      "From consultation prep to post-surgery — we're with you every step.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How Pirk Works
        </motion.h2>

        <div
          ref={ref}
          className="mt-14 grid gap-8 md:grid-cols-3 md:gap-10"
        >
          {steps.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative rounded-xl bg-white p-8 text-center shadow-sm"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                {item.step}
              </div>

              <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-xl bg-coral-light/60">
                <item.icon className="h-8 w-8 text-coral" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-burgundy">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-warm-grey">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
