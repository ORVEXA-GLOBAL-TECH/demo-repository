"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Pill,
  ThermometerSnowflake,
  Network,
  ShieldAlert,
  FileCheck,
  CreditCard,
  Settings,
  PlusCircle,
  Activity,
  Layers,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import clsx from "clsx";

const navItems = [
  {
    name: "Global Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Pharma Companies",
    href: "/companies",
    icon: Building2,
    badgeKey: "companiesCount",
  },
  {
    name: "Drug & SKU Catalog",
    href: "/products",
    icon: Pill,
  },
  {
    name: "Cold Chain & Batches",
    href: "/batches",
    icon: ThermometerSnowflake,
    badgeKey: "coldAlerts",
  },
  {
    name: "Hospital & Supply Network",
    href: "/network",
    icon: Network,
  },
  {
    name: "Pharmacovigilance",
    href: "/pharmacovigilance",
    icon: ShieldAlert,
    badgeKey: "adrCount",
  },
  {
    name: "21 CFR Audit Trail",
    href: "/compliance",
    icon: FileCheck,
  },
  {
    name: "Subscriptions & SLAs",
    href: "/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Security & RBAC",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { companies, batches, adrReports, openQuickAction, selectedCompany } = useTenant();

  const totalColdAlerts = batches.filter(
    (b) => b.status === "Excursion Warning" || b.status === "Quarantine"
  ).length;

  const urgentAdrCount = adrReports.filter(
    (a) => a.severity === "Life-Threatening" || a.severity === "Severe"
  ).length;

  return (
    <aside className="w-64 flex-shrink-0 bg-[#070e1b] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 text-slate-300 z-30 select-none">
      {/* Platform Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/85">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 font-bold text-xl">
              ☤
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ALVIA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Multi-Pharma Enterprise SaaS
              </p>
            </div>
          </div>
        </div>

        {/* Scope Context Tag */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <Layers className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span className="truncate">
              {selectedCompany ? selectedCompany.name : "Global Fleet (All Tenants)"}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-teal-300">
            {selectedCompany ? selectedCompany.code : `${companies.length} Co.`}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Orchestration Modules
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            let badgeNumber = 0;
            let badgeVariant = "default";
            if (item.badgeKey === "companiesCount") {
              badgeNumber = companies.length;
            } else if (item.badgeKey === "coldAlerts" && totalColdAlerts > 0) {
              badgeNumber = totalColdAlerts;
              badgeVariant = "danger";
            } else if (item.badgeKey === "adrCount" && urgentAdrCount > 0) {
              badgeNumber = urgentAdrCount;
              badgeVariant = "warning";
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-teal-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {badgeNumber > 0 && (
                  <span
                    className={clsx(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono",
                      badgeVariant === "danger"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                        : badgeVariant === "warning"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-300"
                    )}
                  >
                    {badgeNumber}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Operator Profile */}
      <div className="p-3 border-t border-slate-800/85 space-y-3 bg-[#060b15]">
        <button
          onClick={() => openQuickAction("company")}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-teal-600/20 hover:shadow-teal-500/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Quick Provision Action</span>
        </button>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xs flex-shrink-0">
              VR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                Dr. Vikramaditya Roy
              </p>
              <p className="text-[10px] text-teal-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Root Super Admin
              </p>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
