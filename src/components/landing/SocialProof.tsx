"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    quote: "I wish I had found Pirk sooner — it saved time, money and a lot of disappointment. They are the perfect beauty brokers.",
    name: "Lins",
    highlight: "saved time, money and a lot of disappointment",
  },
  {
    quote: "Ellie took all the hard work out of searching for a surgeon and putting my mind at ease. Highly recommend Pirk!",
    name: "Renee Brown",
    highlight: "took all the hard work out",
  },
  {
    quote: "Without Pirk I'd still be staring at my vision board, now I'm picking between excellent surgeons and actually planning dates.",
    name: "Audrey Isabella",
    highlight: "now I'm picking between excellent surgeons",
  },
  {
    quote: "As a Nurse myself, I can honestly say the care, communication and attention given to me was incredible.",
    name: "Jessica Connell",
    highlight: "care, communication and attention",
  },
  {
    quote: "The whole process was timely and fell into place nicely. I'm incredibly grateful for their guidance.",
    name: "Mary Gi",
    highlight: "fell into place nicely",
  },
  {
    quote: "Her ability to listen and not judge on your personal areas that require treatment is why I will go with their recommendation.",
    name: "Bec P",
    highlight: "listen and not judge",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.p
          className="text-sm font-semibold uppercase tracking-wider text-warm-grey"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Don&apos;t Just Take Our Word for It
        </motion.p>

        {/* Rotating review */}
        <div className="mt-6 flex min-h-[160px] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-lg"
            >
              <div className="flex justify-center">
                <StarRating />
              </div>
              <blockquote className="mt-4 text-lg italic leading-relaxed text-near-black md:text-xl">
                &ldquo;{reviews[current].quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-burgundy">
                — {reviews[current].name}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current ? "bg-coral" : "bg-warm-grey/30"
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/quiz"
            className="inline-block rounded-full bg-coral px-8 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
          >
            Yes — Match Me With a Surgeon
          </Link>
          <p className="mt-2 text-xs text-warm-grey">
            Free quiz. 2 minutes. No obligation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
