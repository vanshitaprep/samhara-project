import { z } from "zod";

import { roomSharingOptions } from "./roomSharingOptions.generated";

export const zones = [
  "Mumbai",
  "Gujarat",
  "ROM",
  "KKG",
  "TNAPTS",
  "Rajasthan",
  "North",
  "East",
  "MPCG",
  "International",
] as const;

export const tshirtSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "4XL",
  "5XL",
  "Other",
] as const;

export const packageOptions = [
  "Single Occupancy – Company Payment – ₹1,45,140",
  "Single Occupancy – Personal Payment – ₹1,35,300",
  "Double Occupancy – Company Payment (Per Person) – ₹78,312",
  "Double Occupancy – Personal Payment (Per Person) – ₹73,287",
  "Testing – ₹1",
] as const;

/** Roommate list applies only for double-occupancy packages. */
export function isDoubleOccupancyPackage(
  packageOption: string | undefined | null
): boolean {
  const p = packageOption?.trim() ?? "";
  return p.startsWith("Double Occupancy");
}

/** From `List.xlsx` → `data/room-sharing-list.csv` + generated module; run `npm run import-room-list`. */
export { roomSharingOptions };

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const tncMustAccept = z
  .boolean()
  .refine((v) => v === true, { message: "Please tick to accept" });

const packageAmountInr: Record<(typeof packageOptions)[number], number> = {
  "Single Occupancy – Company Payment – ₹1,45,140": 145140,
  "Single Occupancy – Personal Payment – ₹1,35,300": 135300,
  "Double Occupancy – Company Payment (Per Person) – ₹78,312": 78312,
  "Double Occupancy – Personal Payment (Per Person) – ₹73,287": 73287,
  "Testing – ₹1": 1,
};

export function getAmountForPackageOptionInr(
  opt: (typeof packageOptions)[number]
): number {
  return packageAmountInr[opt];
}

const mobile10Message =
  "Enter exactly 10 digits only (no spaces, +, or country code)";

export const zMobile10Digits = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .regex(/^\d{10}$/, mobile10Message);

export const samharaSubmissionSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email"),
    fullName: z.string().trim().min(1, "Full name is required"),
    mobileNumber: zMobile10Digits,
    zone: z.enum(zones, { message: "Select a zone" }),
    city: z.string().trim().min(1, "City is required"),
    tshirtSize: z.enum(tshirtSizes, { message: "Select a T-shirt size" }),
    tshirtOther: z.string().trim().optional(),
    packageOption: z
      .string()
      .trim()
      .min(1, "Please confirm your package option"),
    payment: z
      .object({
        orderId: z.string().trim().min(1, "Missing orderId"),
        paymentId: z.string().trim().min(1, "Missing paymentId"),
        signature: z.string().trim().min(1, "Missing signature"),
        amountInr: z.number().int().positive(),
      })
      .optional(),
    pocName: z.string().trim().optional(),
    pocMobile: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^\d{10}$/.test(v), {
        message: mobile10Message,
      }),
    pocEmail: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Enter a valid email",
      }),
    panCard: z
      .string()
      .trim()
      .min(1, "PAN is required")
      .transform((s) => s.toUpperCase())
      .refine((s) => panRegex.test(s), {
        message: "Enter a valid 10-character PAN (e.g. ABCDE1234F)",
      }),
    /** Required only when `packageOption` is double occupancy; otherwise ignored (see superRefine). */
    roomSharingWith: z.string().trim(),
    tncNonRefundable: tncMustAccept,
    tncConfirmationAfterPayment: tncMustAccept,
    tncAirfareInsuranceExcluded: tncMustAccept,
    tncPaymentAgencyAccount: tncMustAccept,
  })
  .superRefine((val, ctx) => {
    if (val.tshirtSize === "Other" && !val.tshirtOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tshirtOther"],
        message: "Please specify your T-shirt size",
      });
    }
  })
  .superRefine((val, ctx) => {
    if (!isDoubleOccupancyPackage(val.packageOption)) return;
    const s = val.roomSharingWith.trim();
    if (!s) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roomSharingWith"],
        message: "Select who you will share the room with",
      });
      return;
    }
    if (!(roomSharingOptions as readonly string[]).includes(s)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roomSharingWith"],
        message: "Please choose a valid option",
      });
    }
  })
  .superRefine((val, ctx) => {
    const p = val.payment;
    const paid =
      !!p &&
      (p.orderId?.trim().length ?? 0) > 0 &&
      (p.paymentId?.trim().length ?? 0) > 0 &&
      (p.signature?.trim().length ?? 0) > 0 &&
      typeof p.amountInr === "number" &&
      Number.isFinite(p.amountInr) &&
      p.amountInr >= 1;
    if (!paid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payment"],
        message: "Complete Razorpay payment (Pay Now) before you can submit.",
      });
    }
  });

export type SamharaSubmissionInput = z.infer<typeof samharaSubmissionSchema>;

