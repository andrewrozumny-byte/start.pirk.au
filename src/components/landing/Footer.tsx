import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Facebook, Instagram } from "lucide-react";

const exploreLinks = [
  { label: "Reviews", href: "#reviews" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Our Story", href: "#founder-story" },
];

export default function Footer() {
  return (
    <footer className="bg-burgundy text-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Logo + tagline */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/pirk-logo.png"
                alt="Pirk"
                width={90}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Australia&apos;s first surgeon matching service. Find your perfect
              surgeon with confidence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/50">
              Explore
            </h4>
            <nav className="mt-4 flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/50">
              Connect
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="tel:1800577017"
                className="inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-cream"
              >
                <Phone className="h-4 w-4" />
                1800 577 017
              </Link>
              <Link
                href="mailto:hello@pirk.au"
                className="inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-cream"
              >
                <Mail className="h-4 w-4" />
                hello@pirk.au
              </Link>
              <div className="mt-2 flex gap-3">
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/70 transition-colors hover:bg-cream/20 hover:text-cream"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/70 transition-colors hover:bg-cream/20 hover:text-cream"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-cream/15 pt-6 text-center md:flex-row md:justify-between">
          <p className="text-xs text-cream/50">
            &copy; 2026 Pirk. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-cream/50 transition-colors hover:text-cream/80"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-cream/50 transition-colors hover:text-cream/80"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
