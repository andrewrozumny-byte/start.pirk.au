"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used Pirk after wasting hundreds and maybe thousands on consultations with surgeons after finally convincing myself to go ahead with the 'mummy makeover'. The girls at Pirk took care of everything from start to finish. I told them what I wanted and they matched me with the most perfect surgeon. I wish I had found Pirk sooner, it would have saved time, money and a lot of disappointment.",
    name: "Lins",
  },
  {
    quote:
      "It really is that simple — you tell Pirk what you want to do and they help you plan and project manage plastic surgery to the level of research it deserves. After losing 80kg following bariatric surgery, I was no stranger to doing research on surgeons. Pirk made it so much easier to trust a selection of names and get my life moving forward. Without Pirk I'd still be staring at my vision board, now I'm picking between excellent surgeons and actually planning dates.",
    name: "Audrey Isabella",
  },
  {
    quote:
      "As a Nurse myself working in a Melbourne city hospital, I can honestly say the care, communication and attention given to me was incredible. After speaking with Ellie and giving her some details on what I was looking for she was able to not only guide me but also find me the best surgeon for my needs. Couldn't recommend PIRK highly enough!",
    name: "Jessica Connell",
  },
  {
    quote:
      "I could have not gone through this process without the support of Pirk. Ellie took all the hard work out of searching for a surgeon and answering all those questions as well as putting my mind at ease. I am now booked in to have my cosmetic surgery completed by a reputable surgeon. Ellie kept in contact with me throughout the process and even called to check up on how I am feeling leading up to my surgery.",
    name: "Renee Brown",
  },
  {
    quote:
      "I have never had cosmetic surgery, Ellie understood this and made me feel welcomed and cared for immediately. Her ability to listen and not judge on your personal areas that require treatment is why I will go with their surgeon recommendation. Her knowledge is great and no question was too hard to answer.",
    name: "Bec P",
  },
  {
    quote:
      "From the initial consultation to post-care, Pirk provided support that went above and beyond my expectations. I was matched with specialists who genuinely cared about my well-being and goals. The whole process was timely and fell into place nicely. I'm incredibly grateful for their guidance.",
    name: "Mary Gi",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const TRUNCATE_LENGTH = 150;

function TestimonialCard({
  quote,
  name,
}: {
  quote: string;
  name: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = quote.length > TRUNCATE_LENGTH;

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-cream/50 p-6 md:p-8">
      <StarRating />

      <blockquote className="mt-4 flex-1 text-near-black leading-relaxed">
        <span>&ldquo;</span>
        {needsTruncation && !expanded
          ? quote.slice(0, TRUNCATE_LENGTH) + "..."
          : quote}
        <span>&rdquo;</span>
      </blockquote>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 self-start text-sm font-medium text-coral hover:underline"
        >
          {expanded ? (
            <>
              Read less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}

      <div className="mt-6 flex items-center gap-3">
        <InitialsAvatar name={name} />
        <p className="text-sm font-semibold text-burgundy">{name}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="reviews" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          className="text-pirk-heading text-center text-3xl font-extrabold text-burgundy md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Our Clients Say
        </motion.h2>

        <div
          ref={ref}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <TestimonialCard quote={t.quote} name={t.name} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
