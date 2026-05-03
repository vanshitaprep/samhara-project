"use client";

import { Card } from "antd";
import type { ReactNode } from "react";

function PinIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function PhoneIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M22 16.92v2a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h2a2 2 0 012 1.72 12.44 12.44 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.44 12.44 0 002.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6l-10 7L2 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ContactCard = {
  label: string;
  body: string;
  href?: string;
  icon: ReactNode;
  iconWrap: string;
};

const contactCards: ContactCard[] = [
  {
    label: "Our office address",
    body: "7/5, Gollarpet, Nagarathpete, Bengaluru, Karnataka - 560002",
    icon: <PinIcon />,
    iconWrap: "bg-orange-500/15 text-orange-400",
  },
  {
    label: "Call for booking",
    body: "+91 75062 15327",
    href: "tel:+917506215327",
    icon: <PhoneIcon />,
    iconWrap: "bg-sky-500/15 text-sky-400",
  },
  {
    label: "Email support",
    body: "gm@jatf.in",
    href: "mailto:gm@jatf.in",
    icon: <MailIcon />,
    iconWrap: "bg-emerald-500/15 text-emerald-400",
  },
  {
    label: "Working hours",
    body: "Mon–Sat: 10AM – 8PM",
    icon: <ClockIcon />,
    iconWrap: "bg-violet-500/15 text-violet-400",
  },
];

export function ContactSection() {
  return (
    <div
      id="contact"
      className="scroll-mt-24 border-t border-white/10 bg-slate-950 px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-white sm:mb-12 sm:text-3xl lg:mb-14 lg:text-4xl">
          Contact Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {contactCards.map((c) => (
            <Card
              key={c.label}
              className="group border border-white/10 !bg-slate-900/80 !shadow-none transition-[box-shadow,border-color,transform] duration-300 hover:!border-blue-400/35 hover:!shadow-xl"
              styles={{
                body: { padding: "1.25rem 1.35rem" },
              }}
            >
              <div className="flex gap-4 sm:gap-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${c.iconWrap}`}
                >
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[11px]">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-2 block text-base font-medium leading-snug text-white underline-offset-2 transition-colors hover:text-sky-200 hover:underline sm:text-lg"
                    >
                      {c.body}
                    </a>
                  ) : (
                    <p className="mt-2 text-base font-medium leading-snug text-white sm:text-lg">
                      {c.body}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
