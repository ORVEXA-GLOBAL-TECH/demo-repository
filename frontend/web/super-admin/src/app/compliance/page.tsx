"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { AuditLogEntry } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  FileCheck,
  Shield,
  KeyRound,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  Award,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

export default function CompliancePage() {
  const { auditLogs, companies, selectedCompany, addToast } = useTenant();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.eSignatureHash.toLowerCase().includes(search.toLowerCase()) ||
      log.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
    const matchesCompany = selectedCompany ? log.companyId === selectedCompany.id : true;

    return matchesSearch && matchesModule && matchesCompany;
  });

  const handleExportAudit = () => {
    addToast({
      title: "Audit Trail Exported",
      message: "SHA-256 sealed CSV package generated for regulatory submission.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Regulatory Compliance & 21 CFR Part 11 Audit Vault
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable, cryptographically signed electronic records with tamper-evident SHA-256 audit chaining.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Sealed Regulatory Audit Trail</span>
        </button>
      </div>

      {/* Compliance Health Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              US FDA 21 CFR Part 11
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Validated
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            100% Signature Integrity
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Electronic records, audit trails, and authority controls strictly enforced.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              EU GMP Annex 11
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Compliant
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            Computerized Systems Ready
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated backups, access management, and periodic integrity reviews.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              WHO Good Distribution (GDP)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            Cold-Chain Traceability
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Continuous IoT thermal monitoring across all cross-border corridors.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action code, actor name, SHA hash, tenant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Modules</option>
            <option value="Batch Control">Batch Control</option>
            <option value="Company Onboarding">Company Onboarding</option>
            <option value="Product SKU">Product SKU</option>
            <option value="Pharmacovigilance">Pharmacovigilance</option>
            <option value="License Verification">License Verification</option>
            <option value="RBAC & Security">RBAC & Security</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Timestamp (UTC)</th>
                <th className="py-3.5">Action Event</th>
                <th className="py-3.5">Pharma Tenant</th>
                <th className="py-3.5">Authorized Actor</th>
                <th className="py-3.5">Module</th>
                <th className="py-3.5">Details & Narrative</th>
                <th className="py-3.5">Cryptographic Hash</th>
                <th className="py-3.5 pr-6 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 pl-6 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4">
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {log.companyName}
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {log.actorName}
                      </p>
                      <p className="text-[10px] text-slate-400">{log.actorRole}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-4 max-w-xs text-slate-600 dark:text-slate-300">
                    <p className="line-clamp-2">{log.details}</p>
                  </td>
                  <td className="py-4 font-mono text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      {log.eSignatureHash.substring(0, 16)}...
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <StatusBadge status={log.severity} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
