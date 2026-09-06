"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { SubscriptionPlan, CompanyTier } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  Calendar,
  Radio,
  HardDrive,
  Users,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

export default function SubscriptionsPage() {
  const { subscriptions, companies, selectedCompany, addToast } = useTenant();

  const filteredSubscriptions = subscriptions.filter((sub) =>
    selectedCompany ? sub.companyId === selectedCompany.id : true
  );

  const totalMrr = subscriptions.reduce((acc, s) => acc + s.mrr, 0);

  const handleUpdatePlan = (companyName: string) => {
    addToast({
      title: "Plan Config Updated",
      message: `Quotas and enterprise SLA provisions updated for ${companyName}.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Subscriptions, SLAs & Tenant Quota Control
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise multi-tenant billing, active sensor IoT allocations, cloud storage allowances, and contractual SLAs.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
              Total Managed Platform MRR
            </p>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
              ${totalMrr.toLocaleString()} / mo
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((sub) => {
          const comp = companies.find((c) => c.id === sub.companyId);
          const sensorUsagePct = Math.round((sub.sensorsUsed / sub.coldChainSensorsQuota) * 100);
          const userUsagePct = Math.round((sub.usersUsed / sub.activeUsersQuota) * 100);

          return (
            <div
              key={sub.id}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {comp?.logo || "🏢"}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {sub.companyName}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Renewal: {sub.contractRenewal} ({sub.billingCycle})
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={sub.tier} size="sm" />
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Contract MRR
                    </span>
                    <p className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                      ${sub.mrr.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Guaranteed SLA
                    </span>
                    <p className="text-sm font-bold text-emerald-500">{sub.slaUptime}</p>
                  </div>
                </div>
              </div>

              {/* Quotas & Progress Bars */}
              <div className="space-y-3 text-xs">
                {/* Sensors */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      IoT Cold Sensors:
                    </span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {sub.sensorsUsed} / {sub.coldChainSensorsQuota} ({sensorUsagePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        sensorUsagePct > 90 ? "bg-rose-500" : "bg-cyan-500"
                      )}
                      style={{ width: `${sensorUsagePct}%` }}
                    />
                  </div>
                </div>

                {/* Users */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      Admin Seats:
                    </span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {sub.usersUsed} / {sub.activeUsersQuota} ({userUsagePct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${userUsagePct}%` }}
                    />
                  </div>
                </div>

                {/* Storage */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    Encrypted Cloud Vault:
                  </span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                    {sub.storageGb} GB
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Auto-Renewal: {sub.autoRenew ? "Enabled" : "Manual"}
                </span>
                <button
                  onClick={() => handleUpdatePlan(sub.companyName)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 transition-colors"
                >
                  Adjust Quota →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
