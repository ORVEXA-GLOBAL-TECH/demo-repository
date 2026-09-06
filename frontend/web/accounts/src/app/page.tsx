"use client";

import React, { useState } from "react";
import {
  Receipt,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Download,
  Filter,
  Search,
  ChevronDown,
  DollarSign,
  CreditCard,
  Building2,
  TrendingUp,
  Clock,
  Eye,
  Check,
  X,
  Sliders,
  Sparkles,
  PieChart as PieChartIcon,
  RefreshCw,
  Plus,
  Edit2,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock Expense Claims Data
const initialExpenseClaims = [
  {
    id: "EXP-2026-881",
    employee: "Rahul Verma",
    role: "Territory MR",
    territory: "Mumbai Central",
    supervisor: "Kiran Sharma (ASM)",
    category: "Fuel & Travel",
    amount: 4250,
    claimDate: "2026-08-28",
    description: "Daily beat coverage Mumbai to Thane clinics (142 km)",
    kmDriven: 142,
    receiptUrl: "fuel_bill_881.jpg",
    ocrVerified: true,
    status: "Supervisor Approved",
    reimbursementStatus: "Pending Accounts Audit",
  },
  {
    id: "EXP-2026-882",
    employee: "Ananya Deshmukh",
    role: "Territory MR",
    territory: "Pune South",
    supervisor: "Kiran Sharma (ASM)",
    category: "Food & DA",
    amount: 1200,
    claimDate: "2026-08-28",
    description: "Outstation Daily Allowance (Solapur joint fieldwork)",
    kmDriven: 0,
    receiptUrl: "hotel_receipt_882.jpg",
    ocrVerified: true,
    status: "Supervisor Approved",
    reimbursementStatus: "Pending Accounts Audit",
  },
  {
    id: "EXP-2026-883",
    employee: "Vikram Kumar",
    role: "Territory MR",
    territory: "Bengaluru East",
    supervisor: "Suresh Pillai (ASM)",
    category: "Accommodation",
    amount: 3800,
    claimDate: "2026-08-27",
    description: "Hotel stay for 2 nights - Mysore Doctor Conclave",
    kmDriven: 0,
    receiptUrl: "stay_receipt_883.pdf",
    ocrVerified: true,
    status: "Pending Verification",
    reimbursementStatus: "Awaiting Verification",
  },
  {
    id: "EXP-2026-884",
    employee: "Neha Agarwal",
    role: "Territory MR",
    territory: "Delhi North",
    supervisor: "Virender Kapoor (ASM)",
    category: "Miscellaneous",
    amount: 1850,
    claimDate: "2026-08-26",
    description: "Courier of urgent Cold-Chain samples to Max Hospital",
    kmDriven: 0,
    receiptUrl: "courier_bill_884.jpg",
    ocrVerified: false,
    status: "Accounts Approved",
    reimbursementStatus: "Ready for Reimbursement",
  },
  {
    id: "EXP-2026-885",
    employee: "Siddharth Sen",
    role: "Area Sales Manager",
    territory: "Kolkata Metro",
    supervisor: "Amitabh Banerjee (ZSM)",
    category: "Travel & Flights",
    amount: 12400,
    claimDate: "2026-08-25",
    description: "Flight tickets for Regional Quarterly Review Meeting",
    kmDriven: 0,
    receiptUrl: "flight_ticket_885.pdf",
    ocrVerified: true,
    status: "Reimbursed",
    reimbursementStatus: "Settled via NEFT",
  },
];

const categoryDistribution = [
  { name: "Fuel & Travel", value: 48, color: "#3b82f6" },
  { name: "Food & Daily DA", value: 24, color: "#10b981" },
  { name: "Accommodation", value: 16, color: "#8b5cf6" },
  { name: "Miscellaneous", value: 12, color: "#f59e0b" },
];

const monthlyExpenseTrend = [
  { month: "Apr", amount: 14.2, approved: 13.8 },
  { month: "May", amount: 16.5, approved: 15.9 },
  { month: "Jun", amount: 18.1, approved: 17.4 },
  { month: "Jul", amount: 19.8, approved: 19.2 },
  { month: "Aug", amount: 21.4, approved: 20.1 },
];

export default function AccountsPortal() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "claims" | "categories" | "reimbursements" | "sales-overview" | "reports"
  >("dashboard");
  const [claims, setClaims] = useState(initialExpenseClaims);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveClaim = (id: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Accounts Approved",
              reimbursementStatus: "Ready for Reimbursement",
            }
          : c
      )
    );
    showToast(`Claim ${id} Approved by Accounts & queued for reimbursement.`);
  };

  const handleRejectClaim = (id: string) => {
    const reason = window.prompt("Enter rejection reason for employee:");
    if (reason !== null) {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "Rejected",
                reimbursementStatus: `Rejected: ${reason || "Policy non-compliance"}`,
              }
            : c
        )
      );
      showToast(`Claim ${id} has been Rejected.`);
    }
  };

  const handleBatchReimburse = () => {
    setClaims((prev) =>
      prev.map((c) =>
        c.status === "Accounts Approved"
          ? { ...c, status: "Reimbursed", reimbursementStatus: "Settled via NEFT" }
          : c
      )
    );
    showToast("Batch reimbursement processed! Bank NEFT payout file generated.");
  };

  const filteredClaims = claims.filter((c) => {
    const matchSearch =
      c.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.territory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "All" || c.category === filterCategory;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPendingAmount = claims
    .filter((c) => c.status === "Supervisor Approved" || c.status === "Pending Verification")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalApprovedAmount = claims
    .filter((c) => c.status === "Accounts Approved")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalReimbursedAmount = claims
    .filter((c) => c.status === "Reimbursed")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="flex h-screen bg-[#080e1a] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0c1424] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 select-none">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20">
              AC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ALLEVIARE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Accounts
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Expense & Claims Governance
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Finance & Audit
            </div>

            {[
              { id: "dashboard", label: "Expense Dashboard", icon: TrendingUp },
              { id: "claims", label: "Expense Verification", icon: Receipt, badge: "3 Pending", badgeColor: "bg-amber-500" },
              { id: "reimbursements", label: "Reimbursement Queue", icon: CreditCard, badge: "₹ 1,850", badgeColor: "bg-blue-600" },
              { id: "categories", label: "Categories & Caps", icon: Sliders },
              { id: "sales-overview", label: "Sales & POB Summary", icon: DollarSign },
              { id: "reports", label: "Expense Reports & Export", icon: FileSpreadsheet },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-300 border border-blue-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        nav.badgeColor
                          ? `${nav.badgeColor} text-white`
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
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
        <div className="p-4 border-t border-slate-800/80 bg-[#070b14]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs border border-blue-400/30 shadow-md">
              FM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Ramesh Kulkarni</p>
              <p className="text-[11px] text-blue-400 font-medium">Head of Accounts & Audit</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Field Expense Settlement Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Exporting Expense Audit to Excel...")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Audit</span>
            </button>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: EXPENSE DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Pending Verification</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400">₹ {totalPendingAmount.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-amber-400">3 Claims</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Ready for Accounts Sign-off</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Ready for Reimbursement</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-blue-400">₹ {totalApprovedAmount.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-blue-400">1 Batch</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Approved by Accounts</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Settled This Month</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">₹ {totalReimbursedAmount.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-emerald-400">Paid out</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">100% Direct NEFT Settlement</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Monthly Spend</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 21.4L</span>
                    <span className="text-xs font-semibold text-emerald-400">Within Budget</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Budget: ₹ 24.0L (89.1% Utilized)</p>
                </div>
              </div>

              {/* Monthly Trend & Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-1">Monthly Field Expenditure Trend (in Lakhs INR)</h3>
                  <p className="text-xs text-slate-400 mb-4">Comparison of claims submitted vs approved amounts</p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyExpenseTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                        <Bar dataKey="amount" name="Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="approved" name="Approved & Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Expense by Category</h3>
                    <p className="text-xs text-slate-400 mb-4">Breakdown of field allowances</p>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {categoryDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300">{item.name}</span>
                        </div>
                        <span className="font-bold text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPENSE VERIFICATION & CLAIMS */}
          {activeTab === "claims" && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter & Search Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employee, ID, territory..."
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  >
                    <option>All</option>
                    <option>Fuel & Travel</option>
                    <option>Food & DA</option>
                    <option>Accommodation</option>
                    <option>Miscellaneous</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  >
                    <option>All</option>
                    <option>Supervisor Approved</option>
                    <option>Pending Verification</option>
                    <option>Accounts Approved</option>
                    <option>Reimbursed</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <button
                  onClick={handleBatchReimburse}
                  className="btn-primary whitespace-nowrap"
                >
                  <CreditCard className="w-4 h-4" /> Batch Reimburse (1 Ready)
                </button>
              </div>

              {/* Claims Audit Table */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Claim ID</th>
                        <th className="py-3 px-4">Employee / HQ</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">GPS / KM Check</th>
                        <th className="py-3 px-4">Receipt</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-400">{claim.id}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-white">{claim.employee}</p>
                            <p className="text-[10px] text-slate-400">{claim.role} · {claim.territory}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              {claim.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">₹ {claim.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {claim.kmDriven > 0 ? (
                              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {claim.kmDriven} km (GPS Verified)
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Fixed Allowance</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedReceipt(claim)}
                              className="flex items-center gap-1 text-blue-400 hover:underline font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Receipt
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                claim.status === "Accounts Approved" || claim.status === "Reimbursed"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : claim.status === "Rejected"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {claim.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {claim.status === "Supervisor Approved" || claim.status === "Pending Verification" ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleRejectClaim(claim.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/30"
                                  title="Reject Claim"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleApproveClaim(claim.id)}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                  title="Approve by Accounts"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES & ALLOWANCE CAPS */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Expense Policies & Allowance Caps</h2>
                  <p className="text-xs text-slate-400">Configure per-kilometer fuel reimbursement rates, DA caps, and lodging limits</p>
                </div>
                <button onClick={() => showToast("Allowance policies updated and synchronized.")} className="btn-primary">
                  <Plus className="w-4 h-4" /> Save Policy Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Fuel & Travel (2-Wheeler)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400">Reimbursement Rate per KM</label>
                      <input defaultValue="₹ 4.50 / km" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                    <div>
                      <label className="text-slate-400">Max Daily Travel Limit</label>
                      <input defaultValue="200 KM / day" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Daily Allowance (HQ vs Outstation)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400">HQ Daily Allowance (Food)</label>
                      <input defaultValue="₹ 350 / day" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                    <div>
                      <label className="text-slate-400">Outstation DA (Overnight)</label>
                      <input defaultValue="₹ 800 / day" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Hotel & Accommodation Cap</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400">Tier-1 Metro Cap (Mumbai, Delhi, Blr)</label>
                      <input defaultValue="₹ 2,500 / night" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                    <div>
                      <label className="text-slate-400">Tier-2 / Tier-3 Cities</label>
                      <input defaultValue="₹ 1,500 / night" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REIMBURSEMENTS */}
          {activeTab === "reimbursements" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Batch Payout & NEFT Clearance</h3>
                  <p className="text-xs text-slate-400">1 approved claim awaiting payout disbursement (₹ 1,850)</p>
                </div>
                <button onClick={handleBatchReimburse} className="btn-primary">
                  <CreditCard className="w-4 h-4" /> Disburse & Download Bank NEFT File
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                <h4 className="text-sm font-bold text-white mb-4">Historical Settlement Batches</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Batch #NEFT-2026-08B (14 MRs Settled)</p>
                      <p className="text-[11px] text-slate-400">Settled on: 25 Aug 2026 via HDFC Corporate Gateway</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-400">₹ 1,42,800</p>
                      <span className="text-[10px] text-emerald-300 font-bold">100% Successful</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SALES & ORDERS OVERVIEW */}
          {activeTab === "sales-overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Total Primary Sales Volume</span>
                  <p className="text-2xl font-black text-white mt-2">₹ 354.5L</p>
                  <p className="text-xs text-emerald-400 mt-1">Booked from Distributors</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Secondary Field POB Orders</span>
                  <p className="text-2xl font-black text-blue-400 mt-2">₹ 48.6L</p>
                  <p className="text-xs text-blue-300 mt-1">340 Chemist Orders Booked</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                  <span className="text-xs text-slate-400">Expense to Sales Ratio</span>
                  <p className="text-2xl font-black text-emerald-400 mt-2">6.03%</p>
                  <p className="text-xs text-slate-400 mt-1">Industry standard: &lt; 8.5%</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & EXPORT */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Monthly Field Expense Register", desc: "Detailed breakdown of fuel, food, lodging, and misc expenses by employee.", format: "Excel" },
                  { title: "Territory-wise Cost of Operations", desc: "Expense vs Sales ratio for every HQ and Region.", format: "CSV" },
                  { title: "Accounts Compliance & Audit Pack", desc: "Digital receipts, supervisor approvals, and payment confirmation hashes.", format: "PDF Bundle" },
                ].map((rep) => (
                  <div key={rep.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{rep.format}</span>
                      <h4 className="text-sm font-bold text-white mt-1">{rep.title}</h4>
                      <p className="text-xs text-slate-400 mt-2">{rep.desc}</p>
                    </div>
                    <button
                      onClick={() => showToast(`Generating ${rep.title}...`)}
                      className="mt-5 btn-secondary justify-center text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" /> Export {rep.format}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Receipt Modal Viewer */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1628] border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedReceipt.id} Receipt</h3>
                <p className="text-[11px] text-slate-400">{selectedReceipt.employee} · {selectedReceipt.category}</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <Receipt className="w-12 h-12 text-blue-400 mx-auto" />
              <p className="text-xs font-mono text-slate-300">{selectedReceipt.receiptUrl}</p>
              <p className="text-lg font-bold text-emerald-400">₹ {selectedReceipt.amount.toLocaleString()}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {selectedReceipt.ocrVerified ? "✓ OCR Text Match: 100%" : "Manual Verification Needed"}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl">
              <strong>Notes:</strong> {selectedReceipt.description}
            </p>

            <div className="flex gap-2">
              <button onClick={() => setSelectedReceipt(null)} className="btn-secondary flex-1 justify-center">
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveClaim(selectedReceipt.id);
                  setSelectedReceipt(null);
                }}
                className="btn-primary flex-1 justify-center"
              >
                Approve Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900/95 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
