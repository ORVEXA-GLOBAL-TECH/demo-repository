"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { MultiTenantKpis } from "@/components/dashboard/MultiTenantKpis";
import { CompanyDistributionChart } from "@/components/dashboard/CompanyDistributionChart";
import { ColdChainAlertWidget } from "@/components/dashboard/ColdChainAlertWidget";
import { TenantRiskTable } from "@/components/dashboard/TenantRiskTable";
import { LiveAuditStream } from "@/components/dashboard/LiveAuditStream";
import {
  Building2,
  Pill,
  ThermometerSnowflake,
  ShieldAlert,
  Sparkles,
  Download,
  Plus,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const { selectedCompany, openQuickAction } = useTenant();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧬</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedCompany
                ? `${selectedCompany.name} Command Portal`
                : "Global Multi-Pharma Super Admin Orchestrator"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {selectedCompany
              ? `Real-time SKU formulation, cold-chain telemetry, and regulatory filing stream for ${selectedCompany.name}.`
              : "Unified governance across 6 pharmaceutical enterprises, 21 CFR Part 11 electronic audit logs, and global cold-chain sensor fleet."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openQuickAction("company")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Pharma Tenant</span>
          </button>

          <button
            onClick={() => openQuickAction("sku")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Pill className="w-4 h-4 text-teal-500" />
            <span>Register SKU</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <MultiTenantKpis />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyDistributionChart />
        </div>
        <div>
          <ColdChainAlertWidget />
        </div>
      </div>

      {/* Risk Matrix and Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TenantRiskTable />
        </div>
        <div>
          <LiveAuditStream />
        </div>
      </div>
    </div>
  );
}
