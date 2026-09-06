"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { Globe, X, ExternalLink, ShieldCheck, Award } from "lucide-react";

export const CompanyContextBanner: React.FC = () => {
  const { selectedCompany, setSelectedCompanyId } = useTenant();

  if (!selectedCompany) return null;

  return (
    <div className="bg-gradient-to-r from-teal-950/80 via-slate-900/90 to-teal-950/80 border-b border-teal-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-slate-200 backdrop-blur-md animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-base">{selectedCompany.logo}</span>
        <div>
          <span className="font-bold text-teal-300">
            Tenant Scoped View: {selectedCompany.name} ({selectedCompany.code})
          </span>
          <span className="hidden sm:inline text-slate-400 ml-2">
            • Tier: {selectedCompany.tier} • HQ: {selectedCompany.headquarters} • Compliance: {selectedCompany.stats.complianceScore}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[11px] border border-teal-500/30">
          <Award className="w-3 h-3 text-teal-400" />
          <span>FDA: {selectedCompany.licenses.fdaEstablishmentId}</span>
        </div>

        <button
          onClick={() => setSelectedCompanyId("all")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span>Exit to Global View</span>
          <X className="w-3.5 h-3.5 ml-1 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
