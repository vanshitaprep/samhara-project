import Image from "next/image";
import Link from "next/link";

import Bg from "../assets/bg.avif";
import Logo from "../assets/logo2026.png";
import { Footer } from "./components/Footer";
import { PolicyCard } from "./components/PolicyCard";

const navLinks: Array<{ label: string; href: string }> = [
  // { label: "Home", href: "/" },
  // { label: "Usecases", href: "/usecases" },
  // { label: "Pricing", href: "/pricing" },
  // { label: "Careers", href: "/careers" },
  // { label: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <section className="relative isolate flex min-h-dvh flex-col">
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
          <div className="rounded-full border border-black/10 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="Samhara logo"
                  priority
                  className="h-7 w-auto"
                />
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  Samhara
                </span>
              </Link>

              <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="transition-colors hover:text-slate-950"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
            {/* <span>We just raised 20M</span> */}
            {/* <span aria-hidden>↗</span> */}
          </div>

          <h1 className="mt-7 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Samhara
          </h1>

          {/* <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Design smarter with AI that understands you.
            <br className="hidden sm:block" />
            So you can take a breath.
          </p> */}

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Fill up the form →
            </Link>
            {/* <Link
              href="/demo"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              Watch Demo
            </Link> */}
          </div>

          <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-slate-700">
            <span>SCROLL</span>
            <span aria-hidden>↓</span>
          </div>
        </main>
      </section>

      <section className="relative bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-14">
          <div id="terms" className="scroll-mt-24">
            <PolicyCard
              title="Terms & Conditions"
              bullets={[
                "All bookings are subject to carrier/hotel availability and confirmation.",
                "Valid government ID (Aadhar/Passport) is mandatory for all travelers.",
                "Samhara acts as an aggregator and is not liable for service delays by airlines or bus operators.",
                "Itinerary changes may occur due to weather or safety regulations.",
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
                "Approved refunds will be credited to the original payment source within 7–10 working days.",
                "Cancellation Fee: 50% charge for requests >60 days before event; 90% after that.",
                "Less than 7 days: Generally non-refundable as per hotel/airline norms.",
                "Service/Convenience fees are non-refundable.",
              ]}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
