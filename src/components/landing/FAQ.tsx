"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is Pirk different from just Googling?",
    a: "Google shows you ads and SEO-optimised websites. We show you verified, mystery-shopped data \u2014 real costs, real wait times, real reviews, and real before & after results. We\u2019ve done 50\u201370 hours of research so you don\u2019t have to.",
  },
  {
    q: "How does Pirk match me with a surgeon?",
    a: "We assess every surgeon on 15+ criteria including qualifications, experience, patient outcomes, pricing, wait times, and more. We also mystery shop surgeons regularly \u2014 visiting as patients ourselves to verify the experience firsthand. After you take our quiz, our algorithm identifies the surgeons best suited to your goals, budget, and location.",
  },
  {
    q: "What if I already have a surgeon in mind?",
    a: "That\u2019s great \u2014 many clients come to us for a second opinion. We can help you validate your choice against our data, or show you how they compare to other surgeons in our network.",
  },
  {
    q: "What\u2019s the difference between the packages?",
    a: "Know Your Options (from $149) gives you your top surgeon matches with verified profiles, reviews, and cost indications. Choose With Confidence (from $699) adds detailed cost comparisons, before & after photos, consultation prep, and quote negotiation. Fully Guided is our bespoke package with a dedicated coordinator who manages everything from consultations to post-surgery support.",
  },
  {
    q: "What if I\u2019m not ready to book surgery yet?",
    a: "That\u2019s completely normal. Most of our clients use us to decide whether to proceed, not just who with. There\u2019s no pressure and no timeline \u2014 we\u2019re here when you\u2019re ready.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If we can\u2019t find you a suitable surgeon match, you\u2019ll receive a full refund. No questions asked. We\u2019re that confident in our network of 200+ vetted surgeons across Australia.",
  },
  {
    q: "Is my information kept private?",
    a: "Absolutely. Your personal information is never shared with surgeons without your explicit consent. We comply with Australian privacy laws and take your privacy seriously.",
  },
  {
    q: "What types of procedures do you help with?",
    a: "Everything from breast augmentation and facelifts to liposuction, tummy tucks, and eyelid procedures \u2014 both cosmetic and medically necessary. If you\u2019re not sure where your concern fits, we\u2019ll guide you.",
  },
  {
    q: "Do I have to use one of my matched surgeons?",
    a: "Not at all. Our matches are expert recommendations based on your specific needs. You\u2019re always free to choose any surgeon you\u2019d like.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-lg font-semibold text-near-black">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-warm-grey" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 leading-relaxed text-warm-grey">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          className="mt-12 rounded-2xl bg-white p-6 shadow-sm md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
