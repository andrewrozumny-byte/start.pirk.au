"use client";

import { motion } from "framer-motion";
import { Phone, Clock, UserCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

const trustPoints = [
  {
    icon: Phone,
    title: "No obligation — completely free",
    description:
      "This is a no-pressure conversation. Ask anything you want about the process.",
  },
  {
    icon: Clock,
    title: "15 minutes with a dedicated advisor",
    description:
      "Quick, focused call tailored to your specific situation and goals.",
  },
  {
    icon: UserCheck,
    title: "Get personalised surgeon recommendations",
    description:
      "We'll discuss your needs and provide tailored guidance on next steps.",
  },
];

const faqs = [
  {
    question: "What happens on the call?",
    answer:
      "Your Pirk advisor will listen to your goals, answer your questions about the process, and discuss which surgeons might be the best fit. There's no hard sell — just honest, informed guidance.",
  },
  {
    question: "Do I need to have taken the quiz first?",
    answer:
      "It helps, but it's not required. If you've already taken the quiz, we'll have your results ready. If not, we can walk through your preferences together on the call.",
  },
  {
    question: "Is there any obligation to purchase after the call?",
    answer:
      "Absolutely not. The strategy call is completely free and without obligation. We want to help you make an informed decision on your own terms.",
  },
  {
    question: "Who will I be speaking with?",
    answer:
      "You'll speak with a dedicated Pirk advisor who has deep knowledge of the cosmetic surgery landscape in Australia. They're here to help, not to sell.",
  },
  {
    question: "How do I prepare for the call?",
    answer:
      "Just think about what procedure you're interested in, any surgeons you've already looked at, and what matters most to you (price, location, experience, etc.). We'll handle the rest.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-near-black">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-warm-grey transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-warm-grey">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function BookCallPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream via-cream to-coral-light/30 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pirk-sub text-coral">Free Strategy Call</p>
            <h1 className="text-pirk-heading mt-4 text-3xl font-extrabold leading-tight text-burgundy md:text-4xl lg:text-5xl">
              Let&apos;s Find Your Perfect{" "}
              <span className="text-coral">Surgeon Together</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-warm-grey md:text-xl">
              Book a free 15-minute strategy call with a Pirk advisor.
              We&apos;ll discuss your goals, answer your questions, and create a
              personalised plan.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Calendar embed placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Team / advisor image placeholder */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-coral-light/50">
              <div className="flex aspect-[4/3] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10">
                    <UserCheck className="h-8 w-8 text-coral" />
                  </div>
                  <p className="text-sm font-medium text-warm-grey">
                    Advisor photo placeholder
                  </p>
                </div>
              </div>
            </div>

            {/* Calendar widget placeholder */}
            <div className="overflow-hidden rounded-2xl border-2 border-dashed border-coral-mid bg-white p-8">
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral-light">
                  <Clock className="h-7 w-7 text-coral" />
                </div>
                <p className="text-lg font-semibold text-near-black">
                  Calendar Booking Widget
                </p>
                <p className="mt-2 max-w-xs text-sm text-warm-grey">
                  Connect Calendly, Cal.com, or a similar scheduling tool here
                  to let clients book directly.
                </p>
                <div className="mt-6 rounded-lg bg-cream px-4 py-2 text-xs text-warm-grey">
                  Embed code goes here
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Trust points + FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Trust points */}
            <div className="space-y-6">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="flex gap-4 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-light">
                    <point.icon className="h-5 w-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-near-black">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm text-warm-grey">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ section */}
            <div className="mt-12">
              <h2 className="text-pirk-heading text-2xl font-bold text-burgundy">
                What to Expect on Your Call
              </h2>
              <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-burgundy py-12">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to take the next step?
          </h2>
          <p className="mt-3 text-white/70">
            Book your free strategy call today, or take our 2-minute quiz to get
            matched instantly.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#calendar"
              className="inline-block rounded-full bg-coral px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-105"
            >
              Book Your Free Call
            </a>
            <a
              href="/quiz"
              className="inline-block rounded-full border-2 border-white/30 px-8 py-3.5 font-semibold text-white transition-all hover:border-white/60"
            >
              Take the Quiz Instead
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
