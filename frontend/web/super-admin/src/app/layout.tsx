import type { Metadata } from "next";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { CompanyContextBanner } from "@/components/layout/CompanyContextBanner";
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
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <TopHeader />
              <CompanyContextBanner />
              <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
                {children}
              </main>
            </div>
          </div>

          <QuickActionModal />
          <ToastContainer />
        </TenantProvider>
      </body>
    </html>
  );
}
