import mongoose, { Schema } from "mongoose";

/** Stored in MongoDB collection `razorpaypaymentlogs`. */
export type RazorpayPaymentLogStatus =
  | "order_created"
  | "order_create_failed"
  | "checkout_success"
  | "checkout_dismissed"
  | "checkout_payment_failed";

export type RazorpayPaymentLogDocument = {
  status: RazorpayPaymentLogStatus;
  /** Link to `samharasubmission` document (set when form is submitted). */
  samharaSubmissionId?: Schema.Types.ObjectId;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amountInr?: number;
  currency: string;
  packageOption?: string;
  customerName?: string;
  customerEmail?: string;
  customerContact?: string;
  failureCode?: string;
  failureDescription?: string;
  serverErrorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
};

const RazorpayPaymentLogSchema = new Schema<RazorpayPaymentLogDocument>(
  {
    status: {
      type: String,
      required: true,
      enum: [
        "order_created",
        "order_create_failed",
        "checkout_success",
        "checkout_dismissed",
        "checkout_payment_failed",
      ],
    },
    samharaSubmissionId: {
      type: Schema.Types.ObjectId,
      ref: "SamharaSubmission",
      index: true,
    },
    razorpayOrderId: { type: String, trim: true, index: true },
    razorpayPaymentId: { type: String, trim: true, index: true },
    razorpaySignature: { type: String, trim: true },
    amountInr: { type: Number },
    currency: { type: String, default: "INR", trim: true },
    packageOption: { type: String, trim: true },
    customerName: { type: String, trim: true },
    customerEmail: { type: String, trim: true },
    customerContact: { type: String, trim: true },
    failureCode: { type: String, trim: true },
    failureDescription: { type: String, trim: true },
    serverErrorMessage: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "razorpaypaymentlogs",
  }
);

RazorpayPaymentLogSchema.index({ createdAt: -1 });
RazorpayPaymentLogSchema.index({ status: 1, createdAt: -1 });

export const RazorpayPaymentLog =
  mongoose.models.RazorpayPaymentLog ||
  mongoose.model<RazorpayPaymentLogDocument>(
    "RazorpayPaymentLog",
    RazorpayPaymentLogSchema
  );
