import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDb } from "@/lib/mongoose";
import {
  packageOptions,
  zMobile10Digits,
} from "@/lib/samharaForm";
import { RazorpayPaymentLog } from "@/models/RazorpayPaymentLog";

const checkoutSuccessSchema = z.object({
  status: z.literal("checkout_success"),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1),
  amountInr: z.number().finite().positive(),
  packageOption: z.enum(packageOptions),
  customerName: z.string().trim().min(1),
  customerEmail: z.string().trim().email(),
  customerContact: zMobile10Digits,
});

const checkoutDismissedSchema = z.object({
  status: z.literal("checkout_dismissed"),
  razorpayOrderId: z.string().trim().optional(),
  amountInr: z.number().finite().positive().optional(),
  packageOption: z.enum(packageOptions).optional(),
  customerName: z.string().trim().optional(),
  customerEmail: z.string().trim().email().optional(),
  customerContact: zMobile10Digits.optional(),
});

const checkoutPaymentFailedSchema = z.object({
  status: z.literal("checkout_payment_failed"),
  razorpayOrderId: z.string().trim().optional(),
  amountInr: z.number().finite().positive().optional(),
  packageOption: z.enum(packageOptions).optional(),
  customerName: z.string().trim().optional(),
  customerEmail: z.string().trim().email().optional(),
  customerContact: zMobile10Digits.optional(),
  failureCode: z.string().trim().optional(),
  failureDescription: z.string().trim().optional(),
});

const bodySchema = z.discriminatedUnion("status", [
  checkoutSuccessSchema,
  checkoutDismissedSchema,
  checkoutPaymentFailedSchema,
]);

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown;
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const row = parsed.data;

    await connectToDb();

    if (row.status === "checkout_success") {
      await RazorpayPaymentLog.create({
        status: "checkout_success",
        razorpayOrderId: row.razorpayOrderId,
        razorpayPaymentId: row.razorpayPaymentId,
        razorpaySignature: row.razorpaySignature,
        amountInr: row.amountInr,
        currency: "INR",
        packageOption: row.packageOption,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerContact: row.customerContact,
      });
    } else if (row.status === "checkout_dismissed") {
      await RazorpayPaymentLog.create({
        status: "checkout_dismissed",
        razorpayOrderId: row.razorpayOrderId,
        amountInr: row.amountInr,
        packageOption: row.packageOption,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerContact: row.customerContact,
      });
    } else {
      await RazorpayPaymentLog.create({
        status: "checkout_payment_failed",
        razorpayOrderId: row.razorpayOrderId,
        amountInr: row.amountInr,
        packageOption: row.packageOption,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerContact: row.customerContact,
        failureCode: row.failureCode,
        failureDescription: row.failureDescription,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
