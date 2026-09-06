import React, { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Clock,
    Calendar,
    Stethoscope,
    Package,
    Store,
    Receipt,
    Bell,
    FileSpreadsheet,
    Plus,
    Search,
    Download,
    CheckCircle2,
    XCircle,
    Eye,
    Check,
    X,
    Filter,
    Shield,
    Building2,
    DollarSign,
    Sparkles,
    Send,
    Edit2,
    Trash2,
    ChevronRight,
    MapPin,
    AlertCircle
} from 'lucide-react'

// Official Alleviare Brand Logo Component
function AlleviareLogo({ className = "h-10" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg viewBox="0 0 120 70" className="h-10 w-auto flex-shrink-0" fill="none">
                <path
                    d="M 15 55 C 25 15, 65 15, 75 55 C 65 30, 35 30, 25 55 Z"
                    fill="url(#alleviareGradient)"
                />
                <circle cx="20" cy="52" r="4.5" fill="#EF4444" />
                <circle cx="28" cy="45" r="4.0" fill="#EF4444" />
                <circle cx="36" cy="38" r="3.5" fill="#EF4444" />
                <circle cx="44" cy="32" r="3.0" fill="#EF4444" />
                <circle cx="52" cy="27" r="2.5" fill="#EF4444" />
                <circle cx="68" cy="24" r="3.2" fill="#EF4444" />
                <circle cx="76" cy="20" r="2.5" fill="#EF4444" />
                <defs>
                    <linearGradient id="alleviareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9AD0C2" />
                        <stop offset="60%" stopColor="#2D9596" />
                        <stop offset="100%" stopColor="#265073" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-tight leading-none text-[#265073]">
                    Alleviare
                </span>
                <span className="text-[10px] font-semibold text-[#EF4444] tracking-wider mt-0.5 lowercase">
                    way towards new life
                </span>
            </div>
        </div>
    )
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const [activeTab, setActiveTab] = useState<
        'dashboard' | 'employees' | 'mrs' | 'attendance' | 'leaves' | 'doctors' | 'products' | 'customers' | 'expenses' | 'notifications' | 'reports'
    >('dashboard')
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Entity State
    const [employees, setEmployees] = useState([
        { id: 'EMP-01', name: 'Dr. Siddharth Nambiar', role: 'Director', dept: 'Executive', territory: 'National', status: 'Active', email: 'siddharth@alleviare.com' },
        { id: 'EMP-02', name: 'Vikas Saxena', role: 'Sales Manager', dept: 'Sales', territory: 'West Zone', status: 'Active', email: 'vikas@alleviare.com' },
        { id: 'EMP-03', name: 'Kiran Sharma', role: 'Sales Supervisor', dept: 'Field Force', territory: 'Mumbai Central', status: 'Active', email: 'kiran@alleviare.com' },
        { id: 'EMP-04', name: 'Ramesh Kulkarni', role: 'Accounts Head', dept: 'Finance', territory: 'HQ Operations', status: 'Active', email: 'ramesh@alleviare.com' },
    ])

    const [mrs, setMrs] = useState([
        { id: 'MR-101', name: 'Rahul Verma', supervisor: 'Kiran Sharma', territory: 'Mumbai Central', callsTarget: 180, callsDone: 172, salesTarget: '₹ 12.0L', salesDone: '₹ 14.8L', status: 'Active' },
        { id: 'MR-102', name: 'Priya Shah', supervisor: 'Kiran Sharma', territory: 'Mumbai South', callsTarget: 160, callsDone: 154, salesTarget: '₹ 10.0L', salesDone: '₹ 11.2L', status: 'Active' },
        { id: 'MR-103', name: 'Vikram Jadhav', supervisor: 'Suresh Pillai', territory: 'Thane West', callsTarget: 170, callsDone: 168, salesTarget: '₹ 11.5L', salesDone: '₹ 12.2L', status: 'Active' },
        { id: 'MR-104', name: 'Sneha Patil', supervisor: 'Kiran Sharma', territory: 'Navi Mumbai', callsTarget: 150, callsDone: 130, salesTarget: '₹ 9.0L', salesDone: '₹ 7.8L', status: 'Active' },
    ])

    const [doctors, setDoctors] = useState([
        { id: 'DOC-801', name: 'Dr. A. Mehta', specialization: 'Cardiology', hospital: 'KEM Hospital, Parel', category: 'A+', assignedMR: 'Rahul Verma', visitsThisMonth: 4, verified: true },
        { id: 'DOC-802', name: 'Dr. Sanjay Deshmukh', specialization: 'Diabetology', hospital: 'Saifee Hospital', category: 'A', assignedMR: 'Priya Shah', visitsThisMonth: 3, verified: true },
        { id: 'DOC-803', name: 'Dr. R. K. Joshi', specialization: 'Pulmonology', hospital: 'Apollo Clinic Vashi', category: 'B', assignedMR: 'Sneha Patil', visitsThisMonth: 2, verified: false },
    ])

    const [products, setProducts] = useState([
        { sku: 'ALV-CARD-20', name: 'Cardiovex 20mg', category: 'Cardiology', composition: 'Atorvastatin 20mg + Aspirin 75mg', packSize: '10x10 Tablets', mrp: '₹ 240.00', status: 'Available' },
        { sku: 'ALV-GLYC-M2', name: 'Glycifit-M2 Forte', category: 'Diabetology', composition: 'Metformin 1000mg + Glimepiride 2mg', packSize: '15 Tablets', mrp: '₹ 185.00', status: 'Available' },
        { sku: 'ALV-RESP-D', name: 'Allevia-D Respiratory', category: 'Pulmonology', composition: 'Deflazacort 6mg', packSize: '10 Tablets', mrp: '₹ 145.00', status: 'Available' },
    ])

    const [customers, setCustomers] = useState([
        { id: 'CUST-301', name: 'Apollo Pharmacy Hub', type: 'Retail Chain Pharmacy', territory: 'Mumbai Central', contact: '+91 98200 11223', status: 'Active' },
        { id: 'CUST-302', name: 'MedPlus Drugs', type: 'Retail Pharmacy', territory: 'Pune South', contact: '+91 98200 44556', status: 'Active' },
        { id: 'CUST-303', name: 'Mahalaxmi Pharma Distributors', type: 'Primary Distributor', territory: 'Mumbai West', contact: '+91 98200 77889', status: 'Active' },
    ])

    const [leaves, setLeaves] = useState([
        { id: 'LV-108', employee: 'Sneha Patil (MR)', type: 'Sick Leave', dates: '29 Aug - 30 Aug 2026', days: 2, reason: 'Viral fever', status: 'Pending' },
        { id: 'LV-109', employee: 'Vikram Jadhav (MR)', type: 'Earned Leave', dates: '05 Sep - 08 Sep 2026', days: 4, reason: 'Family function', status: 'Approved' },
    ])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3500)
    }

    const handleVerifyDoctor = (id: string) => {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, verified: true } : d))
        showToast(`Doctor ${id} verified and added to active call list.`)
    }

    return (
        <div className="flex h-screen bg-[#ECF4D6]/30 text-slate-800 overflow-hidden font-sans">
            {/* Sidebar with Brand Navy/Teal Background */}
            <aside className="w-64 bg-[#265073] text-white flex flex-col justify-between flex-shrink-0 select-none shadow-xl">
                <div>
                    {/* Brand */}
                    <div className="p-5 border-b border-[#2D9596]/40 bg-[#1f4260]">
                        <div className="flex items-center gap-3">
                            <svg viewBox="0 0 120 70" className="h-8 w-auto flex-shrink-0" fill="none">
                                <path
                                    d="M 15 55 C 25 15, 65 15, 75 55 C 65 30, 35 30, 25 55 Z"
                                    fill="#9AD0C2"
                                />
                                <circle cx="20" cy="52" r="4.5" fill="#EF4444" />
                                <circle cx="28" cy="45" r="4.0" fill="#EF4444" />
                                <circle cx="36" cy="38" r="3.5" fill="#EF4444" />
                                <circle cx="44" cy="32" r="3.0" fill="#EF4444" />
                                <circle cx="52" cy="27" r="2.5" fill="#EF4444" />
                                <circle cx="68" cy="24" r="3.2" fill="#EF4444" />
                                <circle cx="76" cy="20" r="2.5" fill="#EF4444" />
                            </svg>
                            <div>
                                <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                                    Alleviare
                                </span>
                                <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-wider block">
                                    way towards new life
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                        {[
                            { id: 'dashboard', label: 'Company Overview', icon: LayoutDashboard },
                            { id: 'employees', label: 'Employee Directory', icon: Users },
                            { id: 'mrs', label: 'MR Field Force', icon: UserCheck },
                            { id: 'attendance', label: 'GPS Attendance', icon: Clock },
                            { id: 'leaves', label: 'Leave Management', icon: Calendar },
                            { id: 'doctors', label: 'Doctor Master', icon: Stethoscope },
                            { id: 'products', label: 'Product Catalog', icon: Package },
                            { id: 'customers', label: 'Customer Master', icon: Store },
                            { id: 'expenses', label: 'Expense Verification', icon: Receipt },
                            { id: 'notifications', label: 'Broadcast & Alerts', icon: Bell },
                            { id: 'reports', label: 'Company Reports', icon: FileSpreadsheet },
                        ].map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-[#2D9596] text-white shadow-md shadow-[#2D9596]/30'
                                            : 'text-[#ECF4D6] hover:bg-[#2D9596]/20 hover:text-white'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#ECF4D6]' : 'text-[#9AD0C2]'}`} />
                                    <span>{item.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Profile Card */}
                <div className="p-4 border-t border-[#2D9596]/30 bg-[#1c3c57]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2D9596] text-white font-bold text-xs flex items-center justify-center">
                            AA
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">Alleviare Admin Portal</p>
                            <p className="text-[10px] text-[#9AD0C2] font-medium">Enterprise Single-Tenant</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-[#9AD0C2]/50 px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-[#265073] capitalize">
                            {activeTab.replace('-', ' ')}
                        </h1>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#ECF4D6] text-[#265073] font-bold border border-[#9AD0C2]">
                            ● Microservice Connected
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => showToast('Exporting current table to Excel...')}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2D9596] hover:bg-[#265073] text-white text-xs font-bold shadow-md shadow-[#2D9596]/20 transition-all"
                        >
                            <Download className="w-3.5 h-3.5 text-white" />
                            <span>Export Data</span>
                        </button>
                    </div>
                </header>

                {/* Main Body */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* TAB 1: DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="p-5 rounded-2xl bg-white border border-[#9AD0C2]/40 shadow-sm">
                                    <span className="text-xs font-medium text-slate-500">Total Employees</span>
                                    <p className="text-2xl font-bold text-[#265073] mt-2">142</p>
                                    <p className="text-[11px] text-[#2D9596] font-semibold mt-1">128 Field Force · 14 Management</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white border border-[#9AD0C2]/40 shadow-sm">
                                    <span className="text-xs font-medium text-slate-500">Active Doctors Master</span>
                                    <p className="text-2xl font-bold text-[#265073] mt-2">3,420</p>
                                    <p className="text-[11px] text-slate-500 mt-1">98.2% Verified Clinics</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white border border-[#9AD0C2]/40 shadow-sm">
                                    <span className="text-xs font-medium text-slate-500">Today's GPS Attendance</span>
                                    <p className="text-2xl font-bold text-[#2D9596] mt-2">124 / 128</p>
                                    <p className="text-[11px] text-slate-500 mt-1">4 On Approved Leave</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white border border-[#9AD0C2]/40 shadow-sm">
                                    <span className="text-xs font-medium text-slate-500">Secondary Sales This Month</span>
                                    <p className="text-2xl font-bold text-[#265073] mt-2">₹ 48.6L</p>
                                    <p className="text-[11px] text-[#2D9596] font-semibold mt-1">Target: ₹ 45.0L (108%)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: EMPLOYEE MANAGEMENT */}
                    {activeTab === 'employees' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-[#265073]">Organization Employee Roster</h3>
                                <button onClick={() => showToast('Opening Add Employee Modal...')} className="px-3.5 py-2 rounded-xl bg-[#2D9596] hover:bg-[#265073] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                                    <Plus className="w-4 h-4" /> Add Employee
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#9AD0C2]/40 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#ECF4D6]/50 text-[#265073] uppercase text-[10px] border-b border-[#9AD0C2]/40">
                                        <tr>
                                            <th className="py-3 px-4">Employee ID & Name</th>
                                            <th className="py-3 px-4">Role / Designation</th>
                                            <th className="py-3 px-4">Department</th>
                                            <th className="py-3 px-4">Territory HQ</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {employees.map(emp => (
                                            <tr key={emp.id} className="hover:bg-[#ECF4D6]/20">
                                                <td className="py-3 px-4 font-bold text-[#265073]">
                                                    {emp.name}
                                                    <p className="text-[10px] text-slate-400 font-normal">{emp.id} · {emp.email}</p>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 font-medium">{emp.role}</td>
                                                <td className="py-3 px-4 text-slate-600">{emp.dept}</td>
                                                <td className="py-3 px-4 text-slate-600">{emp.territory}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded-full bg-[#ECF4D6] text-[#2D9596] font-bold text-[10px] border border-[#9AD0C2]">
                                                        {emp.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: DOCTOR MANAGEMENT */}
                    {activeTab === 'doctors' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-[#265073]">Doctors Master Repository</h3>
                                <button onClick={() => showToast('Opening Doctor Registration form...')} className="px-3.5 py-2 rounded-xl bg-[#2D9596] hover:bg-[#265073] text-white text-xs font-semibold flex items-center gap-1.5">
                                    <Plus className="w-4 h-4" /> Register Doctor
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#9AD0C2]/40 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#ECF4D6]/50 text-[#265073] uppercase text-[10px] border-b border-[#9AD0C2]/40">
                                        <tr>
                                            <th className="py-3 px-4">Doctor Name</th>
                                            <th className="py-3 px-4">Specialization</th>
                                            <th className="py-3 px-4">Hospital / Clinic</th>
                                            <th className="py-3 px-4">Category</th>
                                            <th className="py-3 px-4">Assigned MR</th>
                                            <th className="py-3 px-4">Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {doctors.map(doc => (
                                            <tr key={doc.id} className="hover:bg-[#ECF4D6]/20">
                                                <td className="py-3 px-4 font-bold text-[#265073]">{doc.name}</td>
                                                <td className="py-3 px-4 text-slate-600">{doc.specialization}</td>
                                                <td className="py-3 px-4 text-slate-600">{doc.hospital}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-[#9AD0C2]/40 text-[#265073] font-bold text-[10px]">
                                                        {doc.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{doc.assignedMR}</td>
                                                <td className="py-3 px-4">
                                                    {doc.verified ? (
                                                        <span className="text-[#2D9596] font-bold text-[11px] flex items-center gap-1">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                                        </span>
                                                    ) : (
                                                        <button onClick={() => handleVerifyDoctor(doc.id)} className="px-2 py-1 rounded bg-[#ECF4D6] text-[#265073] font-bold text-[10px] border border-[#9AD0C2]">
                                                            Verify Now
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#265073] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce border border-[#2D9596]">
                    <CheckCircle2 className="w-4 h-4 text-[#9AD0C2]" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
