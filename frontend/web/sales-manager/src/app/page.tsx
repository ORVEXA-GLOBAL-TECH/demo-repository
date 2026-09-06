"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Stethoscope,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  Compass,
  MapPin,
  Clock,
  Eye,
  Check,
  X,
  Plus,
  ArrowUpRight,
  DollarSign,
  Store,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Mock Sales Manager Data
const salesTrendData = [
  { month: "Week 1", sales: 24.2, target: 22.0 },
  { month: "Week 2", sales: 28.5, target: 26.0 },
  { month: "Week 3", sales: 31.0, target: 29.0 },
  { month: "Week 4", sales: 34.8, target: 32.0 },
];

const teamHierarchy = [
  {
    supervisor: "Kiran Sharma (Supervisor)",
    hq: "Mumbai Central",
    mrs: [
      { name: "Rahul Verma", territory: "Parel / Dadar", calls: "142 / 160", orders: "₹ 4.8L", target: "₹ 4.5L", ach: 106.6, status: "Active" },
      { name: "Priya Shah", territory: "Colaba / Fort", calls: "138 / 150", orders: "₹ 4.2L", target: "₹ 4.0L", ach: 105.0, status: "Active" },
    ],
  },
  {
    supervisor: "Suresh Pillai (Supervisor)",
    hq: "Pune Hub",
    mrs: [
      { name: "Ananya Deshmukh", territory: "Pune South", calls: "148 / 160", orders: "₹ 4.6L", target: "₹ 4.2L", ach: 109.5, status: "Active" },
      { name: "Vikram Jadhav", territory: "Thane West", calls: "152 / 160", orders: "₹ 5.1L", target: "₹ 4.8L", ach: 106.2, status: "Active" },
    ],
  },
];

const doctorCoverageSummary = [
  { category: "A+ Priority (Weekly)", total: 420, visited: 412, pending: 8, coveragePct: 98.1 },
  { category: "A Priority (Fortnightly)", total: 850, visited: 810, pending: 40, coveragePct: 95.3 },
  { category: "B Priority (Monthly)", total: 1200, visited: 1080, pending: 120, coveragePct: 90.0 },
  { category: "C Priority (Quarterly)", total: 600, visited: 490, pending: 110, coveragePct: 81.6 },
];

const tourPlansForApproval = [
  {
    id: "TP-2026-W36",
    mr: "Rahul Verma",
    region: "Mumbai Central",
    week: "01 Sep - 06 Sep 2026",
    plannedCalls: 54,
    focusProducts: "Cardiovex 20mg, Vasotens",
    status: "Pending Approval",
  },
  {
    id: "TP-2026-W37",
    mr: "Priya Shah",
    region: "Mumbai South",
    week: "01 Sep - 06 Sep 2026",
    plannedCalls: 48,
    focusProducts: "Glycifit-M2, Allevia-D",
    status: "Pending Approval",
  },
];

export default function SalesManagerPortal() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "team" | "monitoring" | "doctor-coverage" | "tour-plans" | "approvals" | "reports"
  >("dashboard");
  const [tourPlans, setTourPlans] = useState(tourPlansForApproval);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveTP = (id: string) => {
    setTourPlans((prev) => prev.filter((tp) => tp.id !== id));
    showToast(`Tour Plan ${id} approved & published to MR app.`);
  };

  return (
    <div className="flex h-screen bg-[#07111a] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1724] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 select-none">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-cyan-500/20">
              SM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ALLEVIARE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Sales Manager
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Regional Sales & Doctor Beats
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sales Management
            </div>

            {[
              { id: "dashboard", label: "Sales Dashboard", icon: TrendingUp },
              { id: "monitoring", label: "Sales & POB Monitoring", icon: DollarSign },
              { id: "team", label: "Sales Team & Hierarchy", icon: Users },
              { id: "doctor-coverage", label: "Doctor Coverage", icon: Stethoscope },
              { id: "tour-plans", label: "Tour Plans (TP Approvals)", icon: Compass, badge: tourPlans.length > 0 ? `${tourPlans.length}` : undefined, badgeColor: "bg-cyan-500" },
              { id: "approvals", label: "Team Approvals Queue", icon: CheckCircle2 },
              { id: "reports", label: "Sales Reports & Analytics", icon: FileSpreadsheet },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        nav.badgeColor
                          ? `${nav.badgeColor} text-white`
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070e17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold text-xs border border-cyan-400/30 shadow-md">
              SM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Vikas Saxena</p>
              <p className="text-[11px] text-cyan-400 font-medium">Senior Sales Manager (West Zone)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0a1724]/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              West Zone · 18 MRs · 4 Supervisors
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Exporting Regional Sales Report...")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Reports</span>
            </button>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: SALES DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Counters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <span className="text-xs font-medium text-slate-400">Monthly Secondary Sales</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 118.5L</span>
                    <span className="text-xs font-semibold text-emerald-400">+18.4%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Target: ₹ 110.0L (107.7% Achieved)</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <span className="text-xs font-medium text-slate-400">Doctor Calls This Month</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-cyan-400">2,792 / 3,070</span>
                    <span className="text-xs font-semibold text-emerald-400">91.0%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Coverage on track across all HQs</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <span className="text-xs font-medium text-slate-400">POB Orders Booked</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 48.2L</span>
                    <span className="text-xs font-semibold text-cyan-400">384 Orders</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Direct from Chemists & Stockists</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <span className="text-xs font-medium text-slate-400">Active Field Force</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">18 MRs</span>
                    <span className="text-xs font-semibold text-emerald-400">4 Supervisors</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">0 Absenteeism Today</p>
                </div>
              </div>

              {/* Weekly Sales Run-Rate Chart */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-1">Weekly Sales Revenue vs Allocated Target (in Lakhs INR)</h3>
                <p className="text-xs text-slate-400 mb-4">West Zone Monthly Performance Run Rate</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                      <Bar dataKey="target" name="Target" fill="#334155" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sales" name="Actual Sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM HIERARCHY */}
          {activeTab === "team" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-6">
                {teamHierarchy.map((group) => (
                  <div key={group.supervisor} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-cyan-400">{group.supervisor}</h4>
                        <p className="text-xs text-slate-400">HQ: {group.hq}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{group.mrs.length} Field Officers Assigned</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.mrs.map((mr) => (
                        <div key={mr.name} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{mr.name}</p>
                            <p className="text-[10px] text-slate-400">{mr.territory} · Calls: {mr.calls}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-cyan-400">{mr.ach}% Achieved</p>
                            <p className="text-[10px] text-slate-400">{mr.orders} / {mr.target}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCTOR COVERAGE */}
          {activeTab === "doctor-coverage" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Doctor Call Frequency & Coverage Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {doctorCoverageSummary.map((cov) => (
                    <div key={cov.category} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-[10px] font-bold text-cyan-400">{cov.category}</span>
                      <p className="text-xl font-bold text-white mt-1">{cov.coveragePct}%</p>
                      <p className="text-xs text-slate-400 mt-1">{cov.visited} / {cov.total} Doctors Visited</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOUR PLANS APPROVALS */}
          {activeTab === "tour-plans" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Weekly Tour Plan (TP) Approval Queue</h3>
                {tourPlans.length === 0 ? (
                  <p className="text-xs text-slate-400">No pending tour plans for review.</p>
                ) : (
                  <div className="space-y-3">
                    {tourPlans.map((tp) => (
                      <div key={tp.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{tp.mr} ({tp.id})</p>
                          <p className="text-[11px] text-slate-400">{tp.region} · {tp.week}</p>
                          <p className="text-[11px] text-slate-300 mt-1">Planned Calls: {tp.plannedCalls} · Focus: {tp.focusProducts}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => showToast(`TP ${tp.id} returned for revision.`)} className="btn-secondary text-[11px]">
                            Request Change
                          </button>
                          <button onClick={() => handleApproveTP(tp.id)} className="btn-primary text-[11px]">
                            Approve Tour Plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Doctor Coverage & Call Matrix", desc: "Detailed doctor visit compliance and pending list by MR." },
                  { title: "Secondary Sales & POB Report", desc: "Chemist orders booked and product-wise revenue breakdown." },
                  { title: "MR Target vs Achievement Ledger", desc: "Monthly target run-rate and territory growth percentages." },
                ].map((rep) => (
                  <div key={rep.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rep.title}</h4>
                      <p className="text-xs text-slate-400 mt-2">{rep.desc}</p>
                    </div>
                    <button onClick={() => showToast(`Generating ${rep.title}...`)} className="mt-5 btn-secondary justify-center text-[11px]">
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Excel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
