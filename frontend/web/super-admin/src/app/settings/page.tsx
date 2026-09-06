"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Settings,
  Shield,
  Key,
  Lock,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Copy,
  Plus,
  Trash2,
  Server,
  Zap,
} from "lucide-react";
import clsx from "clsx";

interface RolePermission {
  role: string;
  description: string;
  usersCount: number;
  permissions: {
    manageTenants: boolean;
    quarantineBatches: boolean;
    submitFdaMedwatch: boolean;
    modifySkuSpec: boolean;
    exportAuditVault: boolean;
  };
}

export default function SettingsPage() {
  const { addToast } = useTenant();
  const [activeTab, setActiveTab] = useState<"rbac" | "api" | "security">("rbac");

  const [roles, setRoles] = useState<RolePermission[]>([
    {
      role: "Root Global Super Administrator",
      description: "Complete unrestricted governance over all tenant pharma companies, audit logs, and infrastructure keys.",
      usersCount: 2,
      permissions: {
        manageTenants: true,
        quarantineBatches: true,
        submitFdaMedwatch: true,
        modifySkuSpec: true,
        exportAuditVault: true,
      },
    },
    {
      role: "Global Regulatory Auditor (21 CFR)",
      description: "Read-only access to full immutable audit trails, electronic signature logs, and compliance filings.",
      usersCount: 5,
      permissions: {
        manageTenants: false,
        quarantineBatches: false,
        submitFdaMedwatch: false,
        modifySkuSpec: false,
        exportAuditVault: true,
      },
    },
    {
      role: "Chief Pharmacovigilance Officer",
      description: "Authority to triage adverse events, run causality matrices, and transmit electronic MedWatch 3500A reports to FDA.",
      usersCount: 8,
      permissions: {
        manageTenants: false,
        quarantineBatches: false,
        submitFdaMedwatch: true,
        modifySkuSpec: false,
        exportAuditVault: false,
      },
    },
    {
      role: "Global Logistics & Cold Chain Director",
      description: "Authority to monitor real-time IoT feeds and issue emergency electronic batch quarantine locks.",
      usersCount: 11,
      permissions: {
        manageTenants: false,
        quarantineBatches: true,
        submitFdaMedwatch: false,
        modifySkuSpec: false,
        exportAuditVault: false,
      },
    },
  ]);

  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-01",
      name: "SAP S/4HANA ERP Gateway (Alleviare)",
      prefix: "alv_live_9941a8...",
      created: "2026-01-10",
      lastUsed: "2 mins ago",
      status: "Active",
    },
    {
      id: "key-02",
      name: "Oracle Health Sciences IoT Bridge (Apex)",
      prefix: "apx_live_2104cc...",
      created: "2026-03-14",
      lastUsed: "14 mins ago",
      status: "Active",
    },
    {
      id: "key-03",
      name: "FDA ESG AS2 Electronic Gateway",
      prefix: "fda_esg_cert_01...",
      created: "2025-11-20",
      lastUsed: "1 hour ago",
      status: "Active",
    },
  ]);

  const togglePermission = (roleIndex: number, permKey: keyof RolePermission["permissions"]) => {
    setRoles((prev) =>
      prev.map((r, i) => {
        if (i === roleIndex) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permKey]: !r.permissions[permKey],
            },
          };
        }
        return r;
      })
    );
    addToast({
      title: "Permission Updated",
      message: `RBAC rule updated and written to 21 CFR electronic log.`,
      type: "info",
    });
  };

  const handleCopyKey = (name: string) => {
    addToast({
      title: "Key Copied",
      message: `API token for ${name} copied to clipboard.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-500" />
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Security, RBAC & Platform Integrations
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure multi-tenant role matrices, FDA ESG API tokens, and cryptographic signing authorities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("rbac")}
          className={clsx(
            "pb-3 border-b-2 transition-colors flex items-center gap-2",
            activeTab === "rbac"
              ? "border-teal-500 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <UserCheck className="w-4 h-4" />
          <span>Role-Based Access Control (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={clsx(
            "pb-3 border-b-2 transition-colors flex items-center gap-2",
            activeTab === "api"
              ? "border-teal-500 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Key className="w-4 h-4" />
          <span>API Keys & Tenant Gateways</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={clsx(
            "pb-3 border-b-2 transition-colors flex items-center gap-2",
            activeTab === "security"
              ? "border-teal-500 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Shield className="w-4 h-4" />
          <span>21 CFR Electronic Signature Config</span>
        </button>
      </div>

      {/* Tab 1: RBAC */}
      {activeTab === "rbac" && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Super Admin Role Authority Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Granular permission enforcement applied across all tenant organizations
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {roles.map((role, rIdx) => (
                <div key={role.role} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {role.role}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {role.description}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start">
                      {role.usersCount} Active Users
                    </span>
                  </div>

                  {/* Permissions toggles */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 text-xs">
                    {Object.entries(role.permissions).map(([permKey, isEnabled]) => (
                      <button
                        key={permKey}
                        onClick={() => togglePermission(rIdx, permKey as any)}
                        className={clsx(
                          "p-2.5 rounded-xl border flex items-center justify-between transition-all text-left",
                          isEnabled
                            ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300 font-semibold"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400"
                        )}
                      >
                        <span className="capitalize text-[11px]">
                          {permKey.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span
                          className={clsx(
                            "w-2 h-2 rounded-full flex-shrink-0 ml-2",
                            isEnabled ? "bg-teal-500" : "bg-slate-500"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Keys */}
      {activeTab === "api" && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Active Enterprise Integration Webhooks & Tokens
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Secure API keys for ERP, IoT gateways, and Health Authority gateways
                </p>
              </div>

              <button
                onClick={() =>
                  addToast({
                    title: "API Key Generated",
                    message: "New 256-bit AES token provisioned with IP whitelisting.",
                    type: "success",
                  })
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Secret Key</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {key.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">
                        {key.prefix}
                      </span>
                      <span>• Created: {key.created}</span>
                      <span>• Last used: {key.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyKey(key.name)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition-colors"
                      title="Copy Key"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        addToast({
                          title: "Key Rotated",
                          message: `Key ${key.name} rotated with zero downtime.`,
                          type: "info",
                        })
                      }
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition-colors"
                      title="Rotate Token"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === "security" && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              FDA 21 CFR Part 11 Electronic Signature Requirements
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Mandatory Dual-Factor Credential Re-entry
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Requires password + TOTP re-entry on batch release, quarantine, or SKU modifications.
                  </p>
                </div>
                <span className="text-emerald-500 font-bold">Enforced (Active)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Tamper-Evident SHA-256 Audit Log Chaining
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Every audit entry embeds the hash of the preceding record to prevent modification.
                  </p>
                </div>
                <span className="text-emerald-500 font-bold">Enforced (Active)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
