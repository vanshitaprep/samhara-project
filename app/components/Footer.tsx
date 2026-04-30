import Link from "next/link";

const links: Array<{ label: string; href: string }> = [
  { label: "Terms and condition", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cancellation & Refunds", href: "#cancellation-refunds" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto w-full">
      <div className="border-t border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Samhara. All Rights Reserved.</div>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/70"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

