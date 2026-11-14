import React, { useState, useMemo, useRef } from 'react';
import {
  Users, UserCheck, UserX, Clock, Search, RotateCcw, Plus,
  ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Building2,
  Shield, ShieldCheck, Check, X, Mail, Phone, Edit, Trash2,
  Lock, Unlock, Key, LogOut, Eye, Sliders, Sparkles, ExternalLink,
  AlertCircle, PauseCircle, CheckCircle2, ChevronUp, Copy, Send,
  Smartphone, Laptop, Globe, Calendar, RefreshCw, CheckCircle, MapPin,
  Camera, Upload, Image as ImageIcon
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

// ============================================================================
// PRESET EXECUTIVE AVATARS GALLERY
// ============================================================================
const PRESET_AVATARS = [
  { id: 'p-1', label: 'Executive Headshot (Selected)', url: '/avatars/admin-headshot.png' },
  { id: 'p-2', label: 'Corporate Modern Leader', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'p-3', label: 'Executive Operations Lead', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'p-4', label: 'Healthcare Strategy Director', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'p-5', label: 'Clinical Research Head', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'p-6', label: 'Commercial Operations VP', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
];

// ============================================================================
// BASE REFERENCE DATASET (Matches Screenshot 100% with exact metrics & users)
// Total: 42 admins (37 Active, 3 Suspended, 2 Never Logged In)
// ============================================================================
const INITIAL_DEMO_ADMINS = [
  {
    id: 'admin-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@supermed.com',
    company: 'SuperMed Pharma',
    branch: 'Platform HQ',
    role: 'SUPER_ADMIN',
    mobile: '+91 98765 43210',
    status: 'Active',
    lastActiveRel: '2 hours ago',
    lastActiveExact: '26 Sep 2026, 19:42',
    avatarUrl: '/avatars/admin-headshot.png',
    initials: 'RS',
    accountSecurity: {
      status: 'Active',
      lastLogin: '26 Sep 2026, 19:42 (2 hours ago)',
      loginAttempts: '2 failed (last 30 days)',
      passwordChanged: 'Last changed 12 Aug 2026',
      twoFactor: 'Enabled'
    },
    companyAssignment: {
      assignedCompany: 'SuperMed Pharma',
      branch: 'Platform HQ',
      role: 'Super Admin'
    },
    recentActivity: [
      { id: 'act-1', text: 'Logged in from Chrome (Windows)', date: '26 Sep 2026, 19:42' },
      { id: 'act-2', text: 'Viewed user analytics report', date: '26 Sep 2026, 17:30' },
      { id: 'act-3', text: 'Updated company settings', date: '25 Sep 2026, 14:12' },
      { id: 'act-4', text: 'Logged in from mobile app', date: '24 Sep 2026, 10:05' }
    ],
    permissions: [
      'Manage all companies',
      'Manage company admins',
      'Access platform analytics',
      'System configuration'
    ]
  },
  {
    id: 'admin-2',
    name: 'Priya Desai',
    email: 'priya.desai@healthcorp.com',
    company: 'HealthCorp Ltd.',
    branch: 'Platform HQ',
    role: 'ADMIN',
    mobile: '+91 87654 32109',
    status: 'Active',
    lastActiveRel: '5 hours ago',
    lastActiveExact: '26 Sep 2026, 16:12',
    avatarUrl: null,
    initials: 'PD',
    initialsColor: '#8b5cf6',
    accountSecurity: {
      status: 'Active',
      lastLogin: '26 Sep 2026, 16:12 (5 hours ago)',
      loginAttempts: '0 failed (last 30 days)',
      passwordChanged: 'Last changed 24 Jul 2026',
      twoFactor: 'Enabled'
    },
    companyAssignment: {
      assignedCompany: 'HealthCorp Ltd.',
      branch: 'Platform HQ',
      role: 'Company Administrator'
    },
    recentActivity: [
      { id: 'act-5', text: 'Dispatched promotional campaign to 120 doctors', date: '26 Sep 2026, 16:10' },
      { id: 'act-6', text: 'Logged in from macOS Safari', date: '26 Sep 2026, 15:45' },
      { id: 'act-7', text: 'Generated monthly MR telemetry report', date: '25 Sep 2026, 11:20' }
    ],
    permissions: [
      'Manage all companies',
      'Manage company admins',
      'Access platform analytics',
      'System configuration'
    ]
  },
  {
    id: 'admin-3',
    name: 'Amit Kumar',
    email: 'amit.kumar@medicare.in',
    company: 'MediCare Solutions',
    branch: 'Branch Office',
    role: 'ADMIN',
    mobile: '+91 99887 66554',
    status: 'Active',
    lastActiveRel: '1 day ago',
    lastActiveExact: '25 Sep 2026, 11:28',
    avatarUrl: null,
    initials: 'AK',
    initialsColor: '#f59e0b',
    accountSecurity: {
      status: 'Active',
      lastLogin: '25 Sep 2026, 11:28 (1 day ago)',
      loginAttempts: '1 failed (last 30 days)',
      passwordChanged: 'Last changed 05 Sep 2026',
      twoFactor: 'Enabled'
    },
    companyAssignment: {
      assignedCompany: 'MediCare Solutions',
      branch: 'Branch Office',
      role: 'Regional Admin'
    },
    recentActivity: [
      { id: 'act-8', text: 'Synchronized inventory with ERP warehouse', date: '25 Sep 2026, 11:25' },
      { id: 'act-9', text: 'Reassigned 4 sales territories in Delhi North', date: '24 Sep 2026, 16:40' }
    ],
    permissions: [
      'Manage company admins',
      'Access platform analytics',
      'System configuration'
    ]
  },
  {
    id: 'admin-4',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@pharmaco.com',
    company: 'PharmaCo Ltd.',
    branch: 'Platform HQ',
    role: 'ANALYST',
    mobile: '+91 93210 98765',
    status: 'Suspended',
    lastActiveRel: '3 days ago',
    lastActiveExact: '23 Sep 2026, 14:32',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'SI',
    accountSecurity: {
      status: 'Suspended',
      lastLogin: '23 Sep 2026, 14:32 (3 days ago)',
      loginAttempts: '4 failed (last 30 days)',
      passwordChanged: 'Last changed 04 Jun 2026',
      twoFactor: 'Disabled'
    },
    companyAssignment: {
      assignedCompany: 'PharmaCo Ltd.',
      branch: 'Platform HQ',
      role: 'Lead Business Analyst'
    },
    recentActivity: [
      { id: 'act-10', text: 'Account suspended by Super Admin due to anomaly', date: '23 Sep 2026, 15:00' },
      { id: 'act-11', text: 'Multiple failed 2FA verification attempts', date: '23 Sep 2026, 14:30' }
    ],
    permissions: [
      'Access platform analytics'
    ]
  },
  {
    id: 'admin-5',
    name: 'Rohit Kapoor',
    email: 'rohit.kapoor@globalmed.com',
    company: 'GlobalMed Healthcare',
    branch: 'Branch Office',
    role: 'ADMIN',
    mobile: '+91 91234 56789',
    status: 'Active',
    lastActiveRel: '4 days ago',
    lastActiveExact: '22 Sep 2026, 09:17',
    avatarUrl: null,
    initials: 'RK',
    initialsColor: '#0d9488',
    accountSecurity: {
      status: 'Active',
      lastLogin: '22 Sep 2026, 09:17 (4 days ago)',
      loginAttempts: '0 failed (last 30 days)',
      passwordChanged: 'Last changed 19 Jul 2026',
      twoFactor: 'Enabled'
    },
    companyAssignment: {
      assignedCompany: 'GlobalMed Healthcare',
      branch: 'Branch Office',
      role: 'Commercial Lead'
    },
    recentActivity: [
      { id: 'act-12', text: 'Approved monthly expense vouchers for 18 MRs', date: '22 Sep 2026, 09:15' },
      { id: 'act-13', text: 'Logged in from Android mobile client', date: '22 Sep 2026, 09:00' }
    ],
    permissions: [
      'Manage company admins',
      'Access platform analytics'
    ]
  },
  {
    id: 'admin-6',
    name: 'Neha Singh',
    email: 'neha.singh@lifecare.com',
    company: 'LifeCare Pharma',
    branch: 'Platform HQ',
    role: 'VIEWER',
    mobile: '+91 99876 54321',
    status: 'Never Logged In',
    lastActiveRel: '—',
    lastActiveExact: 'No activity',
    avatarUrl: null,
    initials: 'NS',
    initialsColor: '#6366f1',
    accountSecurity: {
      status: 'Never Logged In',
      lastLogin: 'Never logged in',
      loginAttempts: '0 failed',
      passwordChanged: 'Invited on 20 Sep 2026',
      twoFactor: 'Pending setup'
    },
    companyAssignment: {
      assignedCompany: 'LifeCare Pharma',
      branch: 'Platform HQ',
      role: 'Executive Viewer / Auditor'
    },
    recentActivity: [
      { id: 'act-14', text: 'Welcome invitation dispatched to neha.singh@lifecare.com', date: '20 Sep 2026, 14:00' }
    ],
    permissions: [
      'Access platform analytics'
    ]
  },
  {
    id: 'admin-7',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@zenithhealth.com',
    company: 'Zenith Health',
    branch: 'Branch Office',
    role: 'ADMIN',
    mobile: '+91 90123 45678',
    status: 'Active',
    lastActiveRel: '6 days ago',
    lastActiveExact: '20 Sep 2026, 18:05',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'AM',
    accountSecurity: {
      status: 'Active',
      lastLogin: '20 Sep 2026, 18:05 (6 days ago)',
      loginAttempts: '0 failed (last 30 days)',
      passwordChanged: 'Last changed 01 Aug 2026',
      twoFactor: 'Enabled'
    },
    companyAssignment: {
      assignedCompany: 'Zenith Health',
      branch: 'Branch Office',
      role: 'Operations Manager'
    },
    recentActivity: [
      { id: 'act-15', text: 'Configured automated daily doctor call reports', date: '20 Sep 2026, 17:50' }
    ],
    permissions: [
      'Manage company admins',
      'Access platform analytics',
      'System configuration'
    ]
  }
];

// Helper to generate remaining 35 demo admins (32 Active, 2 Suspended, 1 Never Logged In)
const GENERATE_EXPANDED_ADMINS = () => {
  const extraList = [];
  const companiesList = [
    { name: 'Astra Biotech', branch: 'Platform HQ' },
    { name: 'Nova Therapeutics', branch: 'Branch Office' },
    { name: 'Apex Pharma Corp', branch: 'Platform HQ' },
    { name: 'CureLine India', branch: 'Branch Office' },
    { name: 'BioGenix Labs', branch: 'Platform HQ' },
    { name: 'MaxHealth Solutions', branch: 'Branch Office' },
    { name: 'Synapse Lifesciences', branch: 'Platform HQ' }
  ];

  const firstNames = ['Karan', 'Sunita', 'Vikram', 'Ananya', 'Rohan', 'Meera', 'Aditya', 'Pooja', 'Deepak', 'Sonia', 'Tarun', 'Divya', 'Manish', 'Kavita', 'Siddharth'];
  const lastNames = ['Verma', 'Gupta', 'Rao', 'Nair', 'Patel', 'Reddy', 'Chopra', 'Malhotra', 'Joshi', 'Bose', 'Mishra', 'Saxena'];
  const roles = ['ADMIN', 'ADMIN', 'SUPER_ADMIN', 'ANALYST', 'VIEWER'];

  let suspendedAssigned = 0;
  let neverLoggedInAssigned = 0;

  for (let i = 8; i <= 42; i++) {
    const fn = firstNames[(i * 3) % firstNames.length];
    const ln = lastNames[(i * 5) % lastNames.length];
    const comp = companiesList[i % companiesList.length];
    const role = roles[i % roles.length];
    const initials = `${fn[0]}${ln[0]}`;
    const colors = ['#3b82f6', '#10b981', '#6366f1', '#ec4899', '#f97316', '#14b8a6', '#8b5cf6'];
    const initialsColor = colors[i % colors.length];

    let status = 'Active';
    let lastActiveRel = `${(i % 14) + 1} days ago`;
    let lastActiveExact = `1${(i % 8) + 1} Sep 2026, 14:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60}`;

    if (suspendedAssigned < 2 && (i === 15 || i === 28)) {
      status = 'Suspended';
      suspendedAssigned++;
    } else if (neverLoggedInAssigned < 1 && i === 22) {
      status = 'Never Logged In';
      lastActiveRel = '—';
      lastActiveExact = 'No activity';
      neverLoggedInAssigned++;
    }

    extraList.push({
      id: `admin-${i}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${comp.name.toLowerCase().replace(/\s+/g, '')}.com`,
      company: comp.name,
      branch: comp.branch,
      role: role,
      mobile: `+91 ${98000 + i * 42} ${10000 + i * 37}`.substring(0, 15),
      status: status,
      lastActiveRel: lastActiveRel,
      lastActiveExact: lastActiveExact,
      avatarUrl: null,
      initials: initials,
      initialsColor: initialsColor,
      accountSecurity: {
        status: status,
        lastLogin: status === 'Never Logged In' ? 'Never logged in' : `${lastActiveExact} (${lastActiveRel})`,
        loginAttempts: status === 'Suspended' ? '3 failed (last 30 days)' : '0 failed',
        passwordChanged: 'Last changed 14 Aug 2026',
        twoFactor: status === 'Never Logged In' ? 'Pending setup' : 'Enabled'
      },
      companyAssignment: {
        assignedCompany: comp.name,
        branch: comp.branch,
        role: role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Company Administrator' : role
      },
      recentActivity: [
        { id: `act-${i}-1`, text: 'System session authorization verified', date: lastActiveExact }
      ],
      permissions: [
        'Manage company admins',
        'Access platform analytics'
      ]
    });
  }

  return [...INITIAL_DEMO_ADMINS, ...extraList];
};

export default function PlatformUsersTab() {
  const ctx = useDashboard();
  const {
    companies = [],
    admins = [],
    platformUsers = [],
    setPlatformUsers,
    showToast = () => {},
    setIsCreateUserOpen,
    handleOpenEditUser,
    handleOpenDeleteUser,
    handleOpenResetUserPassword,
    handleToggleUserLock,
    handleOpenUserPermissions,
    userSubTab = 'admins',
    setUserSubTab = () => {},
    handleOpenEditCompany = () => {},
    setAdminManagerTenant = () => {},
    handleOpenResetAdminPassword = () => {}
  } = ctx || {};

  // --------------------------------------------------------------------------
  // LOCAL STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [adminList, setAdminList] = useState(() => GENERATE_EXPANDED_ADMINS());
  const [selectedAdminId, setSelectedAdminId] = useState('admin-1');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [activeDetailsTab, setActiveDetailsTab] = useState('Overview'); // 'Overview' | 'Permissions' | 'Activity' | 'Security'

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All Companies');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All Roles');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Status');
  const [selectedLastActiveFilter, setSelectedLastActiveFilter] = useState('Any Time');

  // Pagination State (7 items per page as shown in screenshot)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Actions Dropdown state for rows
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Modal State for Direct Provisioning
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    company: 'SuperMed Pharma',
    branch: 'Platform HQ',
    role: 'ADMIN',
    mobile: '',
    avatarUrl: '/avatars/admin-headshot.png',
    temporaryPassword: 'Admin@2026!'
  });

  // Modal State for Edit Admin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Modal State for Edit Profile Photo / Avatar
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTargetAdmin, setPhotoTargetAdmin] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // --------------------------------------------------------------------------
  // KPI CALCULATIONS (Matches Screenshot 42, 37, 3, 2 dynamically)
  // --------------------------------------------------------------------------
  const totalAdminsCount = adminList.length;
  const activeAdminsCount = adminList.filter(a => a.status === 'Active').length;
  const suspendedAdminsCount = adminList.filter(a => a.status === 'Suspended').length;
  const neverLoggedInCount = adminList.filter(a => a.status === 'Never Logged In').length;

  const activePercent = totalAdminsCount > 0 ? ((activeAdminsCount / totalAdminsCount) * 100).toFixed(1) : '0.0';
  const suspendedPercent = totalAdminsCount > 0 ? ((suspendedAdminsCount / totalAdminsCount) * 100).toFixed(1) : '0.0';
  const neverLoggedInPercent = totalAdminsCount > 0 ? ((neverLoggedInCount / totalAdminsCount) * 100).toFixed(1) : '0.0';

  // --------------------------------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
  const filteredAdmins = useMemo(() => {
    return adminList.filter(admin => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (admin.name && admin.name.toLowerCase().includes(q)) ||
        (admin.email && admin.email.toLowerCase().includes(q)) ||
        (admin.mobile && admin.mobile.toLowerCase().includes(q)) ||
        (admin.company && admin.company.toLowerCase().includes(q));

      const matchesCompany = selectedCompanyFilter === 'All Companies' ||
        (admin.company && admin.company.toLowerCase() === selectedCompanyFilter.toLowerCase());

      const matchesRole = selectedRoleFilter === 'All Roles' ||
        admin.role === selectedRoleFilter;

      const matchesStatus = selectedStatusFilter === 'All Status' ||
        admin.status === selectedStatusFilter;

      let matchesLastActive = true;
      if (selectedLastActiveFilter === 'Today') {
        matchesLastActive = admin.lastActiveRel.includes('hour') || admin.lastActiveRel.includes('minute');
      } else if (selectedLastActiveFilter === 'Last 7 Days') {
        matchesLastActive = admin.lastActiveRel.includes('hour') || admin.lastActiveRel.includes('day') || admin.lastActiveRel.includes('minute');
      } else if (selectedLastActiveFilter === 'Never') {
        matchesLastActive = admin.status === 'Never Logged In' || admin.lastActiveRel === '—';
      }

      return matchesSearch && matchesCompany && matchesRole && matchesStatus && matchesLastActive;
    });
  }, [adminList, searchQuery, selectedCompanyFilter, selectedRoleFilter, selectedStatusFilter, selectedLastActiveFilter]);

  // Paginated records
  const totalPages = Math.ceil(filteredAdmins.length / pageSize) || 1;
  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAdmins.slice(start, start + pageSize);
  }, [filteredAdmins, currentPage, pageSize]);

  // Selected Admin Object for Drawer
  const selectedAdmin = useMemo(() => {
    return adminList.find(a => a.id === selectedAdminId) || adminList[0] || null;
  }, [adminList, selectedAdminId]);

  // Available unique companies for filter dropdown
  const uniqueCompanies = useMemo(() => {
    const set = new Set();
    adminList.forEach(a => { if (a.company) set.add(a.company); });
    companies.forEach(c => { if (c.name) set.add(c.name); });
    return Array.from(set).sort();
  }, [adminList, companies]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCompanyFilter('All Companies');
    setSelectedRoleFilter('All Roles');
    setSelectedStatusFilter('All Status');
    setSelectedLastActiveFilter('Any Time');
    setCurrentPage(1);
    showToast('Filters reset to default view', 'info');
  };

  // Toggle Suspend / Activate Handler
  const handleToggleAdminStatus = (admin) => {
    const nextStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    setAdminList(prev => prev.map(a => a.id === admin.id ? {
      ...a,
      status: nextStatus,
      accountSecurity: {
        ...a.accountSecurity,
        status: nextStatus
      }
    } : a));

    showToast(`Account for ${admin.name} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
    setActiveActionMenuId(null);
  };

  // Handle Edit Admin
  const handleStartEdit = (admin) => {
    setEditingAdmin({ ...admin });
    setIsEditModalOpen(true);
    setActiveActionMenuId(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setAdminList(prev => prev.map(a => a.id === editingAdmin.id ? { ...editingAdmin } : a));
    setIsEditModalOpen(false);
    showToast(`Updated administrator profile for ${editingAdmin.name}`, 'success');
  };

  // Open Edit Photo Modal
  const handleOpenPhotoModal = (admin) => {
    const target = admin || selectedAdmin;
    setPhotoTargetAdmin(target);
    setPreviewPhotoUrl(target?.avatarUrl || '');
    setPhotoUrlInput(target?.avatarUrl || '');
    setIsPhotoModalOpen(true);
    setActiveActionMenuId(null);
  };

  // File Upload Handler (FileReader client-side)
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be under 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPhotoUrl(event.target.result);
        showToast('Image loaded. Click "Save Photo" to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Photo Changes
  const handleSavePhoto = () => {
    if (!photoTargetAdmin) return;
    setAdminList(prev => prev.map(a => a.id === photoTargetAdmin.id ? {
      ...a,
      avatarUrl: previewPhotoUrl || null
    } : a));
    setIsPhotoModalOpen(false);
    showToast(`Profile photo updated for ${photoTargetAdmin.name}`, 'success');
  };

  // Remove Photo (Revert to Initials)
  const handleRemovePhoto = () => {
    setPreviewPhotoUrl('');
    setPhotoUrlInput('');
    showToast('Photo removed. Initials will be used.', 'info');
  };

  // Handle Create Admin
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email) {
      showToast('Please provide both administrator name and email', 'error');
      return;
    }

    const newAdminObj = {
      id: `admin-${Date.now()}`,
      name: newAdminForm.name,
      email: newAdminForm.email.toLowerCase(),
      company: newAdminForm.company,
      branch: newAdminForm.branch,
      role: newAdminForm.role,
      mobile: newAdminForm.mobile || '+91 98765 00000',
      status: 'Active',
      lastActiveRel: 'Just now',
      lastActiveExact: '26 Sep 2026, 22:45',
      avatarUrl: newAdminForm.avatarUrl || null,
      initials: newAdminForm.name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'AD',
      initialsColor: '#2563eb',
      accountSecurity: {
        status: 'Active',
        lastLogin: 'Never logged in (New Account)',
        loginAttempts: '0 failed',
        passwordChanged: 'Created today',
        twoFactor: 'Enabled'
      },
      companyAssignment: {
        assignedCompany: newAdminForm.company,
        branch: newAdminForm.branch,
        role: newAdminForm.role
      },
      recentActivity: [
        { id: `act-${Date.now()}`, text: 'Administrator provisioned by Super Admin', date: 'Just now' }
      ],
      permissions: [
        'Manage company admins',
        'Access platform analytics',
        'System configuration'
      ]
    };

    setAdminList(prev => [newAdminObj, ...prev]);
    setSelectedAdminId(newAdminObj.id);
    setIsDetailsOpen(true);
    setIsAddAdminModalOpen(false);
    showToast(`Successfully provisioned administrator ${newAdminObj.name}`, 'success');

    // Reset Form
    setNewAdminForm({
      name: '',
      email: '',
      company: 'SuperMed Pharma',
      branch: 'Platform HQ',
      role: 'ADMIN',
      mobile: '',
      avatarUrl: '/avatars/admin-headshot.png',
      temporaryPassword: 'Admin@2026!'
    });
  };

  // Handle Delete Admin
  const handleDeleteAdmin = (admin) => {
    if (admin.role === 'SUPER_ADMIN') {
      showToast('Master SUPER_ADMIN accounts cannot be deleted directly.', 'warning');
      return;
    }
    setAdminList(prev => prev.filter(a => a.id !== admin.id));
    if (selectedAdminId === admin.id) {
      setSelectedAdminId(adminList[0]?.id || null);
    }
    setActiveActionMenuId(null);
    showToast(`Removed administrator ${admin.name}`, 'info');
  };

  // Role Badge Styling Helper
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          padding: '3px 9px',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: '700',
          letterSpacing: '0.02em',
          display: 'inline-block'
        };
      case 'ADMIN':
        return {
          background: '#f0f9ff',
          color: '#0284c7',
          border: '1px solid #bae6fd',
          padding: '3px 9px',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: '700',
          letterSpacing: '0.02em',
          display: 'inline-block'
        };
      case 'ANALYST':
        return {
          background: '#faf5ff',
          color: '#7e22ce',
          border: '1px solid #e9d5ff',
          padding: '3px 9px',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: '700',
          letterSpacing: '0.02em',
          display: 'inline-block'
        };
      case 'VIEWER':
      default:
        return {
          background: '#f8fafc',
          color: '#475569',
          border: '1px solid #e2e8f0',
          padding: '3px 9px',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: '700',
          letterSpacing: '0.02em',
          display: 'inline-block'
        };
    }
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ecfdf5',
          color: '#059669',
          border: '1px solid #a7f3d0',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Active
        </span>
      );
    }
    if (status === 'Suspended') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fde68a',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
          Suspended
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#f8fafc',
        color: '#64748b',
        border: '1px solid #e2e8f0',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '700'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }} />
        Never Logged In
      </span>
    );
  };

  return (
    <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Sub-Navigation Pill Header (Switches Between Admins View & Company Totals) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div className="sub-nav-tabs" style={{ margin: 0 }}>
          <button
            type="button"
            className={`sub-nav-pill ${userSubTab === 'admins' ? 'active' : ''}`}
            onClick={() => setUserSubTab('admins')}
            style={{ fontWeight: '700', fontSize: '0.84rem' }}
          >
            🏢 Company Administrators ({totalAdminsCount})
          </button>
          <button
            type="button"
            className={`sub-nav-pill ${userSubTab === 'company-totals' ? 'active' : ''}`}
            onClick={() => setUserSubTab('company-totals')}
            style={{ fontWeight: '700', fontSize: '0.84rem' }}
          >
            👥 Total Users of Each Company ({companies.length})
          </button>
        </div>

        {/* Breadcrumb matching exact screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <span>Platform</span>
          <span style={{ color: '#cbd5e1' }}>&rsaquo;</span>
          <span>Platform Users &amp; Directories</span>
          <span style={{ color: '#cbd5e1' }}>&rsaquo;</span>
          <span style={{ fontWeight: '700', color: '#0f172a' }}>
            {userSubTab === 'admins' ? 'Company Administrators' : 'Total Company Users'}
          </span>
        </div>
      </div>

      {userSubTab === 'admins' ? (
        <>
          {/* ── Top Header Section (Title + Subtitle + "+ Add Company Admin" Button) ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
              }}>
                <Users size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  Company Administrators
                </h1>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0', maxWidth: '720px' }}>
                  Manage and oversee company administrators across all platforms. Ensure secure access, proper permissions and smooth operations for every company.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddAdminModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a'; }}
            >
              <Plus size={16} /> Add Company Admin
            </button>
          </div>

          {/* ── 4 Top KPI Metric Cards (Total Admins, Active, Suspended, Never Logged In) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            {/* Card 1: Total Admins */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Total Admins</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1' }}>
                    {totalAdminsCount}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#16a34a',
                    background: '#dcfce7',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    &uarr; 12%
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>vs. last 30 days</div>
              </div>
            </div>

            {/* Card 2: Active */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                flexShrink: 0
              }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Active</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginTop: '2px' }}>
                  {activeAdminsCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <strong style={{ color: '#16a34a', fontWeight: '700' }}>{activePercent}%</strong> of total admins
                </div>
              </div>
            </div>

            {/* Card 3: Suspended */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Suspended</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginTop: '2px' }}>
                  {suspendedAdminsCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <strong style={{ color: '#ef4444', fontWeight: '700' }}>{suspendedPercent}%</strong> of total admins
                </div>
              </div>
            </div>

            {/* Card 4: Never Logged In */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                flexShrink: 0
              }}>
                <UserX size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Never Logged In</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginTop: '2px' }}>
                  {neverLoggedInCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <strong style={{ color: '#475569', fontWeight: '700' }}>{neverLoggedInPercent}%</strong> of total admins
                </div>
              </div>
            </div>
          </div>

          {/* ── Filter / Search Bar ── */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* Search Input Field */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by name, email, mobile or company..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
            </div>

            {/* Dropdown: Company */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Company</label>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => { setSelectedCompanyFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="All Companies">All Companies</option>
                {uniqueCompanies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Dropdown: Role */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Role</label>
              <select
                value={selectedRoleFilter}
                onChange={(e) => { setSelectedRoleFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="All Roles">All Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            {/* Dropdown: Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Never Logged In">Never Logged In</option>
              </select>
            </div>

            {/* Dropdown: Last Active */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Last Active</label>
              <select
                value={selectedLastActiveFilter}
                onChange={(e) => { setSelectedLastActiveFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="Any Time">Any Time</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Never">Never</option>
              </select>
            </div>

            {/* Reset Button */}
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                title="Reset all search and filter conditions"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* ── Split Layout: Left Table + Right Details Drawer ── */}
          <div style={{
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-start',
            position: 'relative'
          }}>
            {/* ── Left Table Card ── */}
            <div style={{
              flex: '1 1 0%',
              minWidth: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Administrator</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Company</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Role</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Mobile</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b' }}>Last Active</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', color: '#64748b', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                          <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 10px', display: 'block' }} />
                          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>No Administrators Found</div>
                          <p style={{ fontSize: '0.8rem', margin: '4px 0 12px' }}>Try clearing your active filters or add a new company administrator.</p>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedAdmins.map((admin) => {
                        const isSelected = selectedAdminId === admin.id;

                        return (
                          <tr
                            key={admin.id}
                            onClick={() => {
                              setSelectedAdminId(admin.id);
                              setIsDetailsOpen(true);
                            }}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              background: isSelected ? '#f8faff' : '#ffffff',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = '#fcfdfe';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = '#ffffff';
                            }}
                          >
                            {/* Column 1: Administrator Profile */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                                  {admin.avatarUrl ? (
                                    <img
                                      src={admin.avatarUrl}
                                      alt={admin.name}
                                      style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #e2e8f0'
                                      }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      background: admin.initialsColor || '#6366f1',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: '800',
                                      fontSize: '0.85rem'
                                    }}>
                                      {admin.initials || admin.name.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.86rem' }}>
                                    {admin.name}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>
                                    {admin.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Column 2: Company */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  background: '#f1f5f9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#64748b'
                                }}>
                                  <Building2 size={15} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.82rem' }}>
                                    {admin.company}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                    ({admin.branch || 'Platform HQ'})
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Column 3: Role Badge */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                              <span style={getRoleBadgeStyle(admin.role)}>
                                {admin.role}
                              </span>
                            </td>

                            {/* Column 4: Mobile */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle', color: '#334155', fontWeight: '500', fontSize: '0.82rem' }}>
                              {admin.mobile || '—'}
                            </td>

                            {/* Column 5: Status Badge */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                              {getStatusBadge(admin.status)}
                            </td>

                            {/* Column 6: Last Active */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                              <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.82rem' }}>
                                {admin.lastActiveRel}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                {admin.lastActiveExact}
                              </div>
                            </td>

                            {/* Column 7: Actions Menu */}
                            <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right', position: 'relative' }}>
                              <div style={{ position: 'relative', display: 'inline-block' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setActiveActionMenuId(activeActionMenuId === admin.id ? null : admin.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Actions"
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {activeActionMenuId === admin.id && (
                                  <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    marginTop: '4px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    zIndex: 50,
                                    minWidth: '185px',
                                    padding: '6px 0'
                                  }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedAdminId(admin.id);
                                        setIsDetailsOpen(true);
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '7px 14px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '0.8rem',
                                        color: '#334155',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <Eye size={13} /> View Details
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenPhotoModal(admin)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '7px 14px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '0.8rem',
                                        color: '#0284c7',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                      }}
                                    >
                                      <Camera size={13} /> Edit Profile Image
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(admin)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '7px 14px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '0.8rem',
                                        color: '#334155',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <Edit size={13} /> Edit Profile Info
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminStatus(admin)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '7px 14px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '0.8rem',
                                        color: admin.status === 'Active' ? '#d97706' : '#16a34a',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {admin.status === 'Active' ? <PauseCircle size={13} /> : <CheckCircle2 size={13} />}
                                      {admin.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                    </button>

                                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        showToast(`Password reset link emailed to ${admin.email}`, 'info');
                                        setActiveActionMenuId(null);
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '7px 14px',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontSize: '0.8rem',
                                        color: '#334155',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <Key size={13} /> Reset Password
                                    </button>

                                    {admin.role !== 'SUPER_ADMIN' && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAdmin(admin)}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          width: '100%',
                                          padding: '7px 14px',
                                          background: 'none',
                                          border: 'none',
                                          textAlign: 'left',
                                          fontSize: '0.8rem',
                                          color: '#dc2626',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 size={13} /> Delete Admin
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Table Footer / Pagination ── */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderTop: '1px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '0.82rem',
                color: '#64748b'
              }}>
                <div>
                  Showing {filteredAdmins.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredAdmins.length)} of {filteredAdmins.length} administrators
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: currentPage === 1 ? '#cbd5e1' : '#334155',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {[1, 2, 3, 4, 5].slice(0, totalPages).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: currentPage === p ? 'none' : '1px solid #e2e8f0',
                        background: currentPage === p ? '#0f172a' : '#ffffff',
                        color: currentPage === p ? '#ffffff' : '#334155',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  {totalPages > 5 && (
                    <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
                  )}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
                      cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right Details Flyout / Side Panel ── */}
            {isDetailsOpen && selectedAdmin && (
              <div style={{
                width: '380px',
                flexShrink: 0,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Panel Header */}
                <div style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                    Administrator Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                    title="Close Details Panel"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Profile Summary Card with Interactive Avatar & Edit Option */}
                <div style={{ padding: '20px 18px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                  {/* Avatar Container with Camera Badge Overlay */}
                  <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 10px' }}>
                    <div
                      onClick={() => handleOpenPhotoModal(selectedAdmin)}
                      style={{
                        position: 'relative',
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                        background: '#f8fafc'
                      }}
                      title="Click to change profile picture"
                    >
                      {selectedAdmin.avatarUrl ? (
                        <img
                          src={selectedAdmin.avatarUrl}
                          alt={selectedAdmin.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: selectedAdmin.initialsColor || '#6366f1',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '1.4rem'
                        }}>
                          {selectedAdmin.initials || selectedAdmin.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Floating Camera Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPhotoModal(selectedAdmin);
                      }}
                      title="Edit Profile Image"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: '2px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {selectedAdmin.name}
                    </h2>
                    <span style={getRoleBadgeStyle(selectedAdmin.role)}>
                      {selectedAdmin.role}
                    </span>
                  </div>

                  {/* Explicit "Edit Image" Action Button */}
                  <div style={{ marginTop: '5px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenPhotoModal(selectedAdmin)}
                      style={{
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '14px',
                        padding: '3px 10px',
                        color: '#0284c7',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Camera size={12} /> Edit Profile Image
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.78rem', marginTop: '6px' }}>
                    <Mail size={13} color="#94a3b8" />
                    <span>{selectedAdmin.email}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                    <Phone size={13} color="#94a3b8" />
                    <span>{selectedAdmin.mobile}</span>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  padding: '0 8px'
                }}>
                  {['Overview', 'Permissions', 'Activity', 'Security'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveDetailsTab(tab)}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.78rem',
                        fontWeight: activeDetailsTab === tab ? '700' : '600',
                        color: activeDetailsTab === tab ? '#0284c7' : '#64748b',
                        borderBottom: activeDetailsTab === tab ? '2px solid #0284c7' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Body Content */}
                <div style={{ padding: '16px 18px', overflowY: 'auto', maxHeight: 'calc(100vh - 440px)', minHeight: '380px' }}>
                  {activeDetailsTab === 'Overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Section: Account Security */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <ShieldCheck size={16} color="#0f172a" />
                          <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Account Security</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Status</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: selectedAdmin.status === 'Active' ? '#059669' : '#d97706', fontWeight: '700' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedAdmin.status === 'Active' ? '#10b981' : '#f59e0b' }} />
                              {selectedAdmin.status}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ color: '#64748b' }}>Last Login</span>
                            <span style={{ color: '#1e293b', fontWeight: '600', textAlign: 'right' }}>
                              {selectedAdmin.accountSecurity?.lastLogin || selectedAdmin.lastActiveExact}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Login Attempts</span>
                            <span style={{ color: '#1e293b', fontWeight: '600' }}>
                              {selectedAdmin.accountSecurity?.loginAttempts || '0 failed'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Password</span>
                            <span style={{ color: '#1e293b', fontWeight: '600' }}>
                              {selectedAdmin.accountSecurity?.passwordChanged || 'Last changed 12 Aug 2026'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>2FA</span>
                            <span style={{ color: '#059669', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={13} color="#10b981" />
                              {selectedAdmin.accountSecurity?.twoFactor || 'Enabled'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section: Company Assignment */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <Building2 size={16} color="#0f172a" />
                          <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Company Assignment</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Assigned Company</span>
                            <span style={{ color: '#1e293b', fontWeight: '700' }}>
                              {selectedAdmin.companyAssignment?.assignedCompany || selectedAdmin.company}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Branch</span>
                            <span style={{ color: '#1e293b', fontWeight: '600' }}>
                              {selectedAdmin.companyAssignment?.branch || selectedAdmin.branch || 'Platform HQ'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b' }}>Role</span>
                            <span style={{
                              color: '#2563eb',
                              background: '#eff6ff',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: '700'
                            }}>
                              {selectedAdmin.companyAssignment?.role || 'Super Admin'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section: Recent Activity */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="#0f172a" />
                            <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Recent Activity</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveDetailsTab('Activity')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0284c7',
                              fontSize: '0.74rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            View All
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                          {(selectedAdmin.recentActivity || []).map((act) => (
                            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
                                <span>{act.text}</span>
                              </div>
                              <span style={{ color: '#94a3b8', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                                {act.date}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section: Permissions */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <Shield size={16} color="#0f172a" />
                          <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>Permissions</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                          {(selectedAdmin.permissions || [
                            'Manage all companies',
                            'Manage company admins',
                            'Access platform analytics',
                            'System configuration'
                          ]).map((perm, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                              <Check size={14} color="#10b981" />
                              <span>{perm}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailsTab === 'Permissions' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Configured access entitlements for <strong>{selectedAdmin.name}</strong>:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { title: 'Manage all companies', desc: 'Create, modify, and manage enterprise tenants' },
                          { title: 'Manage company admins', desc: 'Provision and revoke admin privileges' },
                          { title: 'Access platform analytics', desc: 'Real-time telemetry and export metrics' },
                          { title: 'System configuration', desc: 'Global platform settings & API policies' },
                          { title: 'Billing & Invoice Controls', desc: 'Override subscription quotas and view revenue' },
                          { title: 'Impersonation Access', desc: 'Direct root login into tenant accounts' }
                        ].map((p, idx) => (
                          <div key={idx} style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{p.title}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.desc}</div>
                            </div>
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
                              <CheckCircle2 size={16} />
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Permissions updated and synced to security cache', 'success')}
                        style={{
                          marginTop: '6px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#0f172a',
                          color: '#fff',
                          border: 'none',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Update Permissions Matrix
                      </button>
                    </div>
                  )}

                  {activeDetailsTab === 'Activity' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Audit trail and telemetry events for <strong>{selectedAdmin.email}</strong>:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selectedAdmin.recentActivity || []).concat([
                          { id: 'act-ext-1', text: 'API token generated for external integration', date: '22 Sep 2026, 11:15' },
                          { id: 'act-ext-2', text: 'Exported doctor master database to CSV', date: '21 Sep 2026, 09:30' },
                          { id: 'act-ext-3', text: 'Password reset completed via 2FA', date: '12 Aug 2026, 14:00' }
                        ]).map((act) => (
                          <div key={act.id} style={{
                            padding: '10px 12px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f172a' }}>{act.text}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{act.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeDetailsTab === 'Security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.78rem',
                        color: '#166534'
                      }}>
                        <strong>Two-Factor Authentication:</strong> Active and enforced across all enrolled devices.
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => showToast(`Dispatched temporary password reset token to ${selectedAdmin.email}`, 'info')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Key size={14} /> Send Password Reset Email
                        </button>

                        <button
                          type="button"
                          onClick={() => showToast(`Revoked all active browser & mobile sessions for ${selectedAdmin.name}`, 'warning')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            color: '#e11d48',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <LogOut size={14} /> Force Terminate Active Sessions
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons (Sticky in Drawer) */}
                <div style={{
                  padding: '14px 18px',
                  borderTop: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleToggleAdminStatus(selectedAdmin)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #f59e0b',
                      color: '#d97706',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <PauseCircle size={15} />
                    {selectedAdmin.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(selectedAdmin)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: '#0f172a',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Edit size={14} /> Edit Administrator
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Company Total Users View (Preserved and Refined) ── */
        <div>
          {/* Executive Telemetry KPI Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            marginBottom: '18px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(2, 132, 199, 0.02))',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
              }}>
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Total Companies</div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{companies.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: '600' }}>Active Sovereign Tenants</div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(14, 165, 233, 0.02))',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Total Admins</div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0369a1', lineHeight: '1.2' }}>
                  {companies.reduce((sum, c) => sum + (Number(c.adminCount) || Number(c.admin_count) || 1), 0)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0ea5e9', fontWeight: '600' }}>Executive Company Admins</div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Total Platform Users</div>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#4338ca', lineHeight: '1.2' }}>
                  {companies.reduce((sum, c) => sum + (Number(c.usersCount) || Number(c.user_count) || 0), 0)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: '600' }}>Active Users Across Tenants</div>
              </div>
            </div>
          </div>

          <div className="saas-table-container">
            {companies.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <Building2 size={38} color="#94a3b8" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>No Companies Enrolled</div>
                <p style={{ fontSize: '0.8rem', margin: '4px auto 14px' }}>Provision a company to start monitoring total user counts.</p>
              </div>
            ) : (
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Company &amp; Tenant Identity</th>
                    <th>Sovereign Region</th>
                    <th>Subscription Plan</th>
                    <th>Total Admins</th>
                    <th>Total Users &amp; Seat Capacity</th>
                    <th>Company Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => {
                    const totalAdmins = Number(c.adminCount) || Number(c.admin_count) || 1;
                    const totalUsers = Number(c.usersCount) || Number(c.user_count) || 1;
                    const seatLimit = Number(c.userLimit) || 250;
                    const seatPercent = Math.min(100, Math.round((totalUsers / seatLimit) * 100));

                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="comp-name-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: c.brandPrimaryColor || '#0284c7',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '0.85rem'
                            }}>
                              {(c.name || 'C').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', color: '#0f172a' }}>{c.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.code || 'CODE'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e293b' }}>{c.country || 'Global'}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.currency || 'USD'}</div>
                        </td>
                        <td>
                          <span className={`plan-pill plan-${c.plan?.toLowerCase() || 'starter'}`}>{c.plan || 'STARTER'}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '800',
                            color: '#0369a1',
                            background: '#e0f2fe',
                            border: '1px solid #7dd3fc',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.82rem'
                          }}>
                            <ShieldCheck size={15} color="#0284c7" /> {totalAdmins} Admin{totalAdmins !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td>
                          <div style={{ minWidth: '150px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontWeight: '800', color: '#4338ca', fontSize: '0.85rem' }}>
                                {totalUsers} Users
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>
                                {totalUsers} / {seatLimit} Seats
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${seatPercent}%`,
                                height: '100%',
                                background: seatPercent > 90 ? '#ef4444' : '#6366f1',
                                borderRadius: '3px'
                              }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-tag status-${c.status?.toLowerCase() || 'active'}`}>
                            {c.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="actions-cluster">
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => handleOpenEditCompany(c)}
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              className="action-pill-btn"
                              onClick={() => setAdminManagerTenant({ id: c.id, name: c.name })}
                              style={{ color: '#7c3aed', borderColor: 'rgba(139,92,246,0.4)' }}
                            >
                              Manage Admins
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PROFILE PHOTO / AVATAR ── */}
      {isPhotoModalOpen && photoTargetAdmin && (
        <div className="modal-overlay" style={{ zIndex: 1300 }}>
          <div className="modal-content" style={{ maxWidth: '480px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: '#0f172a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Camera size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
                    Edit Profile Photo
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                    Update avatar for {photoTargetAdmin.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsPhotoModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Live Preview Avatar */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '92px',
                  height: '92px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #0284c7',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                }}>
                  {previewPhotoUrl ? (
                    <img
                      src={previewPhotoUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: photoTargetAdmin.initialsColor || '#6366f1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.8rem'
                    }}>
                      {photoTargetAdmin.initials || photoTargetAdmin.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  {previewPhotoUrl ? 'Current Photo Preview' : 'No photo uploaded — Using colored initials'}
                </div>
              </div>

              {/* Upload Option: From Device */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Upload Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoFileUpload}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <Upload size={22} color="#0284c7" style={{ margin: '0 auto 6px', display: 'block' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b' }}>
                    Click to browse or drop an image here
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    Supports PNG, JPG, WEBP, GIF (Max 5MB)
                  </div>
                </div>
              </div>

              {/* Option: Preset Headshots */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Or Choose from Executive Presets
                </label>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = previewPhotoUrl === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          setPreviewPhotoUrl(preset.url);
                          setPhotoUrlInput(preset.url);
                        }}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          cursor: 'pointer',
                          position: 'relative',
                          border: isSelected ? '3px solid #0284c7' : '2px solid #e2e8f0',
                          boxShadow: isSelected ? '0 0 0 2px rgba(2, 132, 199, 0.3)' : 'none',
                          overflow: 'hidden'
                        }}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(2, 132, 199, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}>
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Option: Paste Image Web URL */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Or Paste Public Image URL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="https://images.example.com/avatar.jpg"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (photoUrlInput.trim()) {
                        setPreviewPhotoUrl(photoUrlInput.trim());
                        showToast('Applied URL to preview', 'info');
                      }
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#334155',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Remove Photo Option */}
              {previewPhotoUrl && (
                <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Trash2 size={13} /> Remove Photo and Use Initials
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD COMPANY ADMIN ── */}
      {isAddAdminModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#0f172a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Add Company Administrator</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Provision an administrator account across platforms.</p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsAddAdminModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Assigned Company
                    </label>
                    <select
                      value={newAdminForm.company}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, company: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      {uniqueCompanies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Branch
                    </label>
                    <input
                      type="text"
                      placeholder="Platform HQ"
                      value={newAdminForm.branch}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, branch: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Administrative Role
                    </label>
                    <select
                      value={newAdminForm.role}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newAdminForm.mobile}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, mobile: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={newAdminForm.temporaryPassword}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, temporaryPassword: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Provision Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT ADMINISTRATOR PROFILE ── */}
      {isEditModalOpen && editingAdmin && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#0284c7', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Edit size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Edit Administrator Profile</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Modify credentials, photo, company assignment and authorization.</p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0' }}>

                {/* Profile Photo Quick Edit Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #cbd5e1',
                    flexShrink: 0
                  }}>
                    {editingAdmin.avatarUrl ? (
                      <img src={editingAdmin.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: editingAdmin.initialsColor || '#6366f1',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800'
                      }}>
                        {editingAdmin.initials || editingAdmin.name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b' }}>Profile Photo</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Upload or choose a portrait photo</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      handleOpenPhotoModal(editingAdmin);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #0284c7',
                      background: '#f0f9ff',
                      color: '#0284c7',
                      fontWeight: '700',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Camera size={13} /> Change Photo
                  </button>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAdmin.name}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingAdmin.email}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Assigned Company
                    </label>
                    <select
                      value={editingAdmin.company}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, company: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      {uniqueCompanies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Branch
                    </label>
                    <input
                      type="text"
                      value={editingAdmin.branch || 'Platform HQ'}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, branch: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Role
                    </label>
                    <select
                      value={editingAdmin.role}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={editingAdmin.mobile}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, mobile: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Account Status
                  </label>
                  <select
                    value={editingAdmin.status}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Never Logged In">Never Logged In</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
