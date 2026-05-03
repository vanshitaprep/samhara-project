"use client";

import type { MouseEvent, ReactNode } from "react";

import { scrollToSectionId } from "../lib/scrollToSection";

type InPageNavLinkProps = Readonly<{
  sectionId: string;
  href: string;
  className?: string;
  children: ReactNode;
}>;

/**
 * In-page anchor that scrolls like the section dot nav (smooth + same block position),
 * instead of Next {@link Link} hash behaviour which can feel instant or mismatched.
 */
export function InPageNavLink({
  sectionId,
  href,
  className,
  children,
}: InPageNavLinkProps) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    scrollToSectionId(sectionId);
  }

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
