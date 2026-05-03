"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Typography,
  message,
} from "antd";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "../../assets/logo2026.png";
import {
  getAmountForPackageOptionInr,
  packageOptions,
  roomSharingOptions,
  samharaSubmissionSchema,
  tshirtSizes,
  zones,
  type SamharaSubmissionInput,
} from "@/lib/samharaForm";
import {
  getRazorpayConstructor,
  waitForRazorpayConstructor,
} from "@/lib/razorpayCheckout";

type CheckoutLogContext = {
  orderId: string;
  amountInr: number;
  packageOption: (typeof packageOptions)[number];
  customerName: string;
  customerEmail: string;
  customerContact: string;
};

function postRazorpayPaymentLog(body: Record<string, unknown>) {
  void fetch("/api/razorpay/payment-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** API returns Zod `flatten()` on validation failure (400). */
type ApiFlattenedError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

function isApiFlattenedError(value: unknown): value is ApiFlattenedError {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return Array.isArray(o.formErrors) && typeof o.fieldErrors === "object";
}

function humanizeServerFieldMessage(field: string, raw: string): string {
  if (
    field === "email" &&
    (raw === "Invalid input" || raw.toLowerCase().includes("invalid"))
  ) {
    return "Enter a valid email address.";
  }
  return raw;
}

function toItemStatus(message?: string): "error" | undefined {
  return message ? "error" : undefined;
}

function RequiredLabel({ text }: Readonly<{ text: string }>) {
  return (
    <span>
      {text} <span className="text-red-600">*</span>
    </span>
  );
}

export default function FormPage() {
  const router = useRouter();
  const checkoutLogContextRef = useRef<CheckoutLogContext | null>(null);
  const [rzpReady, setRzpReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  /** True when this mobile is already tied to a saved submission (one phone → one registration). */
  const [mobileAlreadySubmitted, setMobileAlreadySubmitted] = useState(false);
  /** Package option that the current `payment` row was collected for (clears payment if user changes package). */
  const paidPackageOptionRef = useRef<string | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SamharaSubmissionInput>({
    resolver: zodResolver(samharaSubmissionSchema),
    defaultValues: {
      email: "",
      fullName: "",
      mobileNumber: "",
      zone: "Mumbai",
      city: "",
      tshirtSize: "XS",
      tshirtOther: "",
      packageOption: "",
      payment: undefined,
      pocName: "",
      pocMobile: "",
      pocEmail: "",
      panCard: "",
      roomSharingWith: "",
      tncNonRefundable: false,
      tncConfirmationAfterPayment: false,
      tncAirfareInsuranceExcluded: false,
      tncPaymentAgencyAccount: false,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const tshirtSize = watch("tshirtSize");
  const packageOption = watch("packageOption");
  const mobileNumber = watch("mobileNumber");
  const payment = watch("payment");
  const isPaid = Boolean(
    payment?.orderId?.trim() &&
      payment?.paymentId?.trim() &&
      payment?.signature?.trim() &&
      typeof payment.amountInr === "number" &&
      payment.amountInr >= 1
  );

  useEffect(() => {
    if (!isPaid || !paidPackageOptionRef.current) return;
    if (packageOption !== paidPackageOptionRef.current) {
      paidPackageOptionRef.current = null;
      setValue("payment", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [packageOption, isPaid, setValue]);

  useEffect(() => {
    const m = mobileNumber?.trim() ?? "";
    if (!/^\d{10}$/.test(m)) {
      setMobileAlreadySubmitted(false);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch(
            `/api/samharasubmission/check?mobile=${encodeURIComponent(m)}`
          );
          const data = (await res.json()) as {
            ok?: boolean;
            alreadySubmitted?: boolean;
          };
          if (!cancelled && res.ok && data?.ok) {
            setMobileAlreadySubmitted(Boolean(data.alreadySubmitted));
          }
        } catch {
          if (!cancelled) setMobileAlreadySubmitted(false);
        }
      })();
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mobileNumber]);

  const amountInr = useMemo(() => {
    if (!packageOption) return null;
    return getAmountForPackageOptionInr(packageOption as never);
  }, [packageOption]);

  const onSubmit = async (values: SamharaSubmissionInput) => {
    clearErrors();
    const res = await fetch("/api/samharasubmission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: unknown;
    };

    if (!res.ok) {
      if (res.status === 409) {
        message.error("This mobile number has already submitted the form.");
        return;
      }
      if (res.status === 400 && isApiFlattenedError(body.error)) {
        const { formErrors, fieldErrors } = body.error;
        for (const [field, msgs] of Object.entries(fieldErrors)) {
          if (!msgs?.length) continue;
          const raw = msgs.join(" ");
          setError(field as FieldPath<SamharaSubmissionInput>, {
            type: "server",
            message: humanizeServerFieldMessage(field, raw),
          });
        }
        if (formErrors.length > 0) {
          message.error(formErrors.join(" "));
        } else {
          message.error("Please fix the highlighted fields and try again.");
        }
        return;
      }
      const errText =
        typeof body.error === "string" ? body.error : undefined;
      message.error(
        errText ?? "Could not submit. Please check fields and try again."
      );
      return;
    }

    paidPackageOptionRef.current = null;
    reset();
    Modal.success({
      title: "Successfully submitted",
      content: "Your response has been recorded.",
      okText: "Go to Home",
      onOk: () => router.push("/"),
    });
  };

  const startPayment = async () => {
    if (!rzpReady) {
      message.error("Payment system not ready. Please try again.");
      return;
    }
    if (mobileAlreadySubmitted) {
      message.error(
        "This mobile number already has a registration. One submission per phone."
      );
      return;
    }
    if (!packageOption) {
      message.error("Please select a package option first.");
      return;
    }

    const name = watch("fullName");
    const email = watch("email");
    const contact = watch("mobileNumber");
    if (!name || !email || !contact) {
      message.error("Fill Email, Full Name, and Mobile Number first.");
      return;
    }

    setIsPaying(true);
    checkoutLogContextRef.current = null;
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageOption,
          name,
          email,
          contact,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        hint?: string;
        orderId?: string;
        amountInr?: number;
        keyId?: string;
        prefill?: { name?: string; email?: string; contact?: string };
      };
      if (res.status === 409) {
        setMobileAlreadySubmitted(true);
        message.error(
          data?.error ??
            "This mobile number has already been used. One submission per phone."
        );
        return;
      }
      if (!res.ok || !data?.ok) {
        const errText =
          typeof data?.error === "string" && data.error.trim().length > 0
            ? data.error
            : "Could not start payment. Please try again.";
        const hint =
          typeof data?.hint === "string" && data.hint.trim().length > 0
            ? data.hint
            : undefined;
        if (hint) {
          message.open({
            type: "error",
            content: (
              <div>
                <div>{errText}</div>
                <div className="mt-2 border-t border-white/15 pt-2 text-sm leading-snug opacity-95">
                  {hint}
                </div>
              </div>
            ),
            duration: 12,
          });
        } else {
          message.error(errText);
        }
        return;
      }

      const orderId = data.orderId as string;
      const amountInrOrder = data.amountInr as number;
      const keyId = data.keyId as string;
      const prefill = data.prefill as {
        name: string;
        email: string;
        contact: string;
      };

      checkoutLogContextRef.current = {
        orderId,
        amountInr: amountInrOrder,
        packageOption: packageOption as (typeof packageOptions)[number],
        customerName: name,
        customerEmail: email,
        customerContact: contact,
      };

      let RazorpayCtor = getRazorpayConstructor();
      if (!RazorpayCtor) {
        RazorpayCtor = await waitForRazorpayConstructor(10000, 50);
      }
      if (!RazorpayCtor) {
        message.error(
          "Payment checkout could not load. Refresh the page, disable blockers, and try again."
        );
        return;
      }

      const rzp = new RazorpayCtor({
        key: keyId,
        amount: amountInrOrder * 100,
        currency: "INR",
        name: "Samhara",
        description: packageOption,
        order_id: orderId,
        prefill,
        theme: { color: "#0f172a" },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const payment = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amountInr: amountInrOrder,
          };
          const ctx = checkoutLogContextRef.current;
          if (ctx) {
            paidPackageOptionRef.current = ctx.packageOption;
          }
          setValue("payment", payment, {
            shouldDirty: true,
            shouldValidate: true,
          });
          message.success("Payment successful. You can submit now.");
          if (ctx) {
            postRazorpayPaymentLog({
              status: "checkout_success",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amountInr: ctx.amountInr,
              packageOption: ctx.packageOption,
              customerName: ctx.customerName,
              customerEmail: ctx.customerEmail,
              customerContact: ctx.customerContact,
            });
          }
        },
        modal: {
          ondismiss: () => {
            message.info("Payment cancelled.");
            const ctx = checkoutLogContextRef.current;
            if (ctx) {
              postRazorpayPaymentLog({
                status: "checkout_dismissed",
                razorpayOrderId: ctx.orderId,
                amountInr: ctx.amountInr,
                packageOption: ctx.packageOption,
                customerName: ctx.customerName,
                customerEmail: ctx.customerEmail,
                customerContact: ctx.customerContact,
              });
            }
          },
        },
      });

      rzp.on(
        "payment.failed",
        (response: unknown) => {
          const ctx = checkoutLogContextRef.current;
          const err = (
            response as {
              error?: { code?: string; description?: string };
            }
          )?.error;
          postRazorpayPaymentLog({
            status: "checkout_payment_failed",
            razorpayOrderId: ctx?.orderId,
            amountInr: ctx?.amountInr,
            packageOption: ctx?.packageOption,
            customerName: ctx?.customerName,
            customerEmail: ctx?.customerEmail,
            customerContact: ctx?.customerContact,
            failureCode: err?.code,
            failureDescription: err?.description,
          });
        }
      );

      rzp.open();
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-dvh">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          void (async () => {
            const ctor =
              getRazorpayConstructor() ??
              (await waitForRazorpayConstructor(10000, 50));
            setRzpReady(Boolean(ctor));
          })();
        }}
      />
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            ← Back
          </Link>
          <Image
            src={Logo}
            alt="Samhara"
            priority
            className="h-9 w-auto sm:h-10"
          />
          <div className="w-[72px] sm:w-20" aria-hidden />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Registration Form
          </Typography.Title>
          <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
            Please fill in the details below.
          </Typography.Paragraph>

          <Form
            layout="vertical"
            className="mt-8"
            onFinish={() => void handleSubmit(onSubmit)()}
          >
            <div className="space-y-2">
              <Form.Item
                label={<RequiredLabel text="Email" />}
                validateStatus={toItemStatus(errors.email?.message)}
                help={errors.email?.message}
              >
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<RequiredLabel text="Full Name" />}
              validateStatus={toItemStatus(errors.fullName?.message)}
              help={errors.fullName?.message}
            >
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="name"
                    placeholder="Your full name"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={<RequiredLabel text="Mobile Number" />}
              validateStatus={
                errors.mobileNumber?.message || mobileAlreadySubmitted
                  ? "error"
                  : undefined
              }
              help={
                errors.mobileNumber?.message ??
                (mobileAlreadySubmitted
                  ? "This number already has a registration. Only one submission is allowed per mobile number."
                  : undefined)
              }
            >
              <Controller
                control={control}
                name="mobileNumber"
                render={({ field }) => (
                  <Input
                    {...field}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10 digits only, e.g. 9876543210"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            {mobileAlreadySubmitted ? (
              <Alert
                type="warning"
                showIcon
                className="mb-6"
                message="Number already registered"
                description="Use a different mobile number, or contact support if you need to change an existing registration."
              />
            ) : null}

            <Form.Item
              label={<RequiredLabel text="Zone" />}
              validateStatus={toItemStatus(errors.zone?.message)}
              help={errors.zone?.message}
            >
              <Controller
                control={control}
                name="zone"
                render={({ field }) => (
                  <Radio.Group {...field} className="w-full">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {zones.map((z) => (
                        <div
                          key={z}
                          className="rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
                        >
                          <Radio value={z}>{z}</Radio>
                        </div>
                      ))}
                    </div>
                  </Radio.Group>
                )}
              />
            </Form.Item>

            <Form.Item
              label={<RequiredLabel text="City" />}
              validateStatus={toItemStatus(errors.city?.message)}
              help={errors.city?.message}
            >
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Input {...field} placeholder="City" size="large" />
                )}
              />
            </Form.Item>

            <Form.Item
              label={<RequiredLabel text="Tshirt Size" />}
              validateStatus={toItemStatus(errors.tshirtSize?.message)}
              help={errors.tshirtSize?.message}
            >
              <Controller
                control={control}
                name="tshirtSize"
                render={({ field }) => (
                  <Radio.Group {...field} className="w-full">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {tshirtSizes.map((s) => (
                        <div
                          key={s}
                          className="rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
                        >
                          <Radio value={s}>{s}</Radio>
                        </div>
                      ))}
                    </div>
                  </Radio.Group>
                )}
              />
            </Form.Item>

            {tshirtSize === "Other" ? (
              <Form.Item
                label={<RequiredLabel text="Other size" />}
                validateStatus={toItemStatus(errors.tshirtOther?.message)}
                help={errors.tshirtOther?.message}
              >
                <Controller
                  control={control}
                  name="tshirtOther"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your size"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            ) : null}

            <Form.Item
              className="mt-8"
              label={<RequiredLabel text="Pan Card" />}
              validateStatus={toItemStatus(errors.panCard?.message)}
              help={errors.panCard?.message}
            >
              <Controller
                control={control}
                name="panCard"
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    maxLength={10}
                    placeholder="e.g. abcd1234e"
                    size="large"
                    className="[&::placeholder]:text-sm [&::placeholder]:font-normal [&::placeholder]:normal-case"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={<RequiredLabel text="Who will you share room With" />}
              validateStatus={toItemStatus(errors.roomSharingWith?.message)}
              help={errors.roomSharingWith?.message}
            >
                <Controller
                control={control}
                name="roomSharingWith"
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    optionFilterProp="label"
                    size="large"
                    placeholder="Search or choose"
                    options={roomSharingOptions.map((o) => ({
                      label: o,
                      value: o,
                    }))}
                  />
                )}
              />
            </Form.Item>

            <div className="mt-10 space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-1">
                <Typography.Text strong>
                  Confirm your Package option <span className="text-red-600">*</span>
                </Typography.Text>
                <Typography.Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
                  You may kindly select your preferred room occupancy as well as
                  the mode of payment (Company or Personal).
                </Typography.Paragraph>
              </div>

              <Form.Item
                validateStatus={toItemStatus(errors.packageOption?.message)}
                help={errors.packageOption?.message}
              >
                <Controller
                  control={control}
                  name="packageOption"
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      placeholder="Choose"
                      options={packageOptions.map((o) => ({
                        label: o,
                        value: o,
                      }))}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                validateStatus={errors.payment ? "error" : undefined}
                help={
                  typeof errors.payment?.message === "string"
                    ? errors.payment.message
                    : undefined
                }
                className="!mb-0"
              >
                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    {amountInr != null ? (
                      <span>
                        Amount:{" "}
                        <span className="font-semibold">₹ {amountInr}</span>
                      </span>
                    ) : (
                      <span>Select a package to see amount</span>
                    )}
                  </div>

                  <Button
                    type={isPaid ? "default" : "primary"}
                    block
                    onClick={() => void startPayment()}
                    loading={isPaying}
                    disabled={
                      !packageOption ||
                      isPaid ||
                      isPaying ||
                      mobileAlreadySubmitted
                    }
                    className={
                      isPaid
                        ? "!border-emerald-500 !bg-emerald-50 !font-semibold !text-emerald-900"
                        : undefined
                    }
                  >
                    {isPaid ? "Paid" : "Pay Now"}
                  </Button>

                  {isPaid && payment && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-sm text-emerald-950">
                      <p className="m-0 font-semibold">Payment received</p>
                      <p className="mt-1 mb-0 text-xs leading-relaxed text-emerald-900/90">
                        ₹{payment.amountInr} · Order{" "}
                        <span className="font-mono">{payment.orderId}</span>
                        <br />
                        Payment ref{" "}
                        <span className="font-mono">{payment.paymentId}</span>
                      </p>
                    </div>
                  )}
                </div>
              </Form.Item>
            </div>

            <div className="mt-8 space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Name of Your Point of Contact (PA/EA/Secretary)
                </h2>
                <p className="text-sm text-slate-600">
                  They will be marked CC on all Communications along with you.
                </p>
              </div>
              <Controller
                control={control}
                name="pocName"
                render={({ field }) => (
                  <Input {...field} placeholder="Your answer" size="large" />
                )}
              />
            </div>

            <div className="mt-8 space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Mobile No. Your Point of Contact (If any)
                </h2>
                <p className="text-sm text-slate-600">
                  They will be marked CC on all Communications along with you.
                </p>
              </div>
              <Form.Item
                validateStatus={toItemStatus(errors.pocMobile?.message)}
                help={errors.pocMobile?.message}
              >
                <Controller
                  control={control}
                  name="pocMobile"
                  render={({ field }) => (
                    <Input
                      {...field}
                      inputMode="numeric"
                      placeholder="Your answer"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            </div>

            <div className="mt-8 space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Email Id of Your Point of Contact (If any)
                </h2>
                <p className="text-sm text-slate-600">
                  They will be marked CC on all Communications along with you.
                </p>
              </div>
              <Form.Item
                validateStatus={toItemStatus(errors.pocEmail?.message)}
                help={errors.pocEmail?.message}
              >
                <Controller
                  control={control}
                  name="pocEmail"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Your answer"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white sm:text-base">
                Acceptance of TnC
              </div>
              <div className="space-y-3 p-5 sm:p-6">
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  By submitting the form you agree that you have read all the
                  terms and conditions and accept the same.
                </Typography.Paragraph>
                <Typography.Text strong>
                  I agree <span className="text-red-600">*</span>
                </Typography.Text>
                <div className="flex flex-col gap-0 [&_.ant-form-item]:!mb-1.5 [&_.ant-form-item-explain]:min-h-0">
                  <Form.Item
                    validateStatus={toItemStatus(
                      errors.tncNonRefundable?.message
                    )}
                    help={errors.tncNonRefundable?.message}
                    className="!mb-0"
                  >
                    <Controller
                      control={control}
                      name="tncNonRefundable"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        >
                          This is a Non Refundable amount
                        </Checkbox>
                      )}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={toItemStatus(
                      errors.tncConfirmationAfterPayment?.message
                    )}
                    help={errors.tncConfirmationAfterPayment?.message}
                    className="!mb-0"
                  >
                    <Controller
                      control={control}
                      name="tncConfirmationAfterPayment"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        >
                          I understand that confirmation will be only after
                          making the payment
                        </Checkbox>
                      )}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={toItemStatus(
                      errors.tncAirfareInsuranceExcluded?.message
                    )}
                    help={errors.tncAirfareInsuranceExcluded?.message}
                    className="!mb-0"
                  >
                    <Controller
                      control={control}
                      name="tncAirfareInsuranceExcluded"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        >
                          I am aware that Airfare & Insurance are Excluded
                        </Checkbox>
                      )}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={toItemStatus(
                      errors.tncPaymentAgencyAccount?.message
                    )}
                    help={errors.tncPaymentAgencyAccount?.message}
                    className="!mb-0"
                  >
                    <Controller
                      control={control}
                      name="tncPaymentAgencyAccount"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        >
                          I am aware that if the payment does not reflect in the
                          agency account, my registration will not be complete
                        </Checkbox>
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <Button
                htmlType="button"
                onClick={() => {
                  paidPackageOptionRef.current = null;
                  reset();
                }}
                size="large"
              >
                Clear form
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  isSubmitting || !isPaid || mobileAlreadySubmitted
                }
                loading={isSubmitting}
                size="large"
                title={
                  mobileAlreadySubmitted
                    ? "This mobile number already has a registration"
                    : !isPaid
                      ? "Complete Razorpay payment (Pay Now) before submitting"
                      : undefined
                }
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

