"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FileCheck, Shield, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";

export const LiveAuditStream: React.FC = () => {
  const { auditLogs, selectedCompany } = useTenant();

  const activeLogs = selectedCompany
    ? auditLogs.filter((l) => l.companyId === selectedCompany.id)
    : auditLogs;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              FDA 21 CFR Part 11 Electronic Audit Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable cryptographically signed action logs across pharma companies
            </p>
          </div>
        </div>

        <Link
          href="/compliance"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          <span>Full Audit Vault</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {activeLogs.slice(0, 4).map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {log.action}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {log.companyName}
                </span>
              </div>
              <StatusBadge status={log.severity} size="sm" />
            </div>

            <p className="text-slate-600 dark:text-slate-300 line-clamp-1">{log.details}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-slate-500" />
                {log.eSignatureHash.substring(0, 22)}...
              </span>
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
