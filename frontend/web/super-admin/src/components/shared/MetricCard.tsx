"use client";

import React from "react";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: "teal" | "blue" | "purple" | "rose" | "amber" | "emerald";
  subtitle?: string;
  onClick?: () => void;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "teal",
  subtitle,
  onClick,
  badge,
}) => {
  const getColorClasses = () => {
    switch (iconColor) {
      case "teal":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "purple":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "rose":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "amber":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "emerald":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative p-5 rounded-2xl border transition-all duration-300",
        "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md",
        onClick && "cursor-pointer hover:border-teal-500/40 hover:-translate-y-0.5",
        "backdrop-blur-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-600 dark:text-teal-300">
                {badge}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        <div className={clsx("p-3 rounded-xl border flex items-center justify-center", getColorClasses())}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={clsx(
                "font-semibold flex items-center",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isPositive ? "↑" : "↓"} {change}
            </span>
            <span className="text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        )}
        {subtitle && !change && (
          <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
