"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Reviews", href: "#reviews" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Our Story", href: "#founder-story" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
        setMobileOpen(false);
      }
    },
    []
  );

  return (
    <>
      <motion.header
        className="fixed top-0 right-0 left-0 z-50 transition-colors duration-300"
        animate={{
          backgroundColor: scrolled
            ? "rgba(249, 245, 242, 0.95)"
            : "rgba(249, 245, 242, 0)",
          boxShadow: scrolled
            ? "0 1px 8px rgba(0,0,0,0.06)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/pirk-logo.png"
              alt="Pirk"
              width={100}
              height={36}
              className="h-9 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-near-black/70 transition-colors hover:text-coral"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="tel:1800577017"
              className="flex items-center gap-1.5 text-sm text-warm-grey transition-colors hover:text-coral"
            >
              <Phone className="h-3.5 w-3.5" />
              1800 577 017
            </Link>

            <Link
              href="/quiz"
              className="rounded-full bg-coral px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
            >
              Take the Quiz
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-near-black" />
            ) : (
              <Menu className="h-6 w-6 text-near-black" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-cream md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-xl font-semibold text-near-black"
            >
              {link.label}
            </a>
          ))}

          <Link
            href="tel:1800577017"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-lg text-warm-grey"
          >
            <Phone className="h-4 w-4" />
            1800 577 017
          </Link>

          <Link
            href="/quiz"
            onClick={() => setMobileOpen(false)}
            className="rounded-full bg-coral px-8 py-3 text-lg font-semibold text-white shadow-md"
          >
            Take the Quiz
          </Link>
        </motion.div>
      )}
    </>
  );
}
