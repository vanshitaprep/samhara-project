/** Same smooth in-page scroll used by the dot rail and navbar hash links. */
export function scrollToSectionId(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  el.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });

  try {
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
  } catch {
    /* ignore */
  }
}
