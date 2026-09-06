"use client";

import React from "react";
import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const getBadgeStyle = (val: string) => {
    switch (val) {
      case "Active":
      case "Verified Active":
      case "In Transit (Compliant)":
      case "Commercial":
      case "Released / Distributed":
      case "Normal":
      case "Closed / Resolved":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      
      case "Under Audit":
      case "Warning":
      case "Excursion Warning":
      case "Under Medical Review":
      case "Under QA Investigation":
      case "Triaged":
      case "Phase III Clinical":
      case "Regulatory Review":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

      case "Quarantine":
      case "Suspended":
      case "Critical":
      case "Life-Threatening":
      case "Severe":
      case "Recalled":
      case "Critical Action":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

      case "Pending Setup":
      case "Verification Pending":
      case "R&D Formulation":
      case "In Production":
      case "Info":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

      case "FDA MedWatch Filed":
      case "Enterprise Elite":
      case "Global Sovereign":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-all",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        getBadgeStyle(status)
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full",
          status.includes("Quarantine") || status.includes("Critical") || status.includes("Life") || status.includes("Suspended")
            ? "bg-rose-500 animate-pulse"
            : status.includes("Warning") || status.includes("Audit") || status.includes("Excursion")
            ? "bg-amber-500 animate-pulse"
            : status.includes("Active") || status.includes("Compliant")
            ? "bg-emerald-500"
            : "bg-current opacity-70"
        )}
      />
      {status}
    </span>
  );
};
