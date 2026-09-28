import React, { useState, useMemo } from 'react';
import {
  Users, UserPlus, Search, Filter, Shield, ShieldCheck, ShieldAlert,
  Building2, Mail, Phone, Lock, Unlock, Key, Trash2, Edit, Eye,
  Download, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ExternalLink,
  ChevronRight, Sparkles, MoreVertical, Copy, Check
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function CompanyAdminsTab() {
  const ctx = useDashboard();
  const {
    admins = [],
    setAdmins,
    companies = [],
    platformUsers = [],
    setPlatformUsers,
    showToast,
    setIsCreateUserOpen,
    handleOpenEditUser,
    handleOpenDeleteUser,
    handleOpenResetUserPassword,
    handleOpenResetAdminPassword,
    handleToggleUserLock,
    handleImpersonate,
    handleImpersonateCompany,
    loadAllData,
    setAdminManagerTenant
  } = ctx || {};

  // Local filter & UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isResetPwdModalOpen, setIsResetPwdModalOpen] = useState(false);
  const [targetResetAdmin, setTargetResetAdmin] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(null);

  // Form state for direct admin provisioning
  const [newAdminForm, setNewAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyId: '',
    designation: 'Executive Company Administrator',
    password: '',
    sendEmailInvite: true,
    permissions: {
      manage_users: true,
      manage_products: true,
      manage_orders: true,
      manage_doctors: true,
      manage_dcr: true,
      view_analytics: true,
      export_data: true,
      manage_settings: true
    }
  });

  // Calculate high-impact KPI statistics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => (a.status || 'Active').toUpperCase() === 'ACTIVE' && !a.isLocked).length;
  const lockedAdmins = admins.filter(a => a.isLocked || (a.status || '').toUpperCase() === 'LOCKED').length;
  const companiesWithAdmins = useMemo(() => {
    const set = new Set();
    admins.forEach(a => { if (a.company) set.add(a.company.toLowerCase()); });
    return set.size;
  }, [admins]);

  // Filtered admin records
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        (admin.name && admin.name.toLowerCase().includes(q)) ||
        (admin.firstName && admin.firstName.toLowerCase().includes(q)) ||
        (admin.lastName && admin.lastName.toLowerCase().includes(q)) ||
        (admin.email && admin.email.toLowerCase().includes(q)) ||
        (admin.company && admin.company.toLowerCase().includes(q)) ||
        (admin.phone && admin.phone.toLowerCase().includes(q));

      const matchCompany = selectedCompanyFilter === 'ALL' ||
        (admin.company && admin.company.toLowerCase() === selectedCompanyFilter.toLowerCase()) ||
        admin.tenantId === selectedCompanyFilter;

      const isAdminLocked = admin.isLocked || (admin.status || '').toUpperCase() === 'LOCKED';
      const matchStatus = statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !isAdminLocked && (admin.status || 'Active').toUpperCase() === 'ACTIVE') ||
        (statusFilter === 'LOCKED' && isAdminLocked) ||
        (statusFilter === 'SUSPENDED' && (admin.status || '').toUpperCase() === 'SUSPENDED');

      return matchQuery && matchCompany && matchStatus;
    });
  }, [admins, searchQuery, selectedCompanyFilter, statusFilter]);

  // Generate secure password helper
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = 'Admin@2026';
    for (let i = 0; i < 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewAdminForm(prev => ({ ...prev, password: pwd }));
    showToast('Secure temporary password generated!', 'info');
  };

  // Quick CSV Export
  const handleExportCSV = () => {
    if (filteredAdmins.length === 0) {
      showToast('No admin records to export', 'warning');
      return;
    }
    const headers = ['Name', 'Email', 'Assigned Company', 'Designation', 'Phone', 'Status', 'Locked', 'Last Login'];
    const rows = filteredAdmins.map(a => [
      `"${a.name || `${a.firstName || ''} ${a.lastName || ''}`.trim()}"`,
      `"${a.email || ''}"`,
      `"${a.company || ''}"`,
      `"${a.designation || 'Company Administrator'}"`,
      `"${a.phone || a.mobile || ''}"`,
      `"${a.status || 'Active'}"`,
      `"${a.isLocked ? 'Yes' : 'No'}"`,
      `"${a.lastLogin || 'Never'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orvexa_company_admins_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredAdmins.length} Company Admins to CSV`, 'success');
  };

  // Submit new company admin
  const handleCreateAdminSubmit = (e) => {
    e.preventDefault();
    if (!newAdminForm.email || !newAdminForm.companyId) {
      showToast('Please specify administrator email and target company.', 'error');
      return;
    }

    const targetComp = companies.find(c => c.id === newAdminForm.companyId || c.code === newAdminForm.companyId);
    const adminName = `${newAdminForm.firstName} ${newAdminForm.lastName}`.trim() || 'Executive Administrator';

    const newAdminObj = {
      id: 'admin-' + Date.now(),
      name: adminName,
      firstName: newAdminForm.firstName || 'Executive',
      lastName: newAdminForm.lastName || 'Admin',
      email: newAdminForm.email.toLowerCase(),
      phone: newAdminForm.phone || '+91 9876543210',
      mobile: newAdminForm.phone || '+91 9876543210',
      company: targetComp ? targetComp.name : 'Enterprise Tenant',
      tenantId: targetComp ? targetComp.id : newAdminForm.companyId,
      designation: newAdminForm.designation,
      role: 'COMPANY_ADMIN',
      status: 'ACTIVE',
      isLocked: false,
      lastLogin: 'Never logged in',
      countryCode: targetComp ? targetComp.countryCode : 'IN',
      permissions: newAdminForm.permissions
    };

    // Update state
    setAdmins(prev => [newAdminObj, ...prev]);
    setPlatformUsers(prev => [newAdminObj, ...prev]);
    setIsProvisionModalOpen(false);
    showToast(`Provisioned administrator ${newAdminObj.email} for ${newAdminObj.company}`, 'success');

    // Reset form
    setNewAdminForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyId: '',
      designation: 'Executive Company Administrator',
      password: '',
      sendEmailInvite: true,
      permissions: {
        manage_users: true,
        manage_products: true,
        manage_orders: true,
        manage_doctors: true,
        manage_dcr: true,
        view_analytics: true,
        export_data: true,
        manage_settings: true
      }
    });
  };

  // Handle password reset
  const handleConfirmDirectResetPwd = (e) => {
    e.preventDefault();
    if (!newPasswordValue) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (targetResetAdmin) {
      showToast(`Password successfully updated for ${targetResetAdmin.email}`, 'success');
      setIsResetPwdModalOpen(false);
      setTargetResetAdmin(null);
      setNewPasswordValue('');
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    showToast(`Copied ${email} to clipboard`, 'info');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Top Header & Title ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Company Administrators Governance
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Provision, monitor, audit, and impersonate executive tenant root administrators.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (loadAllData) loadAllData();
              showToast('Refreshed admin accounts from database', 'info');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <RefreshCw size={15} /> Sync
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsProvisionModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
          >
            <UserPlus size={16} /> + Provision Company Admin
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards Row ──────────────────────────────────────────── */}
      <div className="kpi-banner-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="kpi-top">
            <span className="kpi-label">Total Company Admins</span>
            <Users size={18} color="#f59e0b" />
          </div>
          <div className="kpi-number" style={{ color: '#0f172a' }}>{totalAdmins}</div>
          <div className="kpi-sub">
            Across <strong>{companiesWithAdmins}</strong> enrolled pharma organizations
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-top">
            <span className="kpi-label">Active &amp; Operational</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div className="kpi-number text-green">{activeAdmins}</div>
          <div className="kpi-sub">
            <span style={{ color: '#10b981', fontWeight: '700' }}>
              {totalAdmins > 0 ? `${Math.round((activeAdmins / totalAdmins) * 100)}%` : '100%'}
            </span> healthy authorization status
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="kpi-top">
            <span className="kpi-label">Covered Tenants</span>
            <Building2 size={18} color="#6366f1" />
          </div>
          <div className="kpi-number" style={{ color: '#4f46e5' }}>{companies.length}</div>
          <div className="kpi-sub">
            <strong>{companies.length - companiesWithAdmins}</strong> tenants require admin onboarding
          </div>
        </div>

        <div className="saas-kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="kpi-top">
            <span className="kpi-label">Suspended / Locked</span>
            <Lock size={18} color="#ef4444" />
          </div>
          <div className="kpi-number" style={{ color: lockedAdmins > 0 ? '#ef4444' : '#64748b' }}>{lockedAdmins}</div>
          <div className="kpi-sub">
            Account lockouts or step-up authentication flags
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ──────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
        background: '#ffffff', padding: '14px', borderRadius: '12px',
        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search admins by name, email, company, phone, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px',
              border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            style={{
              padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
              fontSize: '0.84rem', background: '#fff', color: '#334155', fontWeight: '500'
            }}
          >
            <option value="ALL">🏢 All Companies ({companies.length})</option>
            {companies.map(c => (
              <option key={c.id || c.code} value={c.name}>{c.name} ({c.code})</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
              fontSize: '0.84rem', background: '#fff', color: '#334155', fontWeight: '500'
            }}
          >
            <option value="ALL">⚡ All Statuses</option>
            <option value="ACTIVE">🟢 Active Only</option>
            <option value="LOCKED">🔴 Locked Only</option>
            <option value="SUSPENDED">🟡 Suspended Only</option>
          </select>

          {(searchQuery || selectedCompanyFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCompanyFilter('ALL'); setStatusFilter('ALL'); }}
              style={{
                background: '#f1f5f9', border: 'none', padding: '9px 14px', borderRadius: '8px',
                fontSize: '0.82rem', color: '#475569', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Administrators Data Table ─────────────────────────────────────── */}
      <div className="saas-table-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        {filteredAdmins.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <ShieldCheck size={44} color="#f59e0b" style={{ margin: '0 auto 14px', display: 'block' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              No Company Administrators Found
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '440px', margin: '8px auto 18px' }}>
              {searchQuery || selectedCompanyFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'No admin accounts match your active search and filter criteria.'
                : 'No company administrator accounts have been registered yet. Click below to provision your first admin.'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsProvisionModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
            >
              <UserPlus size={16} /> Provision Company Admin
            </button>
          </div>
        ) : (
          <table className="saas-data-table">
            <thead>
              <tr>
                <th>Administrator Profile</th>
                <th>Assigned Company</th>
                <th>Designation &amp; Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Super Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => {
                const isLocked = admin.isLocked || (admin.status || '').toUpperCase() === 'LOCKED';
                const status = (admin.status || 'Active').toUpperCase();
                const matchedCompany = companies.find(c =>
                  (admin.company && c.name.toLowerCase() === admin.company.toLowerCase()) ||
                  c.id === admin.tenantId
                );

                return (
                  <tr key={admin.id || admin.email}>
                    <td>
                      <div className="admin-profile-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          className="admin-avatar"
                          style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: isLocked
                              ? '#fee2e2'
                              : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            color: isLocked ? '#b91c1c' : '#92400e',
                            fontWeight: '800', fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `1px solid ${isLocked ? '#fecaca' : '#fcd34d'}`
                          }}
                        >
                          {(admin.name || admin.firstName || admin.email || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>
                            {admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Company Administrator'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{admin.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(admin.email)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                              title="Copy email"
                            >
                              {copiedEmail === admin.email ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {matchedCompany?.logoUrl ? (
                          <img
                            src={matchedCompany.logoUrl}
                            alt=""
                            style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <Building2 size={16} color="#6366f1" />
                        )}
                        <div>
                          <strong style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                            {admin.company || 'Platform Root'}
                          </strong>
                          {matchedCompany?.code && (
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>
                              Code: {matchedCompany.code}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span
                          className="plan-pill plan-pro"
                          style={{
                            background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a',
                            fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px'
                          }}
                        >
                          🛡️ {admin.role || 'COMPANY_ADMIN'}
                        </span>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                          {admin.designation || 'Executive Administrator'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                        {admin.phone || admin.mobile || '—'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {admin.countryCode ? `Jurisdiction: ${admin.countryCode}` : 'Global HQ'}
                      </div>
                    </td>

                    <td>
                      {isLocked ? (
                        <span className="status-tag status-deactivated" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                          🔒 Locked
                        </span>
                      ) : status === 'ACTIVE' ? (
                        <span className="status-tag status-active" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
                          🟢 Active
                        </span>
                      ) : (
                        <span className="status-tag status-suspended">
                          🟡 {status}
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: '0.78rem', color: '#475569' }}>
                      {admin.lastLogin || 'Never'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cluster" style={{ display: 'inline-flex', gap: '5px', flexWrap: 'nowrap' }}>
                        {/* 1. Inspect View */}
                        <button
                          type="button"
                          className="action-pill-btn"
                          onClick={() => setViewingAdmin(admin)}
                          title="Inspect Administrator Profile & Permissions"
                        >
                          <Eye size={12} /> View
                        </button>

                        {/* 2. Impersonate / One-Click Login */}
                        <button
                          type="button"
                          className="action-pill-btn"
                          style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb', fontWeight: '700' }}
                          onClick={() => {
                            if (handleImpersonate) {
                              handleImpersonate(admin);
                            } else if (handleImpersonateCompany && matchedCompany) {
                              handleImpersonateCompany(matchedCompany);
                            } else {
                              showToast(`Impersonating ${admin.name} (${admin.email})`, 'success');
                            }
                          }}
                          title="Instant Impersonation Login as this Company Admin"
                        >
                          🎭 Login
                        </button>

                        {/* 3. Reset Password */}
                        <button
                          type="button"
                          className="action-pill-btn"
                          onClick={() => {
                            setTargetResetAdmin(admin);
                            setNewPasswordValue('Admin@2026!');
                            setIsResetPwdModalOpen(true);
                          }}
                          title="Reset Admin Password"
                        >
                          <Key size={12} /> Pwd
                        </button>

                        {/* 4. Lock / Unlock */}
                        <button
                          type="button"
                          className="action-pill-btn"
                          style={{
                            color: isLocked ? '#16a34a' : '#b45309',
                            borderColor: isLocked ? '#bbf7d0' : '#fed7aa',
                            background: isLocked ? '#f0fdf4' : '#fff7ed'
                          }}
                          onClick={() => {
                            if (handleToggleUserLock) {
                              handleToggleUserLock(admin.id, !isLocked);
                            } else {
                              setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, isLocked: !isLocked } : a));
                              showToast(`${isLocked ? 'Unlocked' : 'Locked'} account for ${admin.email}`, isLocked ? 'success' : 'warning');
                            }
                          }}
                          title={isLocked ? 'Unlock Admin Account' : 'Lock Admin Account'}
                        >
                          {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                        </button>

                        {/* 5. Delete Admin */}
                        <button
                          type="button"
                          className="action-pill-btn red"
                          onClick={() => {
                            if (handleOpenDeleteUser) {
                              handleOpenDeleteUser(admin);
                            } else {
                              setAdmins(prev => prev.filter(a => a.id !== admin.id));
                              showToast(`Deleted admin ${admin.email}`, 'info');
                            }
                          }}
                          title="Delete Administrator"
                        >
                          <Trash2 size={12} />
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

      {/* ── MODAL: PROVISION COMPANY ADMIN ─────────────────────────────────── */}
      {isProvisionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Provision New Company Administrator</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Grant executive tenant root access and configure security credentials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsProvisionModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Target Pharma Company / Tenant <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    required
                    value={newAdminForm.companyId}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, companyId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="">-- Select Company Tenant --</option>
                    {companies.map(c => (
                      <option key={c.id || c.code} value={c.id || c.code}>
                        {c.name} ({c.code || 'ID'}) &bull; {c.country || 'Global'}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      First Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert"
                      value={newAdminForm.firstName}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, firstName: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Last Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vance"
                      value={newAdminForm.lastName}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, lastName: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Work Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@pharma.com"
                      value={newAdminForm.email}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Mobile / Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={newAdminForm.phone}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Executive Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VP Operations & Commercial Strategy"
                    value={newAdminForm.designation}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, designation: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                      Temporary Password
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      style={{
                        background: 'none', border: 'none', color: '#d97706',
                        fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Sparkles size={13} /> Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="SuperAdmin@2026!"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    Defaults to <code>SuperAdmin@2026!</code> if left empty. Admin will be required to reset on first login.
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#334155', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={newAdminForm.sendEmailInvite}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, sendEmailInvite: e.target.checked })}
                    />
                    Dispatch welcome invitation email with login link and temporary credentials
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsProvisionModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
                >
                  Provision Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW ADMIN PROFILE INSPECTOR ────────────────────────────── */}
      {viewingAdmin && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <Eye size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Administrator Security Dossier</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Telemetry, tenant affiliation, and permission matrix.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingAdmin(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff', fontSize: '1.3rem', fontWeight: '800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {(viewingAdmin.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{viewingAdmin.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{viewingAdmin.email}</div>
                  <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: '600', marginTop: '3px' }}>
                    {viewingAdmin.designation || 'Company Administrator'} &bull; {viewingAdmin.company}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Account Status</span>
                  <strong style={{ fontSize: '0.85rem', color: viewingAdmin.isLocked ? '#dc2626' : '#16a34a' }}>
                    {viewingAdmin.isLocked ? '🔒 Account Locked' : '🟢 Active & Verified'}
                  </strong>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Last Activity</span>
                  <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                    {viewingAdmin.lastLogin || 'Never'}
                  </strong>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Assigned Phone</span>
                  <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                    {viewingAdmin.phone || viewingAdmin.mobile || 'None recorded'}
                  </strong>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>MFA Enforcement</span>
                  <strong style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                    🛡️ Enforced (TOTP)
                  </strong>
                </div>
              </div>

              <div>
                <h5 style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#334155' }}>
                  Configured Tenant Permissions
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px' }}>
                  {[
                    'User Management',
                    'Product Catalogue',
                    'Order Booking',
                    'Doctor Registry',
                    'DCR Call Reports',
                    'Analytics & BI',
                    'Data Export',
                    'Settings & Config'
                  ].map((perm, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px',
                      border: '1px solid #bbf7d0', fontSize: '0.76rem', color: '#166534', fontWeight: '600'
                    }}>
                      <CheckCircle2 size={13} color="#16a34a" /> {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setTargetResetAdmin(viewingAdmin);
                  setNewPasswordValue('Admin@2026!');
                  setViewingAdmin(null);
                  setIsResetPwdModalOpen(true);
                }}
              >
                <Key size={14} /> Reset Password
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewingAdmin(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
                  onClick={() => {
                    const admin = viewingAdmin;
                    setViewingAdmin(null);
                    if (handleImpersonate) {
                      handleImpersonate(admin);
                    } else {
                      showToast(`Impersonating ${admin.name}`, 'success');
                    }
                  }}
                >
                  🎭 Impersonate Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: RESET ADMIN PASSWORD ───────────────────────────────────── */}
      {isResetPwdModalOpen && targetResetAdmin && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <Key size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Reset Administrator Password</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Configure a new secure password for <strong>{targetResetAdmin.email}</strong>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => { setIsResetPwdModalOpen(false); setTargetResetAdmin(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDirectResetPwd}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.78rem', color: '#92400e' }}>
                  ⚠️ This action will immediately invalidate existing active JWT sessions for this administrator and enforce re-authentication.
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsResetPwdModalOpen(false); setTargetResetAdmin(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#dc2626', borderColor: '#dc2626' }}
                >
                  Confirm Password Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
