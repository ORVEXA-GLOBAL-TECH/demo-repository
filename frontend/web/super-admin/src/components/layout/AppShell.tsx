"use client";

import React, { useEffect, useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { CompanyContextBanner } from "@/components/layout/CompanyContextBanner";
import LoginPage from "@/app/login/page";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useTenant();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070d18] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
      </div>
    );
  }

  // If user is not authenticated, show the Super Admin Dedicated Login Page directly!
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070d18] flex items-center justify-center p-4">
        <LoginPage />
      </div>
    );
  }

  // If user is authenticated as Super Admin, show full Master Dashboard
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <CompanyContextBanner />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
