export default function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-dvh bg-[#f1f3f4]">{children}</div>;
}

