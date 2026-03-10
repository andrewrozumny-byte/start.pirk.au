"use client";

import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImagePlaceholder({
  label,
  className = "",
  aspectRatio = "16/9",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-coral-mid bg-coral-light/40 ${className}`}
      style={{ aspectRatio }}
    >
      <ImageIcon className="mb-2 h-10 w-10 text-coral-mid" strokeWidth={1.5} />
      <span className="px-4 text-center text-sm font-medium text-warm-grey">
        {label}
      </span>
    </div>
  );
}
