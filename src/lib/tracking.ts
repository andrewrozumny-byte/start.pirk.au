/**
 * Centralized tracking helper that fires events to both Meta and TikTok pixels.
 * Safe to call server-side — all functions no-op if `window` is undefined.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Track a lead event (email captured).
 */
export function trackLead() {
  if (!isClient()) return;

  if (window.fbq) {
    window.fbq("track", "Lead");
  }

  if (window.ttq) {
    window.ttq.track("SubmitForm");
  }
}

/**
 * Track checkout initiation.
 */
export function trackInitiateCheckout(tier: string) {
  if (!isClient()) return;

  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_name: tier,
      currency: "AUD",
    });
  }

  if (window.ttq) {
    window.ttq.track("InitiateCheckout", {
      content_name: tier,
    });
  }
}

/**
 * Track a successful purchase.
 */
export function trackPurchase(tier: string, value: number) {
  if (!isClient()) return;

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_name: tier,
      value,
      currency: "AUD",
    });
  }

  if (window.ttq) {
    window.ttq.track("CompletePayment", {
      content_name: tier,
      value,
      currency: "AUD",
    });
  }
}
