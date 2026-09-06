"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
  Download,
  Filter,
  Search,
  ChevronDown,
  Building2,
  Award,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Calendar,
  Sparkles,
  PieChart as PieChartIcon,
  RefreshCw,
  Clock,
  Eye,
  Check,
  X,
  Stethoscope,
  Briefcase,
  Sliders,
  Send,
  SlidersHorizontal,
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock Data
const monthlySalesTrend = [
  { month: "Jan", primary: 125, secondary: 110, target: 130 },
  { month: "Feb", primary: 140, secondary: 128, target: 135 },
  { month: "Mar", primary: 165, secondary: 152, target: 150 },
  { month: "Apr", primary: 155, secondary: 142, target: 160 },
  { month: "May", primary: 180, secondary: 168, target: 170 },
  { month: "Jun", primary: 195, secondary: 185, target: 185 },
  { month: "Jul", primary: 210, secondary: 198, target: 200 },
  { month: "Aug", primary: 225, secondary: 215, target: 210 },
];

const regionSalesData = [
  { region: "North Zone", sales: 84.5, target: 80.0, achievement: 105.6, growth: "+14.2%" },
  { region: "South Zone", sales: 72.8, target: 75.0, achievement: 97.1, growth: "+8.4%" },
  { region: "West Zone", sales: 96.2, target: 90.0, achievement: 106.8, growth: "+19.8%" },
  { region: "East Zone", sales: 52.4, target: 55.0, achievement: 95.2, growth: "+6.1%" },
  { region: "Central Zone", sales: 48.6, target: 45.0, achievement: 108.0, growth: "+16.5%" },
];

const topPerformers = [
  { name: "Rahul Verma", role: "Territory MR", region: "Mumbai Central", target: "₹ 12.0L", achievement: "₹ 14.8L", pct: 123.3, rank: 1 },
  { name: "Ananya Deshmukh", role: "Territory MR", region: "Pune South", target: "₹ 10.5L", achievement: "₹ 12.6L", pct: 120.0, rank: 2 },
  { name: "Siddharth Sen", role: "Area Sales Mgr", region: "Kolkata Metro", target: "₹ 45.0L", achievement: "₹ 52.2L", pct: 116.0, rank: 3 },
  { name: "Priya Sundaram", role: "Territory MR", region: "Chennai North", target: "₹ 11.0L", achievement: "₹ 12.4L", pct: 112.7, rank: 4 },
];

const bottomPerformers = [
  { name: "Manish Tiwari", role: "Territory MR", region: "Patna East", target: "₹ 9.0L", achievement: "₹ 5.8L", pct: 64.4, gap: "₹ 3.2L" },
  { name: "Kunal Ghosh", role: "Territory MR", region: "Ranchi Hub", target: "₹ 8.5L", achievement: "₹ 5.9L", pct: 69.4, gap: "₹ 2.6L" },
  { name: "Amitav Roy", role: "Territory MR", region: "Guwahati", target: "₹ 7.5L", achievement: "₹ 5.4L", pct: 72.0, gap: "₹ 2.1L" },
];

const topProductsData = [
  { name: "Cardiovex 20mg", category: "Cardiology", revenue: "₹ 48.2L", units: "12,400", growth: "+24.5%", status: "High Demand" },
  { name: "Glycifit-M2 Forte", category: "Diabetology", revenue: "₹ 38.6L", units: "18,200", growth: "+18.2%", status: "Stable" },
  { name: "Allevia-D Respir", category: "Pulmonology", revenue: "₹ 31.4L", units: "9,800", growth: "+15.0%", status: "High Demand" },
  { name: "Neurocalm Plus", category: "Neurology", revenue: "₹ 26.8L", units: "6,500", growth: "+9.4%", status: "Moderate" },
];

const slowMovingProducts = [
  { name: "Osteoflex-K Gel", category: "Orthopedics", revenue: "₹ 4.2L", stockUnits: "8,900", expiryRisk: "120 Days", action: "Push Scheme" },
  { name: "Dermashield 50g", category: "Dermatology", revenue: "₹ 3.1L", stockUnits: "11,200", expiryRisk: "90 Days", action: "Doctor Sample Push" },
];

const liveMRTrackers = [
  { id: "MR-104", name: "Rahul Verma", territory: "Mumbai Central", status: "In Clinic", doctor: "Dr. A. Mehta (Cardio)", lastSync: "2 mins ago", lat: 18.982, lng: 72.834, visitsToday: "7/9", km: "28 km" },
  { id: "MR-108", name: "Ananya Deshmukh", territory: "Pune South", status: "On Route", doctor: "Heading to Ruby Hall Clinic", lastSync: "Just now", lat: 18.520, lng: 73.856, visitsToday: "6/8", km: "34 km" },
  { id: "MR-112", name: "Vikram Kumar", territory: "Bengaluru East", status: "In Clinic", doctor: "Dr. K. Swamy (Endo)", lastSync: "5 mins ago", lat: 12.971, lng: 77.594, visitsToday: "8/10", km: "42 km" },
  { id: "MR-115", name: "Neha Agarwal", territory: "Delhi North", status: "Idle", doctor: "Max Healthcare Check-out", lastSync: "12 mins ago", lat: 28.704, lng: 77.102, visitsToday: "5/8", km: "19 km" },
];

const executiveApprovals = [
  { id: "EXP-C-901", requester: "Siddharth Sen (RSM)", type: "Large Travel Expense", details: "Annual Regional Doctor CMEs & Conclave", amount: "₹ 1,45,000", urgency: "High", date: "Today" },
  { id: "TER-REQ-44", requester: "Rajesh Sharma (ZSM)", type: "Territory Realignment", details: "Splitting Pune Metro into East & West HQs", amount: "2 New MRs", urgency: "Medium", date: "Yesterday" },
  { id: "TGT-MOD-12", requester: "Amitabh Banerjee (NSM)", type: "Target Revision", details: "Q3 Cardiovex target upward revision by 15%", amount: "+ ₹ 25.0L", urgency: "High", date: "Yesterday" },
];

export default function DirectorPortal() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "performance" | "targets" | "team" | "live-tracking" | "approvals" | "reports"
  >("dashboard");
  const [dateRange, setDateRange] = useState("This Fiscal Year (2026-27)");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [approvalsState, setApprovalsState] = useState(executiveApprovals);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [targetModalOpen, setTargetModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproval = (id: string, action: "Approved" | "Rejected") => {
    setApprovalsState((prev) => prev.filter((item) => item.id !== id));
    showToast(`Request ${id} has been ${action} by Director.`);
  };

  return (
    <div className="flex h-screen bg-[#070d1e] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#091124] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 select-none">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              AD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ALLEVIARE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Director
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Executive Governance & BI
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Executive Modules
            </div>

            {[
              { id: "dashboard", label: "Executive Dashboard", icon: TrendingUp },
              { id: "performance", label: "Business Performance", icon: BarChart3 },
              { id: "targets", label: "Target Management", icon: Target },
              { id: "team", label: "Team Performance", icon: Award },
              { id: "live-tracking", label: "Live MR Tracking", icon: MapPin, badge: "42 Active" },
              { id: "approvals", label: "Executive Approvals", icon: CheckCircle2, badge: approvalsState.length > 0 ? `${approvalsState.length}` : undefined, badgeColor: "bg-amber-500" },
              { id: "reports", label: "Reports & Export", icon: FileSpreadsheet },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        nav.badgeColor
                          ? `${nav.badgeColor} text-white`
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
        <div className="p-4 border-t border-slate-800/80 bg-[#060b17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xs border border-emerald-400/30 shadow-md">
              MD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Dr. Siddharth Nambiar</p>
              <p className="text-[11px] text-emerald-400 font-medium">Managing Director</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#091124]/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              FY 2026-27
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Zone Selector */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-800/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option>All Zones</option>
              <option>North Zone</option>
              <option>South Zone</option>
              <option>West Zone</option>
              <option>East Zone</option>
              <option>Central Zone</option>
            </select>

            {/* Quick Export */}
            <button
              onClick={() => showToast("Exporting Executive BI summary to Excel...")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Company Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 354.5L</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +16.8%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Target: ₹ 340.0L (104.2% achieved)</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Monthly Secondary Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 48.6L</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Current Month Run-rate: 108%</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Active Field Force</span>
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">128 MRs</span>
                    <span className="text-xs font-semibold text-sky-400">96.4% on field</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">8 Regional Mgrs · 24 Supervisors</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Doctor Coverage Index</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">91.2%</span>
                    <span className="text-xs font-semibold text-emerald-400">3,420 Doctors</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Avg 2.8 calls/doctor this month</p>
                </div>
              </div>

              {/* Main Sales Trend vs Target Chart */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white">Primary vs Secondary Sales & Target Run Rate</h2>
                    <p className="text-xs text-slate-400">Monthly fiscal tracking across all zones (in Lakhs INR)</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Primary Sales
                    </span>
                    <span className="flex items-center gap-1.5 text-teal-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Secondary Sales
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Target
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySalesTrend}>
                      <defs>
                        <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                      <Area type="monotone" dataKey="primary" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#primaryGrad)" />
                      <Area type="monotone" dataKey="secondary" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#secGrad)" />
                      <Area type="monotone" dataKey="target" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1.5} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Zone Performance Table */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Zone-Wise Sales & Target Achievement Matrix</h3>
                  <button onClick={() => showToast("Downloading regional breakdown...")} className="text-xs text-emerald-400 hover:underline">
                    View Complete Audit
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Zone / Region</th>
                        <th className="py-3 px-4">Actual Sales</th>
                        <th className="py-3 px-4">Target</th>
                        <th className="py-3 px-4">Achievement</th>
                        <th className="py-3 px-4">YoY Growth</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {regionSalesData.map((row) => (
                        <tr key={row.region} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {row.region}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-200">₹ {row.sales}L</td>
                          <td className="py-3 px-4 text-slate-400">₹ {row.target}L</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${row.achievement >= 100 ? "text-emerald-400" : "text-amber-400"}`}>
                                {row.achievement}%
                              </span>
                              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${row.achievement >= 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                                  style={{ width: `${Math.min(row.achievement, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-400">{row.growth}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                row.achievement >= 100
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {row.achievement >= 100 ? "On Track" : "Action Needed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top MRs Leaderboard */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" /> Top Performing Field Officers
                      </h3>
                      <p className="text-[11px] text-slate-400">Top target achievements across all territories</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Q2 Leaderboard</span>
                  </div>

                  <div className="space-y-3">
                    {topPerformers.map((mr) => (
                      <div key={mr.name} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                            #{mr.rank}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{mr.name}</p>
                            <p className="text-[10px] text-slate-400">{mr.role} · {mr.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-400">{mr.pct}% Achieved</p>
                          <p className="text-[10px] text-slate-400">{mr.achievement} / {mr.target}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Performing Territories / MRs (Action Required) */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" /> Underperforming Territories
                      </h3>
                      <p className="text-[11px] text-slate-400">Target gaps requiring managerial intervention</p>
                    </div>
                    <span className="text-xs font-bold text-rose-400">Review Required</span>
                  </div>

                  <div className="space-y-3">
                    {bottomPerformers.map((mr) => (
                      <div key={mr.name} className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{mr.name}</p>
                          <p className="text-[10px] text-slate-400">{mr.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-rose-400">{mr.pct}% Achieved</p>
                          <p className="text-[10px] text-rose-300">Gap: {mr.gap}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Portfolio Performance */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Product SKU Revenue & Growth Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topProductsData.map((prod) => (
                    <div key={prod.name} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                          {prod.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{prod.growth}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">{prod.name}</h4>
                      <p className="text-lg font-black text-slate-100 mt-1">{prod.revenue}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{prod.units} Units sold</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARGET MANAGEMENT */}
          {activeTab === "targets" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Fiscal Target Cascading & Allocation</h2>
                  <p className="text-xs text-slate-400">Set and allocate quarterly targets across Zones, Managers, Supervisors, and MRs</p>
                </div>
                <button
                  onClick={() => setTargetModalOpen(true)}
                  className="btn-primary"
                >
                  <Target className="w-4 h-4" /> Allocate New Target
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Annual Company Target</span>
                  <p className="text-2xl font-black text-white mt-2">₹ 4,200.0L</p>
                  <p className="text-xs text-emerald-400 mt-1">YTD Achievement: 68.4%</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Q3 Allocated Target</span>
                  <p className="text-2xl font-black text-white mt-2">₹ 1,150.0L</p>
                  <p className="text-xs text-teal-400 mt-1">100% Allocated across 5 Zones</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Average MR Monthly Target</span>
                  <p className="text-2xl font-black text-white mt-2">₹ 11.5L</p>
                  <p className="text-xs text-slate-400 mt-1">Across 128 Field Officers</p>
                </div>
              </div>

              {/* Target Allocation Table */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Hierarchical Target Distribution</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Level / Entity</th>
                      <th className="py-3 px-4">Allocated Manager</th>
                      <th className="py-3 px-4">Q3 Target</th>
                      <th className="py-3 px-4">Current Achievement</th>
                      <th className="py-3 px-4">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">West Zone (Mumbai, Pune, Gujarat)</td>
                      <td className="py-3 px-4 text-slate-300">Rajesh Sharma (ZSM)</td>
                      <td className="py-3 px-4 font-bold text-slate-100">₹ 360.0L</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">₹ 384.5L (106.8%)</td>
                      <td className="py-3 px-4 text-emerald-400">+ ₹ 24.5L</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">North Zone (Delhi, Punjab, UP)</td>
                      <td className="py-3 px-4 text-slate-300">Virender Kapoor (ZSM)</td>
                      <td className="py-3 px-4 font-bold text-slate-100">₹ 320.0L</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">₹ 338.0L (105.6%)</td>
                      <td className="py-3 px-4 text-emerald-400">+ ₹ 18.0L</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">South Zone (Bengaluru, Chennai, Hyderabad)</td>
                      <td className="py-3 px-4 text-slate-300">K. Sundaram (ZSM)</td>
                      <td className="py-3 px-4 font-bold text-slate-100">₹ 300.0L</td>
                      <td className="py-3 px-4 text-amber-400 font-bold">₹ 291.3L (97.1%)</td>
                      <td className="py-3 px-4 text-amber-400">- ₹ 8.7L</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM PERFORMANCE */}
          {activeTab === "team" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white">Field Force Productivity & Governance</h3>
                  <div className="flex gap-2">
                    <input
                      placeholder="Search employee or territory..."
                      className="bg-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Territory</th>
                      <th className="py-3 px-4">Monthly Visits</th>
                      <th className="py-3 px-4">Sales Contrib</th>
                      <th className="py-3 px-4">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {topPerformers.map((emp) => (
                      <tr key={emp.name} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">{emp.name}</td>
                        <td className="py-3 px-4 text-slate-300">{emp.role}</td>
                        <td className="py-3 px-4 text-slate-300">{emp.region}</td>
                        <td className="py-3 px-4 text-emerald-400 font-semibold">184 Calls (98%)</td>
                        <td className="py-3 px-4 font-bold text-white">{emp.achievement}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Grade A+
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE MR TRACKING & MAP */}
          {activeTab === "live-tracking" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Live Field Force GPS & Beat Monitoring
                  </h2>
                  <p className="text-xs text-slate-400">Real-time PostGIS geolocation stream of 128 Medical Representatives across India</p>
                </div>
                <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live WebSocket Stream Connected
                </span>
              </div>

              {/* Map Canvas Mockup with Live Pins */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl relative min-h-[380px] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[#060e22] opacity-80" />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-white">Live Field Telemetry</p>
                    <p className="text-slate-400 text-[11px]">Active MRs Online: 124 / 128</p>
                    <p className="text-slate-400 text-[11px]">Doctor Visits in Progress: 58</p>
                  </div>
                </div>

                {/* Simulated Map Visual */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                  {liveMRTrackers.map((mr) => (
                    <div key={mr.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {mr.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{mr.lastSync}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-2">{mr.name}</h4>
                      <p className="text-[11px] text-slate-400">{mr.territory}</p>
                      <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[11px] space-y-1">
                        <p className="text-emerald-400 font-medium">📍 {mr.doctor}</p>
                        <p className="text-slate-400">Calls Today: {mr.visitsToday} · Travelled: {mr.km}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 flex justify-between items-center text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                  <span>Integrated with OpenStreetMap & Google Maps Geofencing (150m clinic threshold)</span>
                  <button onClick={() => showToast("Refreshing live GPS coordinates...")} className="flex items-center gap-1.5 text-emerald-400 hover:underline">
                    <RefreshCw className="w-3.5 h-3.5" /> Force GPS Refresh
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EXECUTIVE APPROVALS */}
          {activeTab === "approvals" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-base font-bold text-white">Director-Level Approval Queue</h2>
                <p className="text-xs text-slate-400">High-value expenditures, territory realignments, and target revisions</p>
              </div>

              {approvalsState.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white">All Executive Requests Cleared</h3>
                  <p className="text-xs text-slate-400 mt-1">No pending high-level approvals requiring your attention.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalsState.map((req) => (
                    <div key={req.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">{req.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {req.type}
                          </span>
                          <span className="text-[10px] text-slate-500">{req.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{req.details}</h4>
                        <p className="text-xs text-slate-400">Submitted by: <strong className="text-slate-200">{req.requester}</strong> · Impact / Amount: <strong className="text-emerald-400">{req.amount}</strong></p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApproval(req.id, "Rejected")}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleApproval(req.id, "Approved")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: REPORTS & EXPORT */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-base font-bold text-white">Consolidated Executive Reports & Export</h2>
                <p className="text-xs text-slate-400">Generate, schedule, and export business intelligence reports across formats</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Daily Sales & Visit Report", desc: "Consolidated MR calls, orders, and secondary sales booked today.", format: "Excel / PDF" },
                  { title: "Monthly P&L & Target Report", desc: "Zonal performance, budget variance, and growth trajectory.", format: "Excel / CSV" },
                  { title: "Annual Doctor Coverage Audit", desc: "Full coverage compliance, call frequencies, and brand advocacy index.", format: "PDF Report" },
                ].map((rep) => (
                  <div key={rep.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{rep.format}</span>
                      <h4 className="text-sm font-bold text-white mt-1">{rep.title}</h4>
                      <p className="text-xs text-slate-400 mt-2">{rep.desc}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 flex gap-2">
                      <button onClick={() => showToast(`Exporting ${rep.title} (Excel)...`)} className="btn-secondary flex-1 justify-center text-[11px]">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
                      </button>
                      <button onClick={() => showToast(`Exporting ${rep.title} (PDF)...`)} className="btn-secondary flex-1 justify-center text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-rose-400" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Target Modal */}
      {targetModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d162e] border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Allocate Executive Target</h3>
              <button onClick={() => setTargetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Tier</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none">
                  <option>Zone Level (ZSM)</option>
                  <option>Region Level (RSM)</option>
                  <option>Area Level (ASM)</option>
                  <option>Territory MR</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Zone / Territory</label>
                  <input placeholder="e.g. West Zone" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quarter / Month</label>
                  <input placeholder="Q3 FY 2026-27" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sales Target Amount (INR)</label>
                <input placeholder="e.g. ₹ 95,00,000" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setTargetModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  setTargetModalOpen(false);
                  showToast("Target allocated and broadcasted to Regional Managers.");
                }}
                className="btn-primary"
              >
                Publish & Notify Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
