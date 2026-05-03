"use client";

import { useCallback, useEffect, useState } from "react";

import { scrollToSectionId } from "../lib/scrollToSection";

const SECTIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "packages", label: "Packages" },
  { id: "terms", label: "Terms & conditions" },
  { id: "privacy", label: "Privacy" },
  { id: "cancellation-refunds", label: "Cancellation & refunds" },
  { id: "contact", label: "Contact" },
];

export function SectionScrollDots() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  const updateActive = useCallback(() => {
    const marker = window.scrollY + window.innerHeight * 0.22;
    let current = SECTIONS[0].id;
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = id;
    }
    setActive(current);
  }, []);

  useEffect(() => {
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive]);

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-auto fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 sm:right-4 sm:flex"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-current={isActive ? "location" : undefined}
            onClick={() => scrollToSectionId(id)}
            className={`group relative flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 ${
              isActive ? "scale-110" : ""
            }`}
          >
            <span
              className={`block rounded-full border-2 shadow-sm transition-[height,width,background-color,border-color] duration-200 ${
                isActive
                  ? "h-2.5 w-2.5 border-slate-900 bg-slate-900"
                  : "h-2 w-2 border-slate-400/80 bg-white/95 hover:border-slate-600 hover:bg-slate-100"
              }`}
            />
            <span className="pointer-events-none absolute right-full mr-2 hidden max-w-[11rem] rounded-md bg-slate-900/95 px-2 py-1 text-[10px] font-medium tracking-wide text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
