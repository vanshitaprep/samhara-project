"use client";

import AOS from "aos";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const aosOptions = {
  duration: 750,
  easing: "ease-out",
  once: true,
  offset: 56,
  mirror: false,
} as const;

let aosInitialized = false;

export function AosInit() {
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!aosInitialized) {
      AOS.init(aosOptions);
      aosInitialized = true;
    } else {
      AOS.refreshHard();
    }

    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        AOS.refresh();
        rafRef.current = null;
      });
      rafRef.current = id2;
    });
    rafRef.current = id1;

    return () => {
      cancelAnimationFrame(id1);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [pathname]);

  return null;
}
