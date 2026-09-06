import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alleviare Accounts | Expense & Reimbursement Administration",
  description: "Enterprise Expense Auditing, Travel & Field Allowance Approvals, and Reimbursement Management for Alleviare Pharmaceuticals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0c1322] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
