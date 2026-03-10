"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-2xl border border-coral/20 bg-white p-8 text-center shadow-lg">
        <h1 className="text-xl font-semibold text-burgundy">Something went wrong</h1>
        <p className="mt-2 text-sm text-warm-grey">
          A client-side error occurred. Check the browser console (F12 → Console) for details.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 max-h-40 overflow-auto rounded bg-cream p-3 text-left text-xs text-near-black">
            {error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
