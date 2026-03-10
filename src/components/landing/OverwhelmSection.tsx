"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";

const checklistItems = [
  "Every clinic says they're the best",
  "Pricing is hidden until you book a consult",
  "Reviews could be fake — you can't verify them",
  "You've already spent hours and feel no closer",
  "Different surgeons quote different prices for the same thing",
  "You don't know what questions to ask",
  "FRACS accreditation, hospital privileges, insurance — it's a maze",
  "Before & after photos are scattered and inconsistent",
  "Payment plans differ at every clinic",
  "One wrong choice could mean revision surgery",
  "And you're expected to figure this out alone",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
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

export default function OverwhelmSection() {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const contrastRef = useRef<HTMLDivElement>(null);
  const contrastInView = useInView(contrastRef, {
    once: true,
    margin: "-60px",
  });

  return (
    <section id="overwhelm" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sound Familiar?
        </motion.h2>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Animated checklist */}
          <motion.ul
            ref={ref}
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {checklistItems.map((item, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-3 border-l-2 border-coral/30 bg-cream px-4 py-3"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                <span className="text-near-black">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Image placeholder */}
          <div className="flex flex-col gap-8">
            <Image
              src="/images/model-editorial.jpg"
              alt="Woman considering her surgery options"
              width={640}
              height={800}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Contrast statement */}
        <div ref={contrastRef} className="mt-16 text-center md:mt-20">
          <motion.p
            className="text-2xl font-bold text-burgundy md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={contrastInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Most people spend 50–70+ hours researching surgeons.
          </motion.p>
          <motion.p
            className="mt-2 text-2xl font-bold text-burgundy md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={contrastInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            And still don&apos;t feel confident in their choice.
          </motion.p>
          <motion.p
            className="mt-6 text-3xl font-extrabold text-coral md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={contrastInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Or 2 minutes with Pirk.
          </motion.p>
          <motion.p
            className="mx-auto mt-4 max-w-md text-lg italic text-warm-grey"
            initial={{ opacity: 0 }}
            animate={contrastInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            &ldquo;We exist because that shouldn&apos;t be the case.&rdquo;
          </motion.p>
        </div>
      </div>
    </section>
  );
}
