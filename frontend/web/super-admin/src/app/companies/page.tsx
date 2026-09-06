"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PharmaCompany } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import {
  Building2,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Award,
  Calendar,
  Phone,
  Mail,
  Sliders,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

export default function CompaniesPage() {
  const { companies, setSelectedCompanyId, openQuickAction } = useTenant();
  const [search, setSearch] = useState("");
  const [selectedDrawerComp, setSelectedDrawerComp] = useState<PharmaCompany | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.headquarters.toLowerCase().includes(search.toLowerCase());
    const matchesTier = filterTier === "all" || c.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pharma Tenants & Enterprise Accounts
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-tenant pharmaceutical organizations, licenses, SLAs, and feature access permissions.
          </p>
        </div>

        <button
          onClick={() => openQuickAction("company")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Pharma Company</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name, tenant code, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Subscription Tiers</option>
            <option value="Enterprise Elite">Enterprise Elite</option>
            <option value="Global Sovereign">Global Sovereign</option>
            <option value="BioTech Pro">BioTech Pro</option>
            <option value="Clinical Scale">Clinical Scale</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {comp.logo}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {comp.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Code: <strong className="text-teal-500">{comp.code}</strong> • Est. {comp.foundedYear}
                    </p>
                  </div>
                </div>
                <StatusBadge status={comp.status} size="sm" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-1">
                📍 {comp.headquarters}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">SKUs</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {comp.stats.activeSkus}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Batches</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {comp.stats.activeBatches}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Compliance</p>
                <p className="text-sm font-bold text-emerald-500 mt-0.5">
                  {comp.stats.complianceScore}%
                </p>
              </div>
            </div>

            {/* Licenses / Tier */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Tier:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {comp.tier}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span>FDA FEI:</span>
                <span className="text-teal-600 dark:text-teal-400">
                  {comp.licenses.fdaEstablishmentId}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDrawerComp(comp)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors text-center"
              >
                Inspect Licenses & API
              </button>
              <button
                onClick={() => setSelectedCompanyId(comp.id)}
                className="py-2 px-3 rounded-xl bg-teal-600/15 hover:bg-teal-600/25 text-teal-600 dark:text-teal-400 border border-teal-500/30 text-xs font-bold transition-colors"
                title="Switch entire portal context to this company"
              >
                Scope View →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Company Detail Drawer */}
      <Drawer
        isOpen={!!selectedDrawerComp}
        onClose={() => setSelectedDrawerComp(null)}
        title={selectedDrawerComp?.name || "Company Details"}
        subtitle={`Tenant ID: ${selectedDrawerComp?.id} • Code: ${selectedDrawerComp?.code}`}
        width="xl"
      >
        {selectedDrawerComp && (
          <div className="space-y-6">
            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-4">
              <span className="text-4xl p-2 rounded-xl bg-white dark:bg-slate-800">
                {selectedDrawerComp.logo}
              </span>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedDrawerComp.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {selectedDrawerComp.headquarters} • Joined {selectedDrawerComp.joinedDate}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={selectedDrawerComp.tier} size="sm" />
                  <StatusBadge status={selectedDrawerComp.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Primary QA Contact */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Primary QA & Scientific Officer
              </h5>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedDrawerComp.primaryContact.name}
                </p>
                <p className="text-slate-400">{selectedDrawerComp.primaryContact.role}</p>
                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    {selectedDrawerComp.primaryContact.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    {selectedDrawerComp.primaryContact.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Regulatory Registrations & Certifications */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Regulatory Registrations (21 CFR & GDP)
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">US FDA Establishment Identifier:</span>
                  <span className="font-mono font-bold text-teal-500">
                    {selectedDrawerComp.licenses.fdaEstablishmentId}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">EMA GMP Certificate:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {selectedDrawerComp.licenses.emaGmpCert}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">CDSCO License:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {selectedDrawerComp.licenses.cdscoLicense}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">WHO GDP Verification:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedDrawerComp.licenses.whoGdpVerified ? "✓ Verified Active" : "Pending Audit"}
                  </span>
                </div>
              </div>
            </div>

            {/* Enabled Enterprise Modules */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Provisioned SaaS Modules
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedDrawerComp.enabledModules).map(([key, enabled]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                  >
                    {enabled ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span className="capitalize text-slate-700 dark:text-slate-300">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  setSelectedCompanyId(selectedDrawerComp.id);
                  setSelectedDrawerComp(null);
                }}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 text-center"
              >
                Switch Portal to {selectedDrawerComp.name}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
