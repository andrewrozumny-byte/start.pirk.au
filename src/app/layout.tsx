import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import MetaPixel from "@/components/tracking/MetaPixel";
import TikTokPixel from "@/components/tracking/TikTokPixel";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pirk — Find Your Perfect Surgeon",
  description:
    "Australia's first surgeon matching service. We've done the research, the mystery shopping, and the vetting — so you don't have to.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
        <MetaPixel />
        <TikTokPixel />
      </body>
    </html>
  );
}
