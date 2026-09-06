"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ThermometerSnowflake,
  AlertTriangle,
  Radio,
  ExternalLink,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export const ColdChainAlertWidget: React.FC = () => {
  const { batches, openQuickAction, selectedCompany } = useTenant();

  const activeBatches = selectedCompany
    ? batches.filter((b) => b.companyId === selectedCompany.id)
    : batches;

  const urgentBatches = activeBatches.filter(
    (b) => b.status === "Excursion Warning" || b.status === "Quarantine"
  );

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cold Chain IoT Excursion Radar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active multi-depot sensor telemetry breaches
              </p>
            </div>
          </div>
          <Link
            href="/batches"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Telemetry Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Excursions list */}
        <div className="mt-5 space-y-3">
          {urgentBatches.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                All Telemetry Normal
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All transit sensors are operating within specified target temperature boundaries.
              </p>
            </div>
          ) : (
            urgentBatches.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-rose-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {b.batchNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({b.companyName.split(" ")[0]})
                    </span>
                  </div>
                  <StatusBadge status={b.status} size="sm" />
                </div>

                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                  {b.productName}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400">
                    Live Temp:{" "}
                    <strong
                      className={
                        b.currentTemp > b.targetTempMax
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }
                    >
                      {b.currentTemp}°C
                    </strong>{" "}
                    (Max {b.targetTempMax}°C)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {b.sensorId}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Continuous BLE/LoRaWAN sensor sync</span>
        </div>
        <button
          onClick={() => openQuickAction("quarantine")}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-colors"
        >
          Emergency Hold
        </button>
      </div>
    </div>
  );
};
