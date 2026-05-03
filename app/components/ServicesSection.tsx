"use client";

import { Card } from "antd";
import type { ReactNode } from "react";

function IconWrap({
  children,
  variant = "soft",
  hotelHover = false,
}: Readonly<{
  children: ReactNode;
  variant?: "soft" | "solid";
  /** Soft tray + outline icon; on card hover → solid blue tray + filled icon (hotel only). */
  hotelHover?: boolean;
}>) {
  if (hotelHover) {
    return (
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-100 text-blue-600 transition-[background-color,color] duration-300 group-hover:bg-blue-600 group-hover:text-white">
        {children}
      </div>
    );
  }
  return (
    <div
      className={
        variant === "solid"
          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white"
          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
      }
    >
      {children}
    </div>
  );
}

function FlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 8l-9 5-4 6-2-4 4-3-9-4 11-1 9 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 15h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM6 15V8a2 2 0 012-2h8a2 2 0 012 2v7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 19v2M16 19v2M9 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 17V6a1 1 0 011-1h10a1 1 0 011 1v11M4 17h16M6 17H4M18 17h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 7h8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="17" r="1.5" fill="currentColor" />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HotelIconOutline() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="absolute inset-0 m-auto opacity-100 transition-opacity duration-300 group-hover:opacity-0"
    >
      <path
        d="M4 20V10l8-4 8 4v10M9 20v-6h6v6M4 20h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 10h2M13 10h2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HotelIconFilled() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
      className="absolute inset-0 m-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <path
        fill="currentColor"
        d="M12 5.5 3 10v10h5.5v-6.5h7V20H21V10l-9-4.5z"
      />
    </svg>
  );
}

function HotelIconPair() {
  return (
    <>
      <HotelIconOutline />
      <HotelIconFilled />
    </>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V6l8-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const services: ReadonlyArray<{
  title: string;
  description: string;
  icon: ReactNode;
  variant: "soft" | "solid";
  hotelHover?: boolean;
}> = [
  {
    title: "Flight Booking",
    description:
      "Book domestic and international flight tickets in Bengaluru with the best fares and instant confirmation.",
    icon: <FlightIcon />,
    variant: "soft" as const,
  },
  {
    title: "Train Booking",
    description:
      "Hassle-free IRCTC train reservations and ticket booking assistance for all Indian rail routes.",
    icon: <TrainIcon />,
    variant: "soft" as const,
  },
  {
    title: "Bus Booking",
    description:
      "Comfortable inter-city bus travel bookings across Karnataka and all major routes in India.",
    icon: <BusIcon />,
    variant: "soft" as const,
  },
  {
    title: "Hotel Booking",
    description:
      "Get handpicked accommodation deals from budget hotels to premium luxury resorts worldwide.",
    icon: <HotelIconPair />,
    variant: "soft",
    hotelHover: true,
  },
  {
    title: "Holiday Packages",
    description:
      "Customized international and domestic tour itineraries tailored for families, couples, and groups.",
    icon: <PinIcon />,
    variant: "soft" as const,
  },
  {
    title: "Secure Payments",
    description:
      "We ensure 100% safe and encrypted transaction processing powered by Razorpay payment gateway.",
    icon: <SecureIcon />,
    variant: "soft" as const,
  },
];

export function ServicesSection() {
  return (
    <div id="services" className="scroll-mt-24">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Services
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card
            key={s.title}
            hoverable
            className="group overflow-hidden rounded-2xl border border-black/5 !shadow-sm transition-[box-shadow,background-color,border-color,transform] duration-300 hover:!border-blue-300 hover:!bg-blue-50 hover:!shadow-xl"
            styles={{
              body: {
                padding: "1.5rem 1.5rem",
              },
            }}
          >
            <div className="text-left">
              <IconWrap variant={s.variant} hotelHover={s.hotelHover ?? false}>
                {s.icon}
              </IconWrap>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {s.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
