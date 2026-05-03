import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

import {
  getAmountForPackageOptionInr,
  packageOptions,
  zMobile10Digits,
} from "@/lib/samharaForm";

const reqSchema = z.object({
  packageOption: z.enum(packageOptions),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  contact: zMobile10Digits,
});

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { ok: false, error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }
    if (keySecret.startsWith("rzp_")) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "RAZORPAY_KEY_SECRET looks incorrect (it should NOT start with rzp_).",
        },
        { status: 500 }
      );
    }

    const json = (await req.json()) as unknown;
    const parsed = reqSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const amountInr = getAmountForPackageOptionInr(parsed.data.packageOption);
    const amountPaise = amountInr * 100;

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `samhara_${Date.now()}`,
      notes: {
        packageOption: parsed.data.packageOption,
        name: parsed.data.name,
        email: parsed.data.email,
        contact: parsed.data.contact,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amountInr,
      currency: order.currency,
      keyId,
      prefill: {
        name: parsed.data.name,
        email: parsed.data.email,
        contact: parsed.data.contact,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        ...(process.env.NODE_ENV === "development"
          ? { hint: "Check Razorpay env keys and restart dev server." }
          : {}),
      },
      { status: 500 }
    );
  }
}

