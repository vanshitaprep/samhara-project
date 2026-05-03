import Link from "next/link";

const links: Array<{ label: string; href: string }> = [
  { label: "Services", href: "#services" },
  { label: "Contact Us", href: "#contact" },
  { label: "Terms and condition", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cancellation & Refunds", href: "#cancellation-refunds" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto w-full">
      <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-10 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-12">
          <div className="text-[15px] font-medium text-white/85">
            © {new Date().getFullYear()} Samhara. All Rights Reserved.
          </div>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-white/75"
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

