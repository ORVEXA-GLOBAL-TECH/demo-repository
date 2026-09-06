"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { BatchRecord } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import {
  ThermometerSnowflake,
  Search,
  Filter,
  Lock,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import clsx from "clsx";

export default function BatchesPage() {
  const { batches, companies, selectedCompany, quarantineBatch, updateBatchStatus, openQuickAction } = useTenant();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>(
    selectedCompany ? selectedCompany.id : "all"
  );
  const [selectedBatchDrawer, setSelectedBatchDrawer] = useState<BatchRecord | null>(null);

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.sensorId.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesCompany =
      companyFilter === "all"
        ? selectedCompany
          ? b.companyId === selectedCompany.id
          : true
        : b.companyId === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ThermometerSnowflake className="w-6 h-6 text-cyan-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Global Cold Chain & Batch Traceability
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time IoT telemetry, temperature excursion tracking, cryogenic dry shipper monitoring, and emergency recall command.
          </p>
        </div>

        <button
          onClick={() => openQuickAction("quarantine")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all"
        >
          <Lock className="w-4 h-4" />
          <span>Emergency Batch Lock / Quarantine</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch number, sensor ID, destination hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {!selectedCompany && (
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Pharma Tenants ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Batch Statuses</option>
            <option value="In Transit (Compliant)">In Transit (Compliant)</option>
            <option value="Excursion Warning">Excursion Warning</option>
            <option value="Quarantine">Quarantine</option>
            <option value="Released / Distributed">Released / Distributed</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Batch Identifier</th>
                <th className="py-3.5">Pharma Tenant</th>
                <th className="py-3.5">Formulation / SKU</th>
                <th className="py-3.5">Live Temperature</th>
                <th className="py-3.5">Target Boundary</th>
                <th className="py-3.5">Destination</th>
                <th className="py-3.5">IoT Gateway Sensor</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 pr-6 text-right">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredBatches.map((b) => {
                const isTempExcursion =
                  b.currentTemp > b.targetTempMax || b.currentTemp < b.targetTempMin;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 pl-6">
                      <div>
                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                          {b.batchNumber}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Mfg: {b.manufactureDate} • Exp: {b.expiryDate}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.companyName}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1">
                        {b.productName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {b.quantityUnits.toLocaleString()} units
                      </p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={clsx(
                            "font-mono font-bold text-sm",
                            isTempExcursion ? "text-rose-500" : "text-emerald-500"
                          )}
                        >
                          {b.currentTemp}°C
                        </span>
                        {isTempExcursion && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {b.targetTempMin}°C to {b.targetTempMax}°C
                    </td>
                    <td className="py-4">
                      <p className="text-slate-800 dark:text-slate-200 line-clamp-1">
                        {b.destination}
                      </p>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {b.sensorId}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedBatchDrawer(b)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20 transition-colors"
                      >
                        Live Graph →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Telemetry Graph Drawer */}
      <Drawer
        isOpen={!!selectedBatchDrawer}
        onClose={() => setSelectedBatchDrawer(null)}
        title={selectedBatchDrawer?.batchNumber || "Batch Telemetry"}
        subtitle={`Product: ${selectedBatchDrawer?.productName} • Managed by ${selectedBatchDrawer?.companyName}`}
        width="2xl"
      >
        {selectedBatchDrawer && (
          <div className="space-y-6">
            {/* Status & Telemetry Header */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Current Sensor Reading</p>
                <h3
                  className={clsx(
                    "text-2xl font-bold font-mono mt-1",
                    selectedBatchDrawer.currentTemp > selectedBatchDrawer.targetTempMax
                      ? "text-rose-500"
                      : "text-emerald-500"
                  )}
                >
                  {selectedBatchDrawer.currentTemp}°C
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Target: {selectedBatchDrawer.targetTempMin}°C — {selectedBatchDrawer.targetTempMax}°C
                </p>
              </div>

              <div className="text-right space-y-2">
                <StatusBadge status={selectedBatchDrawer.status} />
                <p className="text-[11px] text-slate-400 font-mono">
                  Sensor ID: {selectedBatchDrawer.sensorId}
                </p>
              </div>
            </div>

            {/* Quarantine Reason if any */}
            {selectedBatchDrawer.quarantineReason && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Quarantine Lock Active
                </p>
                <p>{selectedBatchDrawer.quarantineReason}</p>
              </div>
            )}

            {/* Continuous IoT Chart */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Continuous IoT Temperature Telemetry</span>
                <span className="text-[11px] text-teal-400 font-mono">● Active BLE Feed</span>
              </h5>

              <div className="h-56 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedBatchDrawer.telemetryLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    <ReferenceLine y={selectedBatchDrawer.targetTempMax} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: `Max ${selectedBatchDrawer.targetTempMax}°C`, fill: "#f43f5e", fontSize: 10 }} />
                    <ReferenceLine y={selectedBatchDrawer.targetTempMin} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: `Min ${selectedBatchDrawer.targetTempMin}°C`, fill: "#38bdf8", fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#14b8a6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transit Route & Logistics */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Route & Depository
              </h5>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Current Location:
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {selectedBatchDrawer.currentLocation}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>QA Officer Sign-off:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedBatchDrawer.qaOfficer}
                  </span>
                </div>
              </div>
            </div>

            {/* Super Admin Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Override & Regulatory Actions
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    quarantineBatch(selectedBatchDrawer.id, "Immediate Hold commanded by Root Super Admin.");
                    setSelectedBatchDrawer(null);
                  }}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 text-center flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Enforce Quarantine</span>
                </button>

                <button
                  onClick={() => {
                    updateBatchStatus(selectedBatchDrawer.id, "Released / Distributed");
                    setSelectedBatchDrawer(null);
                  }}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Certify & Release</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
