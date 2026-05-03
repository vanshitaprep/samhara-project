"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Modal, Radio, Select, Typography, message } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "../../assets/logo2026.png";
import {
  packageOptions,
  samharaSubmissionSchema,
  tshirtSizes,
  zones,
  getAmountForPackageOptionInr,
  type SamharaSubmissionInput,
} from "@/lib/samharaForm";

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
  const [rzpReady, setRzpReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState<null | {
    orderId: string;
    paymentId: string;
    signature: string;
    amountInr: number;
  }>(null);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
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
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const tshirtSize = watch("tshirtSize");
  const packageOption = watch("packageOption");
  const amountInr = useMemo(() => {
    if (!packageOption) return null;
    return getAmountForPackageOptionInr(packageOption as never);
  }, [packageOption]);

  const onSubmit = async (values: SamharaSubmissionInput) => {
    if (!values.payment) {
      message.error("Please complete payment before submitting.");
      return;
    }

    const res = await fetch("/api/samharasubmission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      if (res.status === 409) {
        message.error("This mobile number has already submitted the form.");
      } else {
        message.error("Could not submit. Please check fields and try again.");
      }
      return;
    }

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
      const data = (await res.json()) as any;
      if (!res.ok || !data?.ok) {
        message.error("Could not start payment. Please try again.");
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amountInr * 100,
        currency: "INR",
        name: "Samhara",
        description: packageOption,
        order_id: data.orderId,
        prefill: data.prefill,
        theme: { color: "#0f172a" },
        handler: (response: any) => {
          const payment = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amountInr: data.amountInr,
          };
          setPaid(payment);
          setValue("payment", payment, { shouldDirty: true });
          message.success("Payment successful. You can submit now.");
        },
        modal: {
          ondismiss: () => {
            message.info("Payment cancelled.");
          },
        },
      });

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
        onLoad={() => setRzpReady(true)}
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
            className="h-7 w-auto"
          />
          <div className="w-[56px]" />
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
              validateStatus={toItemStatus(errors.mobileNumber?.message)}
              help={errors.mobileNumber?.message}
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

              <div className="space-y-3">
                <div className="text-sm text-slate-600">
                  {amountInr != null ? (
                    <span>
                      Amount: <span className="font-semibold">₹ {amountInr}</span>
                    </span>
                  ) : (
                    <span>Select a package to see amount</span>
                  )}
                </div>

                <Button
                  type="primary"
                  block
                  onClick={() => void startPayment()}
                  loading={isPaying}
                  disabled={!packageOption || !!paid}
                >
                  {paid ? "Paid" : "Pay Now"}
                </Button>
              </div>
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

            <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <Button
                htmlType="button"
                onClick={() => reset()}
                size="large"
              >
                Clear form
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                size="large"
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

