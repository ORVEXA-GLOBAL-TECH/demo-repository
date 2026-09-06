"use client";

import React, { useState } from "react";
import {
  Users,
  MapPin,
  Calendar,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  DollarSign,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  ChevronDown,
  Navigation,
  Eye,
  Check,
  X,
  Radio,
  RefreshCw,
  Send,
  MessageSquare,
  AlertTriangle,
  Award,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Mock Supervised MR Team
const mrTeamData = [
  {
    id: "MR-101",
    name: "Rahul Verma",
    phone: "+91 98201 44512",
    territory: "Mumbai Central",
    hq: "Dadar / Parel",
    status: "In Clinic",
    attendance: "08:45 AM (Punched In)",
    currentLocation: "KEM Hospital, Parel",
    todayVisitsPlanned: 9,
    todayVisitsDone: 7,
    ordersBooked: "₹ 42,500",
    distanceKm: "28.4 km",
    geofenceCompliance: "100%",
  },
  {
    id: "MR-102",
    name: "Priya Shah",
    phone: "+91 98203 11842",
    territory: "Mumbai South",
    hq: "Churchgate / Colaba",
    status: "On Route",
    attendance: "09:00 AM (Punched In)",
    currentLocation: "Heading to Bombay Hospital",
    todayVisitsPlanned: 8,
    todayVisitsDone: 5,
    ordersBooked: "₹ 38,000",
    distanceKm: "32.1 km",
    geofenceCompliance: "95%",
  },
  {
    id: "MR-103",
    name: "Vikram Jadhav",
    phone: "+91 98209 88124",
    territory: "Thane West",
    hq: "Thane Hub",
    status: "In Clinic",
    attendance: "08:50 AM (Punched In)",
    currentLocation: "Jupiter Hospital OPD",
    todayVisitsPlanned: 10,
    todayVisitsDone: 8,
    ordersBooked: "₹ 51,200",
    distanceKm: "41.0 km",
    geofenceCompliance: "100%",
  },
  {
    id: "MR-104",
    name: "Sneha Patil",
    phone: "+91 98204 77319",
    territory: "Navi Mumbai",
    hq: "Vashi",
    status: "Lunch Break",
    attendance: "09:15 AM (Late by 15m)",
    currentLocation: "Sector 17, Vashi",
    todayVisitsPlanned: 8,
    todayVisitsDone: 4,
    ordersBooked: "₹ 24,000",
    distanceKm: "18.5 km",
    geofenceCompliance: "90%",
  },
];

const todayDoctorVisits = [
  {
    id: "VISIT-901",
    mr: "Rahul Verma",
    doctor: "Dr. A. Mehta (Cardiologist)",
    hospital: "KEM Hospital OPD 4",
    time: "10:30 AM - 10:48 AM",
    duration: "18 mins",
    products: "Cardiovex 20mg, Vasotens-AM",
    samples: "4 Units Cardiovex",
    geofenceStatus: "Verified (42m from clinic pin)",
    feedback: "Doctor showed keen interest in Cardiovex outcome study. Requested 10 more sample strips for diabetic cardiac cohort.",
    status: "Completed",
  },
  {
    id: "VISIT-902",
    mr: "Priya Shah",
    doctor: "Dr. Sanjay Deshmukh (Diabetologist)",
    hospital: "Saifee Hospital",
    time: "11:15 AM - 11:32 AM",
    duration: "17 mins",
    products: "Glycifit-M2 Forte",
    samples: "6 Units Glycifit",
    geofenceStatus: "Verified (18m from pin)",
    feedback: "High Rx support promised for upcoming month.",
    status: "Completed",
  },
  {
    id: "VISIT-903",
    mr: "Sneha Patil",
    doctor: "Dr. R. K. Joshi (Pulmonologist)",
    hospital: "Apollo Clinic Vashi",
    time: "02:30 PM (Scheduled)",
    duration: "-",
    products: "Allevia-D Respiratory",
    samples: "-",
    geofenceStatus: "Pending Check-in",
    feedback: "-",
    status: "Planned",
  },
];

const attendanceCorrections = [
  {
    id: "ATT-REQ-41",
    mr: "Sneha Patil",
    date: "Yesterday (27 Aug)",
    issue: "Device GPS Glitch during Punch-Out",
    requestedCheckout: "06:30 PM",
    reason: "Battery died after visiting 8th doctor at Kharghar",
  },
];

const supervisorExpenses = [
  {
    id: "EXP-MR-101",
    mr: "Rahul Verma",
    category: "Fuel Reimbursement",
    amount: "₹ 620",
    kmDriven: "142 km",
    date: "Today",
    receipt: "fuel_bill_101.jpg",
  },
  {
    id: "EXP-MR-103",
    mr: "Vikram Jadhav",
    category: "Chemist Conference Lunch",
    amount: "₹ 850",
    kmDriven: "-",
    date: "Yesterday",
    receipt: "food_bill_103.jpg",
  },
];

export default function SalesSupervisorPortal() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "mrs" | "gps-tracking" | "doctor-visits" | "joint-work" | "attendance" | "expenses" | "communication" | "reports"
  >("dashboard");
  const [selectedMR, setSelectedMR] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [corrections, setCorrections] = useState(attendanceCorrections);
  const [expenses, setExpenses] = useState(supervisorExpenses);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveCorrection = (id: string) => {
    setCorrections((prev) => prev.filter((c) => c.id !== id));
    showToast(`Attendance correction ${id} approved.`);
  };

  const handleApproveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast(`Expense ${id} verified & forwarded to Accounts.`);
  };

  return (
    <div className="flex h-screen bg-[#090d18] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1424] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 select-none">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-orange-500/20">
              SS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  ALLEVIARE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Supervisor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Field Force Command & GPS
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Field Operations
            </div>

            {[
              { id: "dashboard", label: "Operations Dashboard", icon: TrendingUp },
              { id: "gps-tracking", label: "Live GPS & Beat Tracker", icon: MapPin, badge: "4 Active", badgeColor: "bg-emerald-500" },
              { id: "mrs", label: "MR Team Management", icon: Users },
              { id: "doctor-visits", label: "Doctor Call Audit (DCR)", icon: Stethoscope },
              { id: "joint-work", label: "Joint Fieldwork Logs", icon: Compass },
              { id: "attendance", label: "Attendance & Leaves", icon: Clock, badge: corrections.length > 0 ? `${corrections.length}` : undefined, badgeColor: "bg-amber-500" },
              { id: "expenses", label: "Expense Verification", icon: Receipt, badge: expenses.length > 0 ? `${expenses.length}` : undefined, badgeColor: "bg-orange-500" },
              { id: "communication", label: "Team Announcements", icon: MessageSquare },
              { id: "reports", label: "Supervisor Reports", icon: FileSpreadsheet },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        nav.badgeColor
                          ? `${nav.badgeColor} text-white`
                          : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
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
        <div className="p-4 border-t border-slate-800/80 bg-[#080d1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-bold text-xs border border-orange-400/30 shadow-md">
              KS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Kiran Sharma</p>
              <p className="text-[11px] text-orange-400 font-medium">Field Sales Supervisor (Mumbai Zone)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0d1424]/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Field Telemetry
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Broadcasting push notification to your 4 MRs...")}
              className="btn-primary text-xs"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast Message
            </button>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: OPERATIONS DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Daily Counters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Field Team On Duty</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">4 / 4 MRs</span>
                    <span className="text-xs font-semibold text-emerald-400">100% Present</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">All punched in with GPS verification</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Today's Doctor Calls</span>
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-orange-400">24 / 35</span>
                    <span className="text-xs font-semibold text-slate-300">68.5% done</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">11 calls in progress / scheduled</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Secondary Orders Booked</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹ 1,55,700</span>
                    <span className="text-xs font-semibold text-emerald-400">+14.2%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Across 18 chemist retail orders</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Total Distance Covered</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Navigation className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">120.0 km</span>
                    <span className="text-xs font-semibold text-purple-400">Team Total</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Avg 30.0 km/MR beat journey</p>
                </div>
              </div>

              {/* Team Status Table */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Supervised MR Beat Progress (Today)</h3>
                  <button onClick={() => setActiveTab("gps-tracking")} className="text-xs text-orange-400 hover:underline">
                    Open Realtime GPS Map
                  </button>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Medical Rep</th>
                      <th className="py-3 px-4">Territory / HQ</th>
                      <th className="py-3 px-4">Current Status & Location</th>
                      <th className="py-3 px-4">Doctor Calls</th>
                      <th className="py-3 px-4">Orders Booked</th>
                      <th className="py-3 px-4">Geofence Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {mrTeamData.map((mr) => (
                      <tr key={mr.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{mr.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{mr.id} · {mr.phone}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{mr.territory}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> {mr.status}: {mr.currentLocation}
                          </div>
                          <p className="text-[10px] text-slate-500">{mr.attendance}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {mr.todayVisitsDone} / {mr.todayVisitsPlanned} Calls
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">{mr.ordersBooked}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {mr.geofenceCompliance} Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE GPS TRACKING & BEAT MAP */}
          {activeTab === "gps-tracking" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" /> Live MR Route & Geofence Verification
                  </h2>
                  <p className="text-xs text-slate-400">PostGIS live tracking stream with 150-meter doctor clinic geofencing</p>
                </div>
                <button onClick={() => showToast("Refreshed all MR GPS coordinates.")} className="btn-secondary text-xs">
                  <RefreshCw className="w-3.5 h-3.5 text-orange-400" /> Force Ping Location
                </button>
              </div>

              {/* Map Canvas Visualizer */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl min-h-[420px] flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mrTeamData.map((mr) => (
                    <div key={mr.id} className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                          {mr.id}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">● Online</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">{mr.name}</h4>
                      <p className="text-xs text-slate-300 mt-1">📍 {mr.currentLocation}</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-700/80 text-[11px] space-y-1">
                        <p className="text-slate-400">Travelled: <strong className="text-slate-200">{mr.distanceKm}</strong></p>
                        <p className="text-slate-400">Calls: <strong className="text-orange-400">{mr.todayVisitsDone} / {mr.todayVisitsPlanned}</strong></p>
                        <button onClick={() => showToast(`Opening live route breadcrumbs for ${mr.name}...`)} className="text-orange-400 hover:underline font-bold mt-1 block">
                          Trace Today's Route →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-6">
                  <span>🛰 PostGIS Spatial Engine: All check-ins strictly verified against registered Doctor Clinic Coordinates.</span>
                  <span className="text-emerald-400 font-semibold">0 Geofence Violations Today</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCTOR CALL AUDIT (DCR) */}
          {activeTab === "doctor-visits" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Daily Call Reports (DCR Submissions)</h3>
                <div className="space-y-4">
                  {todayDoctorVisits.map((visit) => (
                    <div key={visit.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-400 font-mono">{visit.id}</span>
                          <span className="text-xs font-bold text-white">{visit.doctor}</span>
                          <span className="text-[10px] text-slate-400">({visit.hospital})</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {visit.geofenceStatus}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <p><strong>MR:</strong> {visit.mr} · <strong>Duration:</strong> {visit.duration} ({visit.time})</p>
                        <p><strong>Products Presented:</strong> {visit.products} · <strong>Samples Provided:</strong> {visit.samples}</p>
                        <p className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                          <strong>Doctor Discussion & Feedback:</strong> {visit.feedback}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JOINT FIELDWORK LOGS */}
          {activeTab === "joint-work" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Supervisor Joint Visits & MR Coaching</h2>
                  <p className="text-xs text-slate-400">Record supervisory companion visits and MR clinical detailing coaching evaluations</p>
                </div>
                <button onClick={() => showToast("Opening Joint Visit Planner...")} className="btn-primary">
                  <Plus className="w-4 h-4" /> Schedule Joint Beat
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-white">Joint Fieldwork with Rahul Verma</h4>
                    <span className="text-xs text-emerald-400 font-bold">Completed (26 Aug)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Focus:</strong> Cardiology Key Opinion Leaders (KOLs) at Parel Hub.<br />
                    <strong>Supervisor Coaching Remarks:</strong> Good objection handling on Cardiovex pricing. Needs to sharpen clinical study citation on diabetic subgroup analysis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE & LEAVES */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">Attendance Regularization Requests</h3>
                {corrections.length === 0 ? (
                  <p className="text-xs text-slate-400">No pending attendance correction requests.</p>
                ) : (
                  <div className="space-y-3">
                    {corrections.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{item.mr} ({item.id})</p>
                          <p className="text-[11px] text-slate-400">{item.issue} · Req Time: {item.requestedCheckout}</p>
                          <p className="text-[11px] text-slate-300 mt-1">Reason: {item.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => showToast(`Correction ${item.id} rejected.`)} className="btn-secondary text-rose-400">
                            Reject
                          </button>
                          <button onClick={() => handleApproveCorrection(item.id)} className="btn-primary">
                            Approve Correction
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EXPENSE VERIFICATION */}
          {activeTab === "expenses" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-4">First-Line MR Field Expense Verification</h3>
                {expenses.length === 0 ? (
                  <p className="text-xs text-slate-400">All MR expenses verified and passed to Accounts.</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((exp) => (
                      <div key={exp.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{exp.mr} · {exp.category}</p>
                          <p className="text-sm font-black text-orange-400">{exp.amount} <small className="text-slate-400">({exp.kmDriven} driven)</small></p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => showToast("Opening Receipt...")} className="btn-secondary text-[11px]">
                            <Eye className="w-3.5 h-3.5" /> View Receipt
                          </button>
                          <button onClick={() => handleApproveExpense(exp.id)} className="btn-primary text-[11px]">
                            Verify & Pass to Accounts
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: COMMUNICATION */}
          {activeTab === "communication" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white">Broadcast Announcement to Mumbai Team</h3>
                <textarea
                  rows={4}
                  placeholder="Type important scheme announcement or doctor focus instruction for your MRs..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-orange-500"
                />
                <button onClick={() => showToast("Announcement pushed to MR Mobile App via FCM.")} className="btn-primary">
                  <Send className="w-4 h-4" /> Send Instant Notification
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: SUPERVISOR REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Daily Supervisor Beat Summary", desc: "Calls, Doctor coverage, POB orders, and Distance logs." },
                  { title: "Monthly Field Productivity Audit", desc: "MR call average, joint visit compliance, and target achieve." },
                  { title: "Doctor Detailing Effectiveness", desc: "Product conversion ratio and sample distribution ledger." },
                ].map((rep) => (
                  <div key={rep.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rep.title}</h4>
                      <p className="text-xs text-slate-400 mt-2">{rep.desc}</p>
                    </div>
                    <button onClick={() => showToast(`Exporting ${rep.title}...`)} className="mt-5 btn-secondary justify-center text-[11px]">
                      <Download className="w-3.5 h-3.5 text-orange-400" /> Export Excel
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900/95 border border-orange-500/40 text-orange-300 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
