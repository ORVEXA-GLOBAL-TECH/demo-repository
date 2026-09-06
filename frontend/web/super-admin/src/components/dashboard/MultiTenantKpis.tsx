"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Building2,
  Users,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
  AlertOctagon,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileWarning,
  Flame,
} from "lucide-react";
import clsx from "clsx";

export const MultiTenantKpis: React.FC = () => {
  const { metrics, selectedCompany } = useTenant();

  return (
    <div className="space-y-6">
      {/* 1. Companies Metrics Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pharma Companies & Tenants Overview
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {metrics.totalCompanies} Total Managed Organizations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Companies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Companies
              </span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {metrics.totalCompanies}
            </p>
            <p className="mt-1 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              Global Multi-Tenant Fleet
            </p>
          </div>

          {/* Active Companies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Active Companies
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {metrics.activeCompanies}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {Math.round((metrics.activeCompanies / (metrics.totalCompanies || 1)) * 100)}% of total tenants
            </p>
          </div>

          {/* Trial Companies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Trial Companies
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              {metrics.trialCompanies}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Under 30-day evaluation
            </p>
          </div>

          {/* Suspended Companies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Suspended Companies
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              {metrics.suspendedCompanies}
            </p>
            <p className="mt-1 text-[11px] text-rose-500 font-medium">
              Access locked / In review
            </p>
          </div>

          {/* Expired Companies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Expired Companies
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              {metrics.expiredCompanies}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Renewal pending
            </p>
          </div>
        </div>
      </div>

      {/* 2. Users & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Metrics Box */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                User & Administrative Accounts
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-500">
              Active: {metrics.activeUsers} / {metrics.totalUsers}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Total Users
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.totalUsers}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Across all tenants</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Active Users
              </span>
              <p className="text-xl font-bold text-emerald-500 mt-1">
                {metrics.activeUsers}
              </p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5">Currently authenticated</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Company Admins
              </span>
              <p className="text-xl font-bold text-indigo-500 mt-1">
                {metrics.companyAdmins}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tenant Admin roles</p>
            </div>
          </div>
        </div>

        {/* Revenue & Payment Health Box */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Revenue & Payment Ingestion
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">
              ARR: ${(metrics.yearlyRevenue / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Monthly Revenue
              </span>
              <p className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400 mt-1">
                ${metrics.monthlyRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">MRR stream</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Yearly Revenue
              </span>
              <p className="text-lg font-bold font-mono text-emerald-500 mt-1">
                ${metrics.yearlyRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Annual contracts</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Pending Payments
              </span>
              <p className="text-lg font-bold font-mono text-amber-500 mt-1">
                {metrics.pendingPayments} Invoices
              </p>
              <p className="text-[10px] text-amber-500/80 mt-0.5">Awaiting clearance</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Failed Payments
              </span>
              <p className="text-lg font-bold font-mono text-rose-500 mt-1">
                {metrics.failedPayments} Accounts
              </p>
              <p className="text-[10px] text-rose-500/80 mt-0.5">Requires retry</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Subscriptions Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subscription Lifecycle Status
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Active Subscriptions
              </span>
              <p className="text-2xl font-black text-emerald-500 mt-1">
                {metrics.activeSubscriptions}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Healthy recurring accounts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Expiring Soon (&lt;30 days)
              </span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {metrics.expiringSoonSubscriptions}
              </p>
              <p className="text-[11px] text-amber-500 font-medium mt-0.5">Renewal notice dispatched</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              ⏳
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Expired Subscriptions
              </span>
              <p className="text-2xl font-black text-rose-500 mt-1">
                {metrics.expiredSubscriptions}
              </p>
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">Service degraded / Hold</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              ✕
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
