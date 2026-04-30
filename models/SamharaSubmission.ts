import mongoose, { Schema } from "mongoose";

import type { SamharaSubmissionInput } from "@/lib/samharaForm";

export type SamharaSubmissionDocument = SamharaSubmissionInput & {
  createdAt: Date;
  updatedAt: Date;
};

const SamharaSubmissionSchema = new Schema<SamharaSubmissionDocument>(
  {
    email: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true, unique: true },
    zone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    tshirtSize: { type: String, required: true, trim: true },
    tshirtOther: { type: String, required: false, trim: true },
    packageOption: { type: String, required: true, trim: true },
    payment: {
      orderId: { type: String, required: false, trim: true },
      paymentId: { type: String, required: false, trim: true },
      signature: { type: String, required: false, trim: true },
      amountInr: { type: Number, required: false },
    },
    pocName: { type: String, required: false, trim: true },
    pocMobile: { type: String, required: false, trim: true },
    pocEmail: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    collection: "samharasubmission",
  }
);

SamharaSubmissionSchema.index({ mobileNumber: 1 }, { unique: true });

export const SamharaSubmission =
  mongoose.models.SamharaSubmission ||
  mongoose.model<SamharaSubmissionDocument>(
    "SamharaSubmission",
    SamharaSubmissionSchema
  );

