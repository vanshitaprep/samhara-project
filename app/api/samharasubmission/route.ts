import { NextResponse } from "next/server";

import { connectToDb } from "@/lib/mongoose";
import { samharaSubmissionSchema } from "@/lib/samharaForm";
import { SamharaSubmission } from "@/models/SamharaSubmission";

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown;
    const parsed = samharaSubmissionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!parsed.data.payment) {
      return NextResponse.json(
        { ok: false, error: "Payment required" },
        { status: 400 }
      );
    }

    await connectToDb();
    const doc = await SamharaSubmission.create(parsed.data);

    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (err) {
    const anyErr = err as { code?: number; keyValue?: Record<string, unknown> };
    if (anyErr?.code === 11000 && anyErr?.keyValue?.mobileNumber) {
      return NextResponse.json(
        {
          ok: false,
          error: "This mobile number has already submitted the form.",
        },
        { status: 409 }
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

