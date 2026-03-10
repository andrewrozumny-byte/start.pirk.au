"use client";

import { motion } from "framer-motion";
import { Star, Users, Shield } from "lucide-react";

const miniQuotes = [
  { text: "I wish I had found Pirk sooner — it saved time, money and a lot of disappointment.", author: "Lins" },
  { text: "Ellie took all the hard work out of searching for a surgeon.", author: "Renee" },
  { text: "Without Pirk I'd still be staring at my vision board.", author: "Audrey" },
];

export default function ProofStrip() {
  return (
    <motion.section
      className="bg-burgundy py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Star rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-cream/80">
              5.0 from verified clients
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-coral" />
              <span className="text-sm text-cream/80">
                2,500+ clients matched
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-coral" />
              <span className="text-sm text-cream/80">
                200+ surgeons vetted
              </span>
            </div>
          </div>

          {/* Rotating mini-quote (static for now) */}
          <p className="hidden text-sm italic text-cream/60 lg:block">
            &ldquo;{miniQuotes[0].text}&rdquo;{" "}
            <span className="font-medium text-cream/80">
              — {miniQuotes[0].author}
            </span>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
