import type { ComponentPropsWithoutRef, ReactNode } from "react";

function ShieldIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-blue-600"
    >
      <path
        d="M12 2.5l7 3.2v6.3c0 5-3 9.4-7 10.9C8 21.4 5 17 5 12V5.7l7-3.2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.2l1.8 1.8 3.8-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type PolicyCardProps = {
  title: string;
  bullets: ReactNode[];
} & Omit<ComponentPropsWithoutRef<"section">, "children">;

export function PolicyCard({
  title,
  bullets,
  ...rest
}: Readonly<PolicyCardProps>) {
  return (
    <section
      className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-10"
      {...rest}
    >
      <div className="flex items-center gap-3">
        <ShieldIcon />
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
      </div>

      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
        {bullets.map((b, idx) => (
          <li key={`${idx}`}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

