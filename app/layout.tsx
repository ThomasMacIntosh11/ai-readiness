import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Readiness Self-Assessment",
  description: "Assess organizational AI readiness across seven enablers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
