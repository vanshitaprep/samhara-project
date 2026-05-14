import Image from "next/image";
import Link from "next/link";

import Bg from "../assets/bg.avif";
import Logo from "../assets/logo2026.png";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { InPageNavLink } from "./components/InPageNavLink";
import { PackagesSection } from "./components/PackagesSection";
import { PolicyCard } from "./components/PolicyCard";
import { SectionScrollDots } from "./components/SectionScrollDots";
import { ServicesSection } from "./components/ServicesSection";

const navLinks: Array<{ label: string; sectionId: string; href: string }> = [
  { label: "Services", sectionId: "services", href: "#services" },
  { label: "Packages", sectionId: "packages", href: "#packages" },
  { label: "Terms", sectionId: "terms", href: "#terms" },
  { label: "Privacy", sectionId: "privacy", href: "#privacy" },
  {
    label: "Refunds",
    sectionId: "cancellation-refunds",
    href: "#cancellation-refunds",
  },
  { label: "Contact Us", sectionId: "contact", href: "#contact" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <SectionScrollDots />
      <section id="top" className="relative isolate flex min-h-dvh scroll-mt-0 flex-col">
        <Image
          src={Bg}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_20%,rgba(15,23,42,0.25),transparent_60%)]" />

        <header className="relative mx-auto w-full max-w-6xl px-4 pt-6">
          <div
            className="rounded-full border border-black/10 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
              <Link href="/" className="flex min-w-0 items-center gap-2">
                <Image
                  src={Logo}
                  alt="Samhara logo"
                  priority
                  className="h-9 w-auto shrink-0 sm:h-10"
                />
                <span className="truncate text-sm font-semibold tracking-tight text-slate-900">
                  Samhara
                </span>
              </Link>

              <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-slate-700 sm:gap-x-6 sm:text-sm">
                {navLinks.map((l) => (
                  <InPageNavLink
                    key={l.sectionId}
                    sectionId={l.sectionId}
                    href={l.href}
                    className="whitespace-nowrap transition-colors hover:text-slate-950"
                  >
                    {l.label}
                  </InPageNavLink>
                ))}
              </nav>

              <div className="flex shrink-0 items-center justify-end gap-2">
                <Link
                  href="/form"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  Form
                  
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 text-center">
          <Image
            src={Logo}
            alt="Samhara logo"
            priority
            className="h-24 w-auto sm:h-32"
            data-aos="fade-up"
            data-aos-delay="80"
            data-aos-duration="900"
          />

          <div
            className="mt-5 inline-flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/70 px-5 py-3 text-slate-900 shadow-sm backdrop-blur sm:flex-row sm:gap-3"
            data-aos="fade-up"
            data-aos-delay="120"
            data-aos-duration="900"
          >
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              18th &amp; 19th July, 2026
            </span>
            <span className="hidden h-4 w-px bg-slate-900/20 sm:block" aria-hidden />
            <span className="text-sm font-medium text-slate-800 sm:text-base">
              Venue: JW Marriott Golfshire, Bengaluru
            </span>
          </div>

          {/* <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Design smarter with AI that understands you.
            <br className="hidden sm:block" />
            So you can take a breath.
          </p> */}

          <div
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            <Link
              href="/form"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Register for Samhara →
            </Link>
            {/* <Link
              href="/demo"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              Watch Demo
            </Link> */}
          </div>

          <div
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-slate-700"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <span>SCROLL</span>
            <span aria-hidden>↓</span>
          </div>
        </main>
      </section>

      <section className="relative bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-14">
          <div className="flex items-center justify-center gap-5 sm:gap-8">
            <div
              className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#B8891B]/90 to-transparent sm:block"
              aria-hidden
            />
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg sm:max-w-md">
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#B8891B]/50"
                aria-hidden
              />
              <Image
                src="/image.png"
                alt="Samhara 2026 poster"
                width={900}
                height={1125}
                className="h-auto w-full"
                sizes="(max-width: 640px) 90vw, 448px"
                priority
              />
              <div className="px-4 py-3 text-left">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Save the Date — Samhara 2026
                  </p>
                </div>
              </div>
            </div>
            <div
              className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#B8891B]/90 to-transparent sm:block"
              aria-hidden
            />
          </div>

          <ServicesSection />

          <PackagesSection />

          <div id="terms" className="scroll-mt-24">
            <PolicyCard
              title="Terms & Conditions"
              bullets={[
                "Please take a moment to fill in the details in the form at your convenience.",
                "Participation: Samhara 2026 is an exclusive gathering curated for Patrons and Officers. Participation is limited to invitees only; spouses are not allowed.",
                "Event Schedule - Arrival: 18th July 2026, before 12:00 Noon.",
                "Event Schedule - Departure: 20th July 2026, post breakfast.",
                "Contribution Details (indicative for 2-night stay): Rs 65,000 + applicable taxes (Double Occupancy).",
                "Contribution Details (indicative for 2-night stay): Rs 1,20,000 + applicable taxes (Single Occupancy).",
                "Form submission is accepted only after payment is completed within the form.",
                "After completing payment, you will be redirected to submit the form. Please complete both steps.",
              ]}
            />
          </div>

          <div id="privacy" className="scroll-mt-24">
            <PolicyCard
              title="Privacy & Data Protection"
              bullets={[
                "Secure Payments: All transactions are processed through a high-security encrypted environment.",
                "We do not store credit/debit card numbers or sensitive financial pins.",
                "Your contact data is used strictly for booking coordination and travel updates.",
              ]}
            />
          </div>

          <div id="cancellation-refunds" className="scroll-mt-24">
            <PolicyCard
              title="Cancellation & Refunds"
              bullets={[
                <>
                  Cancellation - Since this is an exclusive Invite only Event -
                  there will be <strong>NO REFUNDS</strong>
                </>,
                "Service/Convenience fees are non-refundable.",
              ]}
            />
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}
