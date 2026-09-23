import React, { useState, useEffect, useCallback } from 'react';
import {
  getTenantAdmins,
  createTenantAdmin,
  updateTenantAdmin,
  deleteTenantAdmin,
  toggleTenantAdminStatus,
  resetTenantAdminPasswordById
} from '../services/api';

// ─── Role Config ────────────────────────────────────────────────────────────
const ADMIN_ROLES = [
  { value: 'COMPANY_ADMIN', label: 'Company Admin', icon: '👑', color: '#8b5cf6', desc: 'Full tenant access — master administrator' },
  { value: 'DIRECTOR',      label: 'Director',      icon: '🏛️', color: '#0ea5e9', desc: 'Executive-level oversight and approval authority' },
  { value: 'MANAGER',       label: 'Manager',       icon: '📋', color: '#10b981', desc: 'Team and operations management' },
  { value: 'ACCOUNTANT',    label: 'Accountant',    icon: '💼', color: '#f59e0b', desc: 'Finance, billing, and expense oversight' },
  { value: 'SALES_MANAGER', label: 'Sales Manager', icon: '📈', color: '#ef4444', desc: 'Sales territory and MR team management' },
  { value: 'SUPERVISOR',    label: 'Supervisor',    icon: '🔍', color: '#6366f1', desc: 'Field operations supervision' },
  { value: 'ADMIN',         label: 'Admin',         icon: '⚙️', color: '#64748b', desc: 'General administrative access' },
];

const ALL_PERMISSIONS = [
  { key: 'TENANT_ACCESS',    label: 'Tenant Access',     icon: '🏢', group: 'Core' },
  { key: 'MANAGE_USERS',     label: 'Manage Users',      icon: '👥', group: 'Core' },
  { key: 'VIEW_REPORTS',     label: 'View Reports',      icon: '📊', group: 'Reports' },
  { key: 'EXPORT_DATA',      label: 'Export Data',       icon: '📤', group: 'Reports' },
  { key: 'MANAGE_DCR',       label: 'Manage DCR',        icon: '📝', group: 'Operations' },
  { key: 'MANAGE_PRODUCTS',  label: 'Manage Products',   icon: '💊', group: 'Operations' },
  { key: 'MANAGE_ORDERS',    label: 'Manage Orders',     icon: '🛒', group: 'Operations' },
  { key: 'MANAGE_EXPENSES',  label: 'Manage Expenses',   icon: '💰', group: 'Finance' },
  { key: 'VIEW_BILLING',     label: 'View Billing',      icon: '🧾', group: 'Finance' },
  { key: 'MANAGE_BILLING',   label: 'Manage Billing',    icon: '💳', group: 'Finance' },
  { key: 'SECURITY_ADMIN',   label: 'Security Admin',    icon: '🔐', group: 'Security' },
  { key: 'VIEW_AUDIT_LOGS',  label: 'View Audit Logs',   icon: '📜', group: 'Security' },
  { key: 'ALL_ACCESS',       label: 'All Access',        icon: '⭐', group: 'Special' },
];

const getStatusColor = (status) => {
  if (!status) return '#64748b';
  if (status.toLowerCase() === 'active') return '#10b981';
  if (status.toLowerCase() === 'suspended') return '#ef4444';
  return '#f59e0b';
};

const getRoleConfig = (role) =>
  ADMIN_ROLES.find(r => r.value === role) || { label: role, icon: '👤', color: '#64748b' };

const initials = (admin) => {
  const f = admin?.first_name?.[0] || '';
  const l = admin?.last_name?.[0] || '';
  return (f + l).toUpperCase() || '?';
};

// ─── Steps ───────────────────────────────────────────────────────────────────
const STEPS = ['Identity', 'Role & Permissions', 'Security', 'Review'];

const defaultForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatarUrl: '',
  role: 'COMPANY_ADMIN',
  designation: '',
  department: 'Executive Administration',
  permissions: ['TENANT_ACCESS', 'MANAGE_USERS', 'VIEW_REPORTS'],
  password: '',
  confirmPassword: '',
  mfaEnforced: false,
  sendWelcomeEmail: true,
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TenantAdminManagerPanel({ tenant, onClose }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit' | 'reset'
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetPwd, setResetPwd] = useState('');
  const [generatedPwd, setGeneratedPwd] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadAdmins = useCallback(async () => {
    if (!tenant?.id) return;
    setLoading(true);
    try {
      const data = await getTenantAdmins(tenant.id);
      setAdmins(data || []);
    } catch (e) {
      showToast('Failed to load admins: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant?.id, showToast]);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const togglePermission = (key) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter(p => p !== key)
        : [...f.permissions, key]
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!$';
    let pwd = 'Admin@';
    for (let i = 0; i < 6; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setField('password', pwd);
    setField('confirmPassword', pwd);
    setGeneratedPwd(pwd);
  };

  const openCreate = () => {
    setForm(defaultForm);
    setGeneratedPwd('');
    setStep(0);
    setView('create');
  };

  const openEdit = (admin) => {
    setSelectedAdmin(admin);
    setForm({
      firstName: admin.first_name || '',
      lastName: admin.last_name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      avatarUrl: admin.avatar_url || '',
      role: admin.role || 'COMPANY_ADMIN',
      designation: admin.designation || '',
      department: admin.department || '',
      permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
      password: '',
      confirmPassword: '',
      mfaEnforced: admin.two_factor_enabled || false,
      sendWelcomeEmail: false,
    });
    setStep(0);
    setView('edit');
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.firstName || !form.email) { showToast('First name and email are required.', 'error'); return; }
    if (form.password && form.password !== form.confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    setSaving(true);
    try {
      const created = await createTenantAdmin(tenant.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        avatarUrl: form.avatarUrl,
        role: form.role,
        designation: form.designation,
        department: form.department,
        permissions: form.permissions,
        password: form.password || undefined,
        mfaEnforced: form.mfaEnforced,
        sendWelcomeEmail: form.sendWelcomeEmail,
      });
      showToast(`✅ Admin "${form.firstName} ${form.lastName}" created successfully!`);
      await loadAdmins();
      setView('list');
    } catch (e) {
      showToast('Failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateTenantAdmin(tenant.id, selectedAdmin.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role: form.role,
        designation: form.designation,
        department: form.department,
        permissions: form.permissions,
        avatarUrl: form.avatarUrl,
      });
      showToast('Admin profile updated!');
      await loadAdmins();
      setView('list');
    } catch (e) {
      showToast('Update failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await toggleTenantAdminStatus(tenant.id, admin.id, newStatus);
      showToast(`Admin ${newStatus === 'Active' ? 'reactivated' : 'suspended'}.`);
      await loadAdmins();
    } catch (e) {
      showToast('Status change failed: ' + e.message, 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!resetPwd) { showToast('Please enter a new password.', 'error'); return; }
    setSaving(true);
    try {
      const result = await resetTenantAdminPasswordById(tenant.id, selectedAdmin.id, resetPwd);
      setGeneratedPwd(result?.temporaryPassword || resetPwd);
      showToast('Password reset. All sessions invalidated.');
      setView('resetSuccess');
    } catch (e) {
      showToast('Reset failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin) => {
    try {
      await deleteTenantAdmin(tenant.id, admin.id);
      showToast(`Admin "${admin.first_name}" removed.`);
      setConfirmDelete(null);
      await loadAdmins();
    } catch (e) {
      showToast('Delete failed: ' + e.message, 'error');
    }
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 0) return form.firstName && form.email && (view === 'edit' || !form.email.includes('@') === false);
    if (step === 2) return !form.password || form.password === form.confirmPassword;
    return true;
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .tam-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: tamFadeIn 0.25s ease;
        }
        @keyframes tamFadeIn { from { opacity:0 } to { opacity:1 } }
        .tam-panel {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px;
          width: 100%; max-width: 900px;
          max-height: 92vh;
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.15);
          animation: tamSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes tamSlideUp { from { transform: translateY(30px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .tam-header {
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(14,165,233,0.15));
          border-bottom: 1px solid rgba(139,92,246,0.25);
          padding: 22px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .tam-header-info { display: flex; align-items: center; gap: 14px; }
        .tam-header-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 20px rgba(139,92,246,0.4);
        }
        .tam-header h2 { margin: 0; font-size: 18px; font-weight: 700; color: #f1f5f9; }
        .tam-header p { margin: 2px 0 0; font-size: 13px; color: #94a3b8; }
        .tam-close-btn {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; border-radius: 10px; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px; transition: all 0.2s;
        }
        .tam-close-btn:hover { background: rgba(239,68,68,0.2); color: #ef4444; border-color: rgba(239,68,68,0.4); }
        .tam-body { overflow-y: auto; flex: 1; padding: 24px 28px; }
        .tam-body::-webkit-scrollbar { width: 4px; }
        .tam-body::-webkit-scrollbar-track { background: transparent; }
        .tam-body::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 4px; }

        /* Admin Cards */
        .tam-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 16px; }
        .tam-admin-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 18px;
          transition: all 0.25s; cursor: default;
          position: relative; overflow: hidden;
        }
        .tam-admin-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--role-color, #8b5cf6);
        }
        .tam-admin-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(139,92,246,0.3); transform: translateY(-2px); }
        .tam-avatar {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #fff;
          background: var(--role-color, #8b5cf6);
          margin-bottom: 12px;
          flex-shrink: 0;
        }
        .tam-admin-name { font-size: 15px; font-weight: 600; color: #f1f5f9; margin-bottom: 2px; }
        .tam-admin-email { font-size: 12px; color: #64748b; margin-bottom: 8px; }
        .tam-role-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
          background: rgba(139,92,246,0.15); color: var(--role-color, #8b5cf6);
          border: 1px solid rgba(139,92,246,0.25); margin-bottom: 10px;
        }
        .tam-status-dot {
          width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px;
        }
        .tam-meta-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
        .tam-meta-text { font-size: 11px; color: #475569; }
        .tam-card-actions { display: flex; gap: 6px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        .tam-action-btn {
          flex: 1; padding: 7px 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); color: #94a3b8;
          font-size: 11px; cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .tam-action-btn:hover { background: rgba(139,92,246,0.15); color: #a78bfa; border-color: rgba(139,92,246,0.3); }
        .tam-action-btn.danger:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }
        .tam-action-btn.warn:hover { background: rgba(245,158,11,0.15); color: #fbbf24; border-color: rgba(245,158,11,0.3); }

        /* Add Button */
        .tam-add-btn {
          display: flex; align-items: center; gap: 10px; padding: 14px 20px;
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(14,165,233,0.15));
          border: 1px dashed rgba(139,92,246,0.4); border-radius: 16px;
          color: #a78bfa; font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.25s; width: 100%;
        }
        .tam-add-btn:hover { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(14,165,233,0.25)); border-color: #8b5cf6; transform: translateY(-2px); }
        .tam-add-btn-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }

        /* Wizard Steps */
        .tam-steps { display: flex; align-items: center; margin-bottom: 28px; }
        .tam-step-item { display: flex; align-items: center; flex: 1; }
        .tam-step-circle {
          width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all 0.3s;
        }
        .tam-step-circle.done { background: #8b5cf6; color: #fff; }
        .tam-step-circle.active { background: linear-gradient(135deg, #8b5cf6, #0ea5e9); color: #fff; box-shadow: 0 0 0 4px rgba(139,92,246,0.2); }
        .tam-step-circle.pending { background: rgba(255,255,255,0.06); color: #475569; border: 1px solid rgba(255,255,255,0.1); }
        .tam-step-label { font-size: 11px; color: #64748b; margin-left: 8px; white-space: nowrap; }
        .tam-step-label.active { color: #a78bfa; }
        .tam-step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); margin: 0 8px; }
        .tam-step-line.done { background: #8b5cf6; }

        /* Form Fields */
        .tam-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .tam-form-group { display: flex; flex-direction: column; gap: 6px; }
        .tam-form-group.full { grid-column: 1/-1; }
        .tam-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .tam-input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px; color: #f1f5f9; font-size: 14px;
          outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box;
        }
        .tam-input:focus { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
        .tam-input::placeholder { color: #475569; }
        .tam-select { appearance: none; cursor: pointer; }

        /* Role Cards */
        .tam-role-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 10px; margin-bottom: 20px; }
        .tam-role-card {
          padding: 14px; border-radius: 12px; cursor: pointer;
          border: 2px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03);
          transition: all 0.2s; position: relative;
        }
        .tam-role-card:hover { background: rgba(255,255,255,0.06); }
        .tam-role-card.selected { border-color: var(--role-color); background: rgba(255,255,255,0.06); }
        .tam-role-card.selected::after {
          content: '✓'; position: absolute; top: 8px; right: 10px;
          color: var(--role-color); font-weight: 700; font-size: 14px;
        }
        .tam-role-icon { font-size: 22px; margin-bottom: 6px; }
        .tam-role-name { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-bottom: 3px; }
        .tam-role-desc { font-size: 11px; color: #64748b; line-height: 1.4; }

        /* Permissions */
        .tam-perm-group { margin-bottom: 16px; }
        .tam-perm-group-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 8px; }
        .tam-perm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 8px; }
        .tam-perm-item {
          display: flex; align-items: center; gap: 8px; padding: 9px 12px;
          border-radius: 10px; cursor: pointer; transition: all 0.15s;
          border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03);
          font-size: 12px; color: #94a3b8; user-select: none;
        }
        .tam-perm-item:hover { border-color: rgba(139,92,246,0.3); color: #c4b5fd; }
        .tam-perm-item.active { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.1); color: #a78bfa; }
        .tam-perm-check { width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        .tam-perm-check.active { background: #8b5cf6; color: #fff; }
        .tam-perm-check.inactive { border: 1px solid rgba(255,255,255,0.15); }

        /* Toggle */
        .tam-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 12px; }
        .tam-toggle-info h4 { margin: 0; font-size: 14px; font-weight: 600; color: #e2e8f0; }
        .tam-toggle-info p { margin: 3px 0 0; font-size: 12px; color: #64748b; }
        .tam-toggle { position: relative; width: 44px; height: 24px; }
        .tam-toggle input { opacity: 0; width: 0; height: 0; }
        .tam-toggle-slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.1); border-radius: 24px; transition: 0.3s;
        }
        .tam-toggle-slider:before {
          content: ''; position: absolute; height: 18px; width: 18px;
          left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.3s;
        }
        .tam-toggle input:checked + .tam-toggle-slider { background: #8b5cf6; }
        .tam-toggle input:checked + .tam-toggle-slider:before { transform: translateX(20px); }

        /* Wizard Buttons */
        .tam-footer { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-top: 1px solid rgba(255,255,255,0.06); }
        .tam-btn {
          padding: 10px 22px; border-radius: 10px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; border: none;
        }
        .tam-btn-ghost { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
        .tam-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
        .tam-btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
          color: #fff; box-shadow: 0 4px 15px rgba(139,92,246,0.35);
        }
        .tam-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(139,92,246,0.5); }
        .tam-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tam-btn-danger { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .tam-btn-danger:hover { background: rgba(239,68,68,0.25); }
        .tam-btn-success { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }

        /* Toast */
        .tam-toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 600;
          z-index: 10000; animation: tamToastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4); white-space: nowrap;
        }
        @keyframes tamToastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        .tam-toast.success { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
        .tam-toast.error { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; }

        /* Review */
        .tam-review-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
        .tam-review-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 12px; font-weight: 700; }
        .tam-review-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .tam-review-key { font-size: 12px; color: #64748b; }
        .tam-review-val { font-size: 12px; color: #e2e8f0; font-weight: 500; }

        /* Delete confirm */
        .tam-confirm-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: 16px; }
        .tam-confirm-box { background: #1e293b; border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 28px; max-width: 320px; text-align: center; }
        .tam-confirm-box h3 { margin: 0 0 8px; color: #f1f5f9; font-size: 16px; }
        .tam-confirm-box p { color: #94a3b8; font-size: 13px; margin: 0 0 20px; }

        /* Empty state */
        .tam-empty { text-align: center; padding: 60px 20px; }
        .tam-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
        .tam-empty h3 { color: #e2e8f0; margin: 0 0 8px; font-size: 18px; }
        .tam-empty p { color: #64748b; font-size: 13px; margin: 0 0 24px; }

        /* Pwd field */
        .tam-pwd-wrap { position: relative; }
        .tam-pwd-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #64748b; cursor: pointer; font-size: 16px; padding: 0; }
        .tam-gen-btn { margin-top: 8px; padding: 8px 14px; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: #a78bfa; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .tam-gen-btn:hover { background: rgba(139,92,246,0.25); }
        .tam-generated-badge { margin-top: 8px; padding: 8px 12px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; font-size: 12px; color: #34d399; font-family: monospace; }

        @media (max-width: 640px) {
          .tam-form-grid { grid-template-columns: 1fr; }
          .tam-admin-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="tam-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="tam-panel">

          {/* Header */}
          <div className="tam-header">
            <div className="tam-header-info">
              <div className="tam-header-icon">👑</div>
              <div>
                <h2>Admin Management</h2>
                <p>
                  {view === 'list' ? `${tenant?.name || 'Tenant'} · ${admins.length} admin${admins.length !== 1 ? 's' : ''}` :
                   view === 'create' ? 'Create New Admin Account' :
                   view === 'edit' ? `Editing: ${selectedAdmin?.first_name || ''} ${selectedAdmin?.last_name || ''}` :
                   view === 'reset' ? 'Reset Admin Password' :
                   'Password Reset Complete'}
                </p>
              </div>
            </div>
            <button className="tam-close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div className="tam-body">
            {/* ── LIST VIEW ── */}
            {view === 'list' && (
              <>
                {/* Add Admin Button */}
                <button className="tam-add-btn" style={{ marginBottom: 20 }} onClick={openCreate}>
                  <div className="tam-add-btn-icon">➕</div>
                  <span>Create New Admin Account for {tenant?.name}</span>
                </button>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⚙️</div>
                    Loading administrators...
                  </div>
                ) : admins.length === 0 ? (
                  <div className="tam-empty">
                    <div className="tam-empty-icon">👤</div>
                    <h3>No Admins Provisioned</h3>
                    <p>Create the first admin account for {tenant?.name} to get them started.</p>
                    <button className="tam-btn tam-btn-primary" onClick={openCreate}>➕ Create First Admin</button>
                  </div>
                ) : (
                  <div className="tam-admin-grid">
                    {admins.map(admin => {
                      const roleConf = getRoleConfig(admin.role);
                      return (
                        <div
                          key={admin.id}
                          className="tam-admin-card"
                          style={{ '--role-color': roleConf.color, position: 'relative' }}
                        >
                          {confirmDelete?.id === admin.id && (
                            <div className="tam-confirm-overlay">
                              <div className="tam-confirm-box">
                                <h3>⚠️ Remove Admin?</h3>
                                <p>This will deactivate <strong>{admin.first_name} {admin.last_name}</strong> and revoke all sessions.</p>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                  <button className="tam-btn tam-btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                  <button className="tam-btn tam-btn-danger" onClick={() => handleDelete(admin)}>Remove</button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div className="tam-avatar" style={{ background: `linear-gradient(135deg, ${roleConf.color}, ${roleConf.color}88)` }}>
                              {admin.avatar_url
                                ? <img src={admin.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                                : initials(admin)
                              }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="tam-admin-name">{admin.first_name} {admin.last_name}</div>
                              <div className="tam-admin-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin.email}</div>
                              <div className="tam-role-badge" style={{ '--role-color': roleConf.color }}>
                                {roleConf.icon} {roleConf.label}
                              </div>
                            </div>
                          </div>

                          <div className="tam-meta-row">
                            <span className="tam-meta-text">
                              <span className="tam-status-dot" style={{ background: getStatusColor(admin.status) }} />
                              {admin.status || 'Active'}
                            </span>
                            <span className="tam-meta-text">
                              {admin.last_login_at
                                ? new Date(admin.last_login_at).toLocaleDateString()
                                : 'Never logged in'}
                            </span>
                          </div>
                          {admin.designation && (
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>
                              {admin.designation}
                            </div>
                          )}
                          <div className="tam-card-actions">
                            <button className="tam-action-btn" onClick={() => openEdit(admin)}>✏️ Edit</button>
                            <button
                              className={`tam-action-btn warn`}
                              onClick={() => handleToggleStatus(admin)}
                            >
                              {admin.status === 'Active' ? '⏸️ Suspend' : '▶️ Activate'}
                            </button>
                            <button
                              className="tam-action-btn"
                              onClick={() => { setSelectedAdmin(admin); setResetPwd(''); setGeneratedPwd(''); setView('reset'); }}
                            >🔑 Reset Pwd</button>
                            <button className="tam-action-btn danger" onClick={() => setConfirmDelete(admin)}>🗑️</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── CREATE / EDIT WIZARD ── */}
            {(view === 'create' || view === 'edit') && (
              <>
                {/* Step Indicators */}
                <div className="tam-steps">
                  {STEPS.map((label, i) => (
                    <div key={i} className="tam-step-item">
                      <div
                        className={`tam-step-circle ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}
                        onClick={() => i < step && setStep(i)}
                        style={{ cursor: i < step ? 'pointer' : 'default' }}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`tam-step-label ${i === step ? 'active' : ''}`}>{label}</span>
                      {i < STEPS.length - 1 && <div className={`tam-step-line ${i < step ? 'done' : ''}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 0: Identity */}
                {step === 0 && (
                  <div className="tam-form-grid">
                    <div className="tam-form-group">
                      <label className="tam-label">First Name *</label>
                      <input className="tam-input" placeholder="e.g. Rajesh" value={form.firstName} onChange={e => setField('firstName', e.target.value)} />
                    </div>
                    <div className="tam-form-group">
                      <label className="tam-label">Last Name</label>
                      <input className="tam-input" placeholder="e.g. Kumar" value={form.lastName} onChange={e => setField('lastName', e.target.value)} />
                    </div>
                    <div className="tam-form-group">
                      <label className="tam-label">Email Address *</label>
                      <input className="tam-input" type="email" placeholder="admin@company.com" value={form.email} onChange={e => setField('email', e.target.value)} disabled={view === 'edit'} />
                    </div>
                    <div className="tam-form-group">
                      <label className="tam-label">Phone</label>
                      <input className="tam-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setField('phone', e.target.value)} />
                    </div>
                    <div className="tam-form-group">
                      <label className="tam-label">Designation</label>
                      <input className="tam-input" placeholder="e.g. Managing Director" value={form.designation} onChange={e => setField('designation', e.target.value)} />
                    </div>
                    <div className="tam-form-group">
                      <label className="tam-label">Department</label>
                      <input className="tam-input" placeholder="e.g. Executive Administration" value={form.department} onChange={e => setField('department', e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Step 1: Role & Permissions */}
                {step === 1 && (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <div className="tam-label" style={{ marginBottom: 12 }}>Select Role</div>
                      <div className="tam-role-grid">
                        {ADMIN_ROLES.map(role => (
                          <div
                            key={role.value}
                            className={`tam-role-card ${form.role === role.value ? 'selected' : ''}`}
                            style={{ '--role-color': role.color }}
                            onClick={() => setField('role', role.value)}
                          >
                            <div className="tam-role-icon">{role.icon}</div>
                            <div className="tam-role-name" style={{ color: form.role === role.value ? role.color : '' }}>{role.label}</div>
                            <div className="tam-role-desc">{role.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="tam-label" style={{ marginBottom: 12 }}>Module Permissions</div>
                      {['Core', 'Reports', 'Operations', 'Finance', 'Security', 'Special'].map(group => {
                        const perms = ALL_PERMISSIONS.filter(p => p.group === group);
                        return (
                          <div key={group} className="tam-perm-group">
                            <div className="tam-perm-group-label">{group}</div>
                            <div className="tam-perm-grid">
                              {perms.map(perm => {
                                const active = form.permissions.includes(perm.key);
                                return (
                                  <div key={perm.key} className={`tam-perm-item ${active ? 'active' : ''}`} onClick={() => togglePermission(perm.key)}>
                                    <div className={`tam-perm-check ${active ? 'active' : 'inactive'}`}>{active ? '✓' : ''}</div>
                                    <span>{perm.icon} {perm.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Step 2: Security */}
                {step === 2 && (
                  <>
                    {view === 'create' && (
                      <div style={{ marginBottom: 24 }}>
                        <div className="tam-label" style={{ marginBottom: 12 }}>{view === 'create' ? 'Set Password' : 'Change Password (optional)'}</div>
                        <div className="tam-form-grid">
                          <div className="tam-form-group">
                            <label className="tam-label">Password</label>
                            <div className="tam-pwd-wrap">
                              <input
                                className="tam-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Leave blank for auto-generated"
                                value={form.password}
                                onChange={e => setField('password', e.target.value)}
                                style={{ paddingRight: 40 }}
                              />
                              <button className="tam-pwd-toggle" onClick={() => setShowPassword(s => !s)}>{showPassword ? '🙈' : '👁️'}</button>
                            </div>
                            <button className="tam-gen-btn" onClick={generatePassword}>🎲 Auto-generate secure password</button>
                            {generatedPwd && (
                              <div className="tam-generated-badge">Generated: {generatedPwd} — save this!</div>
                            )}
                          </div>
                          <div className="tam-form-group">
                            <label className="tam-label">Confirm Password</label>
                            <div className="tam-pwd-wrap">
                              <input
                                className="tam-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repeat password"
                                value={form.confirmPassword}
                                onChange={e => setField('confirmPassword', e.target.value)}
                                style={{ paddingRight: 40, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? 'rgba(239,68,68,0.6)' : '' }}
                              />
                            </div>
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                              <span style={{ fontSize: 11, color: '#f87171' }}>Passwords do not match</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="tam-label" style={{ marginBottom: 12 }}>Security Policies</div>
                      <div className="tam-toggle-row">
                        <div className="tam-toggle-info">
                          <h4>🔐 Require MFA</h4>
                          <p>Force two-factor authentication on first login</p>
                        </div>
                        <label className="tam-toggle">
                          <input type="checkbox" checked={form.mfaEnforced} onChange={e => setField('mfaEnforced', e.target.checked)} />
                          <span className="tam-toggle-slider" />
                        </label>
                      </div>
                      {view === 'create' && (
                        <div className="tam-toggle-row">
                          <div className="tam-toggle-info">
                            <h4>📧 Send Welcome Email</h4>
                            <p>Email credentials to the admin on creation</p>
                          </div>
                          <label className="tam-toggle">
                            <input type="checkbox" checked={form.sendWelcomeEmail} onChange={e => setField('sendWelcomeEmail', e.target.checked)} />
                            <span className="tam-toggle-slider" />
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <>
                    <div className="tam-review-card">
                      <div className="tam-review-label">👤 Identity</div>
                      <div className="tam-review-row"><span className="tam-review-key">Name</span><span className="tam-review-val">{form.firstName} {form.lastName}</span></div>
                      <div className="tam-review-row"><span className="tam-review-key">Email</span><span className="tam-review-val">{form.email}</span></div>
                      <div className="tam-review-row"><span className="tam-review-key">Phone</span><span className="tam-review-val">{form.phone || '—'}</span></div>
                      <div className="tam-review-row"><span className="tam-review-key">Designation</span><span className="tam-review-val">{form.designation || '—'}</span></div>
                      <div className="tam-review-row"><span className="tam-review-key">Department</span><span className="tam-review-val">{form.department || '—'}</span></div>
                    </div>
                    <div className="tam-review-card">
                      <div className="tam-review-label">🎭 Role & Permissions</div>
                      <div className="tam-review-row">
                        <span className="tam-review-key">Role</span>
                        <span className="tam-review-val">{getRoleConfig(form.role).icon} {getRoleConfig(form.role).label}</span>
                      </div>
                      <div className="tam-review-row">
                        <span className="tam-review-key">Permissions</span>
                        <span className="tam-review-val" style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{form.permissions.join(', ') || 'None'}</span>
                      </div>
                    </div>
                    <div className="tam-review-card">
                      <div className="tam-review-label">🔒 Security</div>
                      <div className="tam-review-row"><span className="tam-review-key">MFA Required</span><span className="tam-review-val">{form.mfaEnforced ? '✅ Yes' : '❌ No'}</span></div>
                      {view === 'create' && <div className="tam-review-row"><span className="tam-review-key">Password</span><span className="tam-review-val">{form.password ? '✅ Custom set' : '🎲 Auto-generated'}</span></div>}
                      {view === 'create' && <div className="tam-review-row"><span className="tam-review-key">Welcome Email</span><span className="tam-review-val">{form.sendWelcomeEmail ? '📧 Will be sent' : '⛔ Not sending'}</span></div>}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── RESET PASSWORD VIEW ── */}
            {view === 'reset' && (
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🔑</div>
                  <h3 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: 20 }}>Reset Admin Password</h3>
                  <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>
                    For: <strong style={{ color: '#a78bfa' }}>{selectedAdmin?.first_name} {selectedAdmin?.last_name}</strong> ({selectedAdmin?.email})
                  </p>
                  <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: 12 }}>All active sessions will be immediately invalidated.</p>
                </div>
                <div className="tam-form-group" style={{ marginBottom: 16 }}>
                  <label className="tam-label">New Password</label>
                  <div className="tam-pwd-wrap">
                    <input
                      className="tam-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password or generate one"
                      value={resetPwd}
                      onChange={e => setResetPwd(e.target.value)}
                      style={{ paddingRight: 40 }}
                    />
                    <button className="tam-pwd-toggle" onClick={() => setShowPassword(s => !s)}>{showPassword ? '🙈' : '👁️'}</button>
                  </div>
                  <button className="tam-gen-btn" onClick={() => {
                    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!$';
                    let pwd = 'Reset@';
                    for (let i = 0; i < 6; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
                    setResetPwd(pwd);
                  }}>🎲 Auto-generate</button>
                </div>
              </div>
            )}

            {/* ── RESET SUCCESS ── */}
            {view === 'resetSuccess' && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: 22 }}>Password Reset Successfully</h3>
                <p style={{ color: '#64748b', margin: '0 0 24px', fontSize: 14 }}>All sessions for this admin have been invalidated.</p>
                {generatedPwd && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '18px 28px', display: 'inline-block', marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: '#34d399', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Temporary Password</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.1em' }}>{generatedPwd}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Share this securely with the admin</div>
                  </div>
                )}
                <br />
                <button className="tam-btn tam-btn-primary" onClick={() => { setView('list'); loadAdmins(); }}>← Back to Admin List</button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="tam-footer">
            {view === 'list' && (
              <>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  {admins.filter(a => a.status === 'Active').length} Active · {admins.filter(a => a.status !== 'Active').length} Inactive
                </div>
                <button className="tam-btn tam-btn-ghost" onClick={onClose}>Close</button>
              </>
            )}

            {(view === 'create' || view === 'edit') && (
              <>
                <button className="tam-btn tam-btn-ghost" onClick={() => step === 0 ? setView('list') : setStep(s => s - 1)}>
                  {step === 0 ? '← Cancel' : '← Back'}
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  {step < STEPS.length - 1 ? (
                    <button className="tam-btn tam-btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                      Next →
                    </button>
                  ) : (
                    <button
                      className="tam-btn tam-btn-success"
                      onClick={view === 'create' ? handleCreate : handleUpdate}
                      disabled={saving}
                    >
                      {saving ? '⏳ Saving...' : view === 'create' ? '✅ Create Admin' : '✅ Save Changes'}
                    </button>
                  )}
                </div>
              </>
            )}

            {view === 'reset' && (
              <>
                <button className="tam-btn tam-btn-ghost" onClick={() => setView('list')}>← Cancel</button>
                <button className="tam-btn tam-btn-primary" onClick={handleResetPassword} disabled={saving || !resetPwd}>
                  {saving ? '⏳ Resetting...' : '🔑 Reset Password'}
                </button>
              </>
            )}

            {view === 'resetSuccess' && (
              <div style={{ width: '100%', textAlign: 'right' }}>
                <button className="tam-btn tam-btn-primary" onClick={() => { setView('list'); loadAdmins(); }}>Done</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className={`tam-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
