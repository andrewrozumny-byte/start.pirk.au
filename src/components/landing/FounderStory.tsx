"use client";

import { motion } from "framer-motion";
import ImagePlaceholder from "./ImagePlaceholder";

export default function FounderStory() {
  return (
    <section id="founder-story" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-pirk-heading text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl">
              I went through this myself.{" "}
              <span className="text-coral">
                That&apos;s why I built Pirk differently.
              </span>
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-warm-grey">
              <p>
                I never set out to start a business in cosmetic surgery. My
                journey with Pirk began in the most personal way — navigating
                the process myself and realising just how frustrating and
                confusing it could be.
              </p>
              <p>
                When I started looking into a procedure, I expected it to be
                straightforward: research my options, compare qualified
                surgeons, and book in with confidence. Instead, I found
                conflicting information, unclear pricing, and no easy way to
                know who I could really trust.
              </p>
              <p>
                I wasn&apos;t alone. The more I spoke to people, the more I
                heard the same frustrations — uncertainty, mixed advice, and
                the feeling of being left to figure it out alone.
              </p>
              <p>
                With Pirk, I wanted to create something different — not just
                another directory, but a platform that puts people first. A
                place where expertise, clarity, and confidence come before
                flashy marketing.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ImagePlaceholder
              label="Founder photo"
              aspectRatio="4/5"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
