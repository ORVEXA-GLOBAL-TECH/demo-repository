"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  SlidersHorizontal,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Drawer } from "@/components/shared/Drawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import clsx from "clsx";

export const TopHeader: React.FC = () => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    selectedCompany,
    companies,
    batches,
    theme,
    toggleTheme,
    openQuickAction,
    currentUser,
    logout,
  } = useTenant();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingExcursions = batches.filter(
    (b) => b.status === "Excursion Warning" || b.status === "Quarantine"
  );

  return (
    <>
      <header className="h-16 px-6 bg-white/90 dark:bg-[#08101e]/90 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
        {/* Left: Global Multi-Company Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">
                {selectedCompany ? selectedCompany.logo : <Globe className="w-3.5 h-3.5" />}
              </div>
              <span className="font-bold">
                {selectedCompany ? selectedCompany.name : "All Pharma Tenants (Global)"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isCompanyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCompanyDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Switch Active Pharma Tenant
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCompanyId("all");
                      setIsCompanyDropdownOpen(false);
                    }}
                    className={clsx(
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors mt-1",
                      selectedCompanyId === "all"
                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-300 font-bold border border-teal-500/20"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-teal-600/20 text-teal-400 flex items-center justify-center text-xs">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p>Global Fleet (All Tenants)</p>
                        <p className="text-[10px] text-slate-400 font-normal">
                          Cross-company unified telemetry
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">
                      {companies.length}
                    </span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {companies.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          setSelectedCompanyId(comp.id);
                          setIsCompanyDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors",
                          selectedCompanyId === comp.id
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-300 font-bold border border-teal-500/20"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-sm">{comp.logo}</span>
                          <div className="text-left truncate">
                            <p className="truncate">{comp.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal truncate">
                              {comp.headquarters.split("&")[0]} • {comp.tier}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          {comp.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Compliance & Audit Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>FDA 21 CFR Part 11 Enforced</span>
          </div>
        </div>

        {/* Center: Universal Command Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKUs, batches, audit hashes, partner hospitals, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Actions, Notifications & Theme */}
        <div className="flex items-center gap-2">
          {/* Quick Action Button */}
          <button
            onClick={() => openQuickAction("company")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600/15 hover:bg-teal-600/25 border border-teal-500/30 text-teal-600 dark:text-teal-300 text-xs font-bold transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-teal-500" />
            <span className="hidden sm:inline">Actions</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-all"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Notifications Drawer Toggle */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-all"
            title="Notifications & Cold Chain Alerts"
          >
            <Bell className="w-4 h-4" />
            {pendingExcursions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingExcursions.length}
              </span>
            )}
          </button>

          {/* User Account / Login Dropdown */}
          <div className="relative ml-1">
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {currentUser.avatar}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 mr-1" />
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-xs">
                      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                          {currentUser.role}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.email}</p>
                      </div>

                      <div className="py-2 space-y-1">
                        <Link
                          href="/settings"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>Security & RBAC</span>
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Switch Admin Profile</span>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Cross-Pharma Telemetry & Alerts"
        subtitle="Real-time excursions, regulatory deadlines, and security logs"
        width="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Critical Alerts ({pendingExcursions.length})
            </span>
            <button
              onClick={() => openQuickAction("quarantine")}
              className="text-xs font-bold text-rose-500 hover:text-rose-400"
            >
              Emergency Quarantine ⚠
            </button>
          </div>

          {pendingExcursions.map((batch) => (
            <div
              key={batch.id}
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400">
                  {batch.batchNumber}
                </span>
                <StatusBadge status={batch.status} size="sm" />
              </div>
              <p className="text-xs font-semibold text-slate-200">{batch.productName}</p>
              <p className="text-[11px] text-slate-400">
                Company: <span className="font-semibold text-slate-300">{batch.companyName}</span>
              </p>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-500/20">
                <span className="text-slate-400">
                  Temp: <strong className="text-rose-300">{batch.currentTemp}°C</strong> (Target {batch.targetTempMin}°C - {batch.targetTempMax}°C)
                </span>
                <span className="text-slate-400">{batch.sensorId}</span>
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform Status
            </span>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">IoT Cold Chain Sensor Gateway</span>
                <span className="text-emerald-400 font-bold">Operational (99.99%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">FDA ESG & MedWatch API Gateway</span>
                <span className="text-emerald-400 font-bold">Connected (Sync Active)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Immutable Audit Vault (21 CFR)</span>
                <span className="text-emerald-400 font-bold">Sealed & Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
