import { NextResponse } from "next/server";

import { zMobile10Digits } from "@/lib/samharaForm";
import { connectToDb } from "@/lib/mongoose";
import { SamharaSubmission } from "@/models/SamharaSubmission";

export async function GET(req: Request) {
  const mobile = new URL(req.url).searchParams.get("mobile")?.trim() ?? "";
  const parsed = zMobile10Digits.safeParse(mobile);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  await connectToDb();
  const exists = await SamharaSubmission.exists({
    mobileNumber: parsed.data,
  });

  return NextResponse.json({
    ok: true,
    alreadySubmitted: Boolean(exists),
  });
}
