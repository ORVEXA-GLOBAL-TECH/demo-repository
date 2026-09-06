import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleviare Sales Manager | Revenue Analytics & Field Force Performance",
  description: "Sales Pipeline Monitoring, Doctor Coverage Compliance, Tour Plan Approvals, and Territory Management for Alleviare Pharmaceuticals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08131d] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
