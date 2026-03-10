"use client";

import { motion } from "framer-motion";

/**
 * "As Seen In" press/media credibility strip.
 * Replace placeholder text with real press logos once available.
 */
const pressLogos = [
  { name: "Daily Mail", width: "w-24" },
  { name: "news.com.au", width: "w-28" },
  { name: "Body+Soul", width: "w-24" },
  { name: "Cosmopolitan", width: "w-28" },
  { name: "Marie Claire", width: "w-24" },
];

export default function AsSeenIn() {
  return (
    <section className="border-y border-gray-200/60 bg-white py-8">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          className="flex flex-col items-center gap-6 md:flex-row md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-warm-grey/60">
            As seen in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {pressLogos.map((logo) => (
              <span
                key={logo.name}
                className={`${logo.width} text-center text-sm font-semibold tracking-wide text-warm-grey/40`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
