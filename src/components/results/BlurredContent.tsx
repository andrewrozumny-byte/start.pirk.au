"use client";

import { Lock } from "lucide-react";

interface BlurredContentProps {
  children: React.ReactNode;
  label: string;
}

export default function BlurredContent({ children, label }: BlurredContentProps) {
  return (
    <div className="relative">
      {/* Blurred content */}
      <div
        className="select-none"
        style={{
          filter: "blur(8px)",
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-white/40 backdrop-blur-[2px]">
        <div className="flex items-center gap-2 rounded-full bg-coral-light px-4 py-2 shadow-sm">
          <Lock className="h-4 w-4 text-coral" />
          <span className="text-sm font-medium text-coral">
            Upgrade to unlock {label}
          </span>
        </div>
      </div>
    </div>
  );
}
