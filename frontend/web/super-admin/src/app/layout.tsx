import type { Metadata } from "next";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";
import { AppShell } from "@/components/layout/AppShell";
import { QuickActionModal } from "@/components/layout/QuickActionModal";
import { ToastContainer } from "@/components/layout/ToastContainer";

export const metadata: Metadata = {
  title: "Alvia — Multi-Pharma Enterprise Super Admin Platform",
  description: "Global Multi-Tenant Pharmaceutical & Biotech Orchestration, Cold-Chain IoT, 21 CFR Part 11 Audit Trail & Regulatory Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-teal-500 selection:text-white">
        <TenantProvider>
          <AppShell>
            {children}
          </AppShell>
          <QuickActionModal />
          <ToastContainer />
        </TenantProvider>
      </body>
    </html>
  );
}
