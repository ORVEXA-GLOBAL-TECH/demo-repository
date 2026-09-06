"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PartnerEntity } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import {
  Network,
  Building,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  Star,
  Mail,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function NetworkPage() {
  const { partners, companies, selectedCompany } = useTenant();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedPartnerDrawer, setSelectedPartnerDrawer] = useState<PartnerEntity | null>(null);

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.licenseNumber.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesCompany = selectedCompany
      ? p.assignedCompanies.includes(selectedCompany.id)
      : true;

    return matchesSearch && matchesType && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Hospitals & Distributor Ecosystem
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Certified partner network supplying global healthcare institutions, Tier-1 hospitals, and GDP cold-chain stockists.
          </p>
        </div>

        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Verify & Onboard Partner</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partner hospital, stockist, city, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Partner Types</option>
            <option value="Tier-1 Apex Hospital">Tier-1 Apex Hospital</option>
            <option value="Regional Distributor">Regional Distributor</option>
            <option value="Government Health Org">Government Health Org</option>
            <option value="Central Stockist">Central Stockist</option>
          </select>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((part) => {
          const matchedCompanies = companies.filter((c) =>
            part.assignedCompanies.includes(c.id)
          );

          return (
            <div
              key={part.id}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      {part.type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                      {part.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      📍 {part.city}, {part.country}
                    </p>
                  </div>
                  <StatusBadge status={part.status} size="sm" />
                </div>

                {/* Supplied Companies */}
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Supplied By Pharma Tenants:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {matchedCompanies.map((c) => (
                      <span
                        key={c.id}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {c.logo} {c.code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Credit Utilization & Orders */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Credit Ceiling:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {part.creditLimit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Utilized Credit:</span>
                  <span className="font-mono font-semibold text-amber-500">
                    {part.utilizedCredit}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Active PO Requisitions:</span>
                  <span className="font-bold text-teal-500">{part.activeOrdersCount} POs</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{part.rating}</span>
                </div>

                <button
                  onClick={() => setSelectedPartnerDrawer(part)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20 transition-colors"
                >
                  View Accreditations →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Partner Drawer */}
      <Drawer
        isOpen={!!selectedPartnerDrawer}
        onClose={() => setSelectedPartnerDrawer(null)}
        title={selectedPartnerDrawer?.name || "Partner Profile"}
        subtitle={`Accredited ${selectedPartnerDrawer?.type} • ${selectedPartnerDrawer?.city}, ${selectedPartnerDrawer?.country}`}
        width="xl"
      >
        {selectedPartnerDrawer && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-500 tracking-wider">
                License Verification ID
              </span>
              <h4 className="text-base font-mono font-bold text-slate-900 dark:text-white">
                {selectedPartnerDrawer.licenseNumber}
              </h4>
              <p className="text-xs text-emerald-400 font-semibold">
                {selectedPartnerDrawer.gdpCertified ? "✓ WHO Good Distribution Practice (GDP) Certified" : "Standard Warehouse Audit"}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Authorized Contact Officer
              </h5>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedPartnerDrawer.contactPerson}
                </p>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>{selectedPartnerDrawer.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
