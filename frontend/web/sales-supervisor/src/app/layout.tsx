import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleviare Sales Supervisor | Field Force GPS & MR Operations Command",
  description: "Real-time Field Operations, MR Beat Management, Joint Doctor Visits, and Route Verification for Alleviare Pharmaceuticals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e111a] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
