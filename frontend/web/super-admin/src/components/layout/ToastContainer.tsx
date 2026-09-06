"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from "lucide-react";
import clsx from "clsx";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTenant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const getToastStyles = () => {
          switch (toast.type) {
            case "success":
              return {
                icon: CheckCircle2,
                border: "border-emerald-500/30",
                bg: "bg-emerald-950/90 dark:bg-emerald-950/90 text-white",
                iconColor: "text-emerald-400",
              };
            case "warning":
              return {
                icon: AlertTriangle,
                border: "border-amber-500/30",
                bg: "bg-amber-950/90 dark:bg-amber-950/90 text-white",
                iconColor: "text-amber-400",
              };
            case "error":
              return {
                icon: AlertOctagon,
                border: "border-rose-500/40",
                bg: "bg-rose-950/90 dark:bg-rose-950/90 text-white",
                iconColor: "text-rose-400",
              };
            default:
              return {
                icon: Info,
                border: "border-teal-500/30",
                bg: "bg-slate-900/90 dark:bg-slate-900/90 text-white",
                iconColor: "text-teal-400",
              };
          }
        };

        const styles = getToastStyles();
        const Icon = styles.icon;

        return (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all animate-fade-in",
              styles.border,
              styles.bg
            )}
          >
            <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", styles.iconColor)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
                <span className="text-[11px] text-slate-400 ml-2">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
