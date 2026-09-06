"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Building2, ShieldCheck, ArrowRight, ExternalLink, Activity } from "lucide-react";
import Link from "next/link";

export const TenantRiskTable: React.FC = () => {
  const { companies, setSelectedCompanyId } = useTenant();

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Pharma Enterprise Risk & Compliance Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-tenant comparison of regulatory health, cold chain alerts, and active hospital connections
          </p>
        </div>

        <Link
          href="/companies"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          <span>Manage All Tenants</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="pb-3 pl-1">Pharma Company</th>
              <th className="pb-3">Tier</th>
              <th className="pb-3">Active SKUs</th>
              <th className="pb-3">Live Batches</th>
              <th className="pb-3">Hospitals</th>
              <th className="pb-3">Compliance</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {companies.map((comp) => (
              <tr
                key={comp.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3.5 pl-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{comp.logo}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {comp.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {comp.code} • {comp.headquarters.split("&")[0]}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {comp.tier}
                  </span>
                </td>
                <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {comp.stats.activeSkus}
                </td>
                <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {comp.stats.activeBatches}
                </td>
                <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {comp.stats.hospitalsSupplied}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                        style={{ width: `${comp.stats.complianceScore}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {comp.stats.complianceScore}%
                    </span>
                  </div>
                </td>
                <td className="py-3.5">
                  <StatusBadge status={comp.status} size="sm" />
                </td>
                <td className="py-3.5 text-right pr-1">
                  <button
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 transition-colors"
                  >
                    Inspect Tenant →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
