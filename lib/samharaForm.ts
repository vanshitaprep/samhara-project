import { z } from "zod";

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
  "Double Occupancy Payment through Personal Account - ₹ 71,500",
  "Double Occupancy Payment through Company Account - ₹ 76,700",
  "Single Occupancy Payment through Personal Account - ₹1,32,000",
  "Single Occupancy Payment through Company - ₹ 1,41,600",
  "Testing Money Single occupancy through Personal Account - ₹ 1",
] as const;

const packageAmountInr: Record<(typeof packageOptions)[number], number> = {
  "Double Occupancy Payment through Personal Account - ₹ 71,500": 71500,
  "Double Occupancy Payment through Company Account - ₹ 76,700": 76700,
  "Single Occupancy Payment through Personal Account - ₹1,32,000": 132000,
  "Single Occupancy Payment through Company - ₹ 1,41,600": 141600,
  "Testing Money Single occupancy through Personal Account - ₹ 1": 1,
};

export function getAmountForPackageOptionInr(
  opt: (typeof packageOptions)[number]
): number {
  return packageAmountInr[opt];
}

export const samharaSubmissionSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email"),
    fullName: z.string().trim().min(1, "Full name is required"),
    mobileNumber: z
      .string()
      .trim()
      .min(1, "Mobile number is required")
      .regex(/^\d{10}$/, "Enter a 10-digit mobile number"),
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
        message: "Enter a 10-digit mobile number",
      }),
    pocEmail: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Enter a valid email",
      }),
  })
  .superRefine((val, ctx) => {
    if (val.tshirtSize === "Other" && !val.tshirtOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tshirtOther"],
        message: "Please specify your T-shirt size",
      });
    }
  });

export type SamharaSubmissionInput = z.infer<typeof samharaSubmissionSchema>;

