"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, TrendingUp, Layers } from "lucide-react";
import clsx from "clsx";

const MONTHLY_TREND_DATA = [
  { month: "Jan", Alleviare: 18, Apex: 32, Novis: 22, GeneVance: 6, Horizon: 10 },
  { month: "Feb", Alleviare: 21, Apex: 35, Novis: 24, GeneVance: 7, Horizon: 11 },
  { month: "Mar", Alleviare: 25, Apex: 38, Novis: 28, GeneVance: 8, Horizon: 13 },
  { month: "Apr", Alleviare: 23, Apex: 36, Novis: 26, GeneVance: 7, Horizon: 14 },
  { month: "May", Alleviare: 27, Apex: 40, Novis: 31, GeneVance: 9, Horizon: 15 },
  { month: "Jun", Alleviare: 29, Apex: 42, Novis: 33, GeneVance: 9, Horizon: 16 },
  { month: "Jul", Alleviare: 31, Apex: 44, Novis: 35, GeneVance: 10, Horizon: 18 },
  { month: "Aug", Alleviare: 34, Apex: 47, Novis: 32, GeneVance: 12, Horizon: 20 },
];

export const CompanyDistributionChart: React.FC = () => {
  const { companies, selectedCompany } = useTenant();
  const [chartView, setChartView] = useState<"batches" | "skus">("batches");

  const companyBarData = companies.map((c) => ({
    name: c.code,
    fullName: c.name,
    activeSkus: c.stats.activeSkus,
    activeBatches: c.stats.activeBatches,
    compliance: c.stats.complianceScore,
    hospitals: c.stats.hospitalsSupplied,
  }));

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedCompany
                ? `${selectedCompany.name} Production Velocity`
                : "Cross-Pharma Enterprise Production & SKU Distribution"}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time batch distribution and formulation scaling across managed client tenants
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setChartView("batches")}
            className={clsx(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5",
              chartView === "batches"
                ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Monthly Velocity</span>
          </button>
          <button
            onClick={() => setChartView("skus")}
            className={clsx(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5",
              chartView === "skus"
                ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tenant Volume Matrix</span>
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === "batches" ? (
            <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorApx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorNvs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Area type="monotone" dataKey="Alleviare" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorAlv)" />
              <Area type="monotone" dataKey="Apex" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorApx)" />
              <Area type="monotone" dataKey="Novis" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorNvs)" />
            </AreaChart>
          ) : (
            <BarChart data={companyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="activeSkus" name="Active SKUs" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="activeBatches" name="Live Batches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hospitals" name="Partner Hospitals" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
