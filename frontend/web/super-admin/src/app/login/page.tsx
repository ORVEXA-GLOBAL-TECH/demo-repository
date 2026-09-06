"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { DEMO_AUTH_USERS } from "@/data/mockData";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  Fingerprint,
} from "lucide-react";
import clsx from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const { login, theme, toggleTheme } = useTenant();

  const [selectedUser, setSelectedUser] = useState(DEMO_AUTH_USERS[0]);
  const [email, setEmail] = useState(DEMO_AUTH_USERS[0].email);
  const [password, setPassword] = useState("••••••••••••");
  const [totpCode, setTotpCode] = useState("894 102");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDemoUser = (user: typeof DEMO_AUTH_USERS[0]) => {
    setSelectedUser(user);
    setEmail(user.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedUser);
      setIsLoading(false);
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Left Side: Brand & Governance Info */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#060c18] via-[#09152b] to-[#0d233a] p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 font-bold text-2xl">
                ☤
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>ALVIA</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    SUPER ADMIN
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Multi-Pharma Enterprise SaaS Platform
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>FDA 21 CFR Part 11 Encrypted</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Super Admin credentials require hardware authentication and automatic cryptographic logging in accordance with global health authorities.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multi-Tenant Company Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Cold Chain IoT Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Consolidated Pharmacovigilance Triage</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>v4.2 Enterprise Release</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse" />
              Gateway Online
            </span>
          </div>
        </div>

        {/* Right Side: Login Form & Quick Selectors */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Super Admin Portal Access
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authenticate with authorized administrative credentials
                </p>
              </div>
              <Fingerprint className="w-6 h-6 text-teal-500" />
            </div>

            {/* Quick Demo Profile Switcher */}
            <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Super Admin Role for Demo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_AUTH_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(u)}
                    className={clsx(
                      "p-2 rounded-xl text-left text-xs transition-all border",
                      selectedUser.id === u.id
                        ? "bg-teal-500/15 border-teal-500/40 text-teal-600 dark:text-teal-300 font-bold shadow-sm"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                    )}
                  >
                    <p className="font-bold truncate text-[11px]">{u.name.split(" ")[0]} {u.name.split(" ")[1]}</p>
                    <p className="text-[10px] text-slate-400 truncate">{u.role.split(" ")[0]} {u.role.split(" ")[1]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Authorized Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    2FA Authenticator TOTP
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember Hardware Session</span>
                </label>
                <span className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                  Hardware Key / YubiKey?
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span>Authenticating 21 CFR Token...</span>
                ) : (
                  <>
                    <span>Enter Super Admin Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Protected by Automated Electronic Security Logs • Session Monitored
          </p>
        </div>
      </div>
    </div>
  );
}
