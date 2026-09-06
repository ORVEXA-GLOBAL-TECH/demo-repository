import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleviare Unified Staff & Management Portal",
  description: "Enterprise portal for Director, Accounts, Admin, Manager, and Field Supervisors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center">
        {children}
      </body>
    </html>
  );
}
