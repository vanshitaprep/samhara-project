import Link from "next/link";

/** Opens chat on WhatsApp — same link for every package and the header CTA. */
const PACKAGES_WHATSAPP_HREF =
  "https://api.whatsapp.com/send/?phone=917506215327&text&type=phone_number&app_absent=0";

function StarIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

function ClockIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={className}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const packages = [
  {
    title: "Single Occupancy - Company Payment",
    price: "(Rs. 1,20,000 + GST) =  ₹1,45,140 (includes 2.5% Convenience Fee)",
    rating: "4.8",
    nights: "2N/3D",
    gradient: "from-sky-200 via-slate-200 to-slate-300",
  },
  {
    title: "Single Occupancy - Personal Payment",
    price: "( Rs. 1,20,000 + GST ) = ₹1,35,300 (Includes 2.5% Convenience Fee)",
    rating: "4.9",
    nights: "2N/3D",
    gradient: "from-emerald-200 via-teal-100 to-cyan-200",
  },
  {
    title: "Double Occupancy - Company Payment (Per Person)",
    price: "( Rs. 65,000 + GST ) = ₹78,312 (Includes 2.5% Convenience Fee)",
    rating: "4.7",
    nights: "2N/3D",
    gradient: "from-amber-100 via-orange-100 to-rose-100",
  },
  {
    title: "Double Occupancy - Personal Payment (Per Person)",
    price: "( Rs. 65,000 + GST ) =  ₹73,287 (Includes 2.5% Convenience Fee)",
    rating: "4.8",
    nights: "2N/3D",
    gradient: "from-violet-100 via-fuchsia-100 to-pink-100",
  },
] as const;

export function PackagesSection() {
  return (
    <div id="packages" className="scroll-mt-24">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Packages
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Explore our best hand-picked holiday packages.- Explore room occupancy options for Samhara 2026.
          </p>
        </div>
        <Link
          href="/form"
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50 sm:self-auto"
        >
          Register for Samhara
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <a
            key={pkg.title}
            href={PACKAGES_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${pkg.title} — chat on WhatsApp`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md outline-none transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-xl focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/25"
          >
            <div
              className={`relative aspect-[16/11] bg-gradient-to-br ${pkg.gradient} shrink-0`}
            >
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
                <StarIcon className="text-amber-400" />
                {pkg.rating}
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <ClockIcon className="text-white/95" />
                {pkg.nights}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{pkg.price}</p>
                </div>
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-slate-800"
                  aria-hidden
                >
                  <ChevronIcon />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
