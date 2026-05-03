/**
 * Razorpay's checkout script attaches a constructor to the global object.
 * In some bundlers / load orders it may appear as `.default` or slightly after `load`.
 */
// for redeploying
export type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (data: unknown) => void) => void;
};

export type RazorpayConstructor = new (
  options: Record<string, unknown>
) => RazorpayInstance;

function pickConstructor(value: unknown): RazorpayConstructor | null {
  if (typeof value === "function") {
    return value as RazorpayConstructor;
  }
  if (
    value &&
    typeof value === "object" &&
    "default" in value &&
    typeof (value as { default: unknown }).default === "function"
  ) {
    return (value as { default: RazorpayConstructor }).default;
  }
  return null;
}

/** Resolve `new Razorpay(opts)` from whatever the hosted script put on `globalThis`. */
export function getRazorpayConstructor(): RazorpayConstructor | null {
  if (typeof globalThis === "undefined") return null;
  const g = globalThis as unknown as Record<string, unknown>;
  return (
    pickConstructor(g.Razorpay) ??
    pickConstructor((g.window as Record<string, unknown> | undefined)?.Razorpay)
  );
}

/** Wait until checkout.js has registered the constructor (avoids "not a constructor" races). */
export function waitForRazorpayConstructor(
  maxMs = 8000,
  intervalMs = 50
): Promise<RazorpayConstructor | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const ctor = getRazorpayConstructor();
      if (ctor) {
        resolve(ctor);
        return;
      }
      if (Date.now() - start >= maxMs) {
        resolve(null);
        return;
      }
      globalThis.setTimeout(tick, intervalMs);
    };
    tick();
  });
}
