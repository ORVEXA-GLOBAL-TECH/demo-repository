import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleviare Director | Executive C-Suite Command Portal",
  description: "Executive Business Intelligence, Target vs Achievement, Sales Analytics, and C-Suite Governance for Alleviare Pharmaceuticals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b1329] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
