import React, { useState, useMemo } from 'react';
import {
  Database, ShieldCheck, Shield, CheckCircle2, AlertTriangle, Plus, Search,
  Filter, Clock, RotateCcw, Trash2, Download, RefreshCw, ChevronRight,
  MoreVertical, Eye, FileText, Check, X, AlertOctagon, Layers, HardDrive,
  Archive, Activity, History, Settings, ExternalLink, ArrowRight, Lock,
  Cloud, PieChart, HelpCircle, CheckCircle, Flame, Sparkles
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function DataManagementTab() {
  const ctx = useDashboard();
  const { showToast } = ctx || {};

  // Sub-navigation tab: 'quotas' | 'retention' | 'archival' | 'deletions' | 'audit'
  const [activeSubTab, setActiveSubTab] = useState('quotas');

  // Timeframe selector for Data Lifecycle Overview
  const [lifecycleTimeframe, setLifecycleTimeframe] = useState('30d');

  // Search & Filters for Tenant Quotas Table
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Active Menu Dropdown for table rows (tenant ID or null)
  const [activeMenuTenantId, setActiveMenuTenantId] = useState(null);

  // Modals state
  const [selectedTenantModal, setSelectedTenantModal] = useState(null);
  const [isEditPolicyModalOpen, setIsEditPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [isQueuePurgeModalOpen, setIsQueuePurgeModalOpen] = useState(false);
  const [purgeTargetTenant, setPurgeTargetTenant] = useState(null);
  const [purgeConfirmToken, setPurgeConfirmToken] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTargetTenant, setExportTargetTenant] = useState(null);

  // Primary Tenants Dataset (Seeded with exact data from UI design)
  const [tenantsList, setTenantsList] = useState([
    {
      id: 'TEN-001',
      companyName: 'Pfizer BioPharma Ltd',
      logoText: 'Pfizer',
      logoBg: '#0066cc',
      planTier: 'ENTERPRISE',
      storageUsedGB: 204.8,
      storageAllocatedTB: 2.0,
      retentionYears: '7 years',
      retentionPolicyType: 'Custom Policy',
      complianceScore: 98,
      complianceStatus: 'Compliant',
      nextReviewDate: '27 Sep 2027',
      activeStorageGB: 154.2,
      archivedStorageGB: 42.6,
      telemetryLogsGB: 8.0,
      lastBackupTimestamp: 'Today, 02:00 UTC',
      encryptionStatus: 'AES-256 Enabled'
    },
    {
      id: 'TEN-002',
      companyName: 'Novartis Pharma Global',
      logoText: 'Novartis',
      logoBg: '#e65100',
      isFlame: true,
      planTier: 'ENTERPRISE',
      storageUsedGB: 312.0,
      storageAllocatedTB: 2.0,
      retentionYears: '7 years',
      retentionPolicyType: 'Custom Policy',
      complianceScore: 95,
      complianceStatus: 'Compliant',
      nextReviewDate: '15 Dec 2026',
      activeStorageGB: 240.5,
      archivedStorageGB: 60.1,
      telemetryLogsGB: 11.4,
      lastBackupTimestamp: 'Today, 02:00 UTC',
      encryptionStatus: 'AES-256 Enabled'
    },
    {
      id: 'TEN-003',
      companyName: 'AstraZeneca Healthcare',
      logoText: 'AstraZeneca',
      logoBg: '#880e4f',
      planTier: 'PROFESSIONAL',
      storageUsedGB: 512.0,
      storageAllocatedTB: 2.0,
      retentionYears: '5 years',
      retentionPolicyType: 'Standard Policy',
      complianceScore: 92,
      complianceStatus: 'At Risk',
      nextReviewDate: '10 Nov 2026',
      activeStorageGB: 410.2,
      archivedStorageGB: 82.8,
      telemetryLogsGB: 19.0,
      lastBackupTimestamp: 'Today, 02:00 UTC',
      encryptionStatus: 'AES-256 Enabled'
    },
    {
      id: 'TEN-004',
      companyName: 'Johnson & Johnson',
      logoText: 'J&J',
      logoBg: '#c62828',
      planTier: 'PROFESSIONAL',
      storageUsedGB: 186.0,
      storageAllocatedTB: 2.0,
      retentionYears: '7 years',
      retentionPolicyType: 'Custom Policy',
      complianceScore: 97,
      complianceStatus: 'Compliant',
      nextReviewDate: '22 Dec 2026',
      activeStorageGB: 135.0,
      archivedStorageGB: 41.0,
      telemetryLogsGB: 10.0,
      lastBackupTimestamp: 'Today, 02:00 UTC',
      encryptionStatus: 'AES-256 Enabled'
    },
    {
      id: 'TEN-005',
      companyName: 'Roche Diagnostics',
      logoText: 'Roche',
      logoBg: '#0284c7',
      isHex: true,
      planTier: 'ENTERPRISE',
      storageUsedGB: 76.0,
      storageAllocatedTB: 2.0,
      retentionYears: '5 years',
      retentionPolicyType: 'Standard Policy',
      complianceScore: 94,
      complianceStatus: 'Compliant',
      nextReviewDate: '18 Nov 2026',
      activeStorageGB: 55.4,
      archivedStorageGB: 16.2,
      telemetryLogsGB: 4.4,
      lastBackupTimestamp: 'Today, 02:00 UTC',
      encryptionStatus: 'AES-256 Enabled'
    }
  ]);

  // Retention Policies Dataset
  const [retentionPolicies, setRetentionPolicies] = useState([
    { id: 'POL-01', name: '7-Year Financial & Invoice Ledger', category: 'Billing & Accounting', retentionDays: 2555, autoPurge: true, status: 'Active', scope: 'Enterprise Tenants' },
    { id: 'POL-02', name: '5-Year Verified Doctor Call Reports (DCR)', category: 'Field Operations', retentionDays: 1825, autoPurge: true, status: 'Active', scope: 'All Tenants' },
    { id: 'POL-03', name: '3-Year GPS Breadcrumbs & Geofence Logs', category: 'Telemetry & Geolocation', retentionDays: 1095, autoPurge: true, status: 'Active', scope: 'Field Reps' },
    { id: 'POL-04', name: '10-Year Clinical Samples & Batch Release Vault', category: 'Pharma Regulatory (FDA 21 CFR)', retentionDays: 3650, autoPurge: false, status: 'Active', scope: 'Global Tier' },
    { id: 'POL-05', name: '90-Day Temporary File Shredder (Session Dumps)', category: 'System Cache', retentionDays: 90, autoPurge: true, status: 'Active', scope: 'Global' }
  ]);

  // Pending Deletion Queue Dataset (7 items queued as shown in metric card)
  const [deletionQueue, setDeletionQueue] = useState([
    { id: 'DEL-881', tenantName: 'Pfizer BioPharma Ltd', scope: '3 Resigned Rep Mobile Cache Snapshots', reason: 'Employee Exit Protocol', gracePeriodDays: 2, status: 'Needs Review', createdAt: '26 Sept 2026' },
    { id: 'DEL-882', tenantName: 'AstraZeneca Healthcare', scope: 'Territory Reassignment Backup Dumps (TR-402)', reason: 'Superseded by TR-900', gracePeriodDays: 3, status: 'Needs Review', createdAt: '26 Sept 2026' },
    { id: 'DEL-883', tenantName: 'Novartis Pharma Global', scope: 'Expired GPS Geofence Checkin Records (2023)', reason: 'Retention Schedule Expired', gracePeriodDays: 5, status: 'Scheduled', createdAt: '25 Sept 2026' },
    { id: 'DEL-884', tenantName: 'Roche Diagnostics', scope: 'Temporary CSV Doctor Import Manifests', reason: 'ETL Processing Finished', gracePeriodDays: 1, status: 'Needs Review', createdAt: '25 Sept 2026' },
    { id: 'DEL-885', tenantName: 'Johnson & Johnson', scope: 'Inactive Sample Order Slips (v1 format)', reason: 'Format Deprecated', gracePeriodDays: 4, status: 'Scheduled', createdAt: '24 Sept 2026' },
    { id: 'DEL-886', tenantName: 'Pfizer BioPharma Ltd', scope: 'Stale OAuth Token Session Telemetry', reason: 'Security Hygiene', gracePeriodDays: 2, status: 'Needs Review', createdAt: '24 Sept 2026' },
    { id: 'DEL-887', tenantName: 'Cipla Therapeutics', scope: 'Orphaned Attachment Thumbnails', reason: 'Storage Reclamation', gracePeriodDays: 6, status: 'Scheduled', createdAt: '23 Sept 2026' }
  ]);

  // Recent Activity Feed Dataset (6 events from screenshot)
  const recentActivities = [
    { id: 1, type: 'retention', title: 'Retention policy applied', desc: 'Applied 7 year retention policy to Novartis Pharma Global', time: '2 hours ago', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
    { id: 2, type: 'compliance', title: 'Compliance check completed', desc: 'All policies compliant for AstraZeneca Healthcare', time: '4 hours ago', icon: ShieldCheck, color: '#0284c7', bg: '#eff6ff' },
    { id: 3, type: 'deletion', title: 'Deletion queue processed', desc: '3 items deleted from Pfizer BioPharma Ltd', time: '6 hours ago', icon: Trash2, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 4, type: 'restore', title: 'Restore request submitted', desc: 'User requested restore for 12 files (Novartis Pharma Global)', time: '8 hours ago', icon: RotateCcw, color: '#f97316', bg: '#fff7ed' },
    { id: 5, type: 'policy', title: 'Policy updated', desc: 'Updated retention policy for global_data (All Tenants)', time: '12 hours ago', icon: Settings, color: '#1e293b', bg: '#f1f5f9' },
    { id: 6, type: 'audit', title: 'Audit log exported', desc: 'Data governance audit log exported (CSV)', time: '14 hours ago', icon: FileText, color: '#0ea5e9', bg: '#f0f9ff' }
  ];

  // Filtered tenants based on search and tier
  const filteredTenants = useMemo(() => {
    return tenantsList.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        t.companyName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.planTier.toLowerCase().includes(q) ||
        t.retentionPolicyType.toLowerCase().includes(q);

      const matchesTier = tierFilter === 'ALL' || t.planTier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [tenantsList, searchQuery, tierFilter]);

  // Quick Action Handler: Save Policy Edit
  const handleSavePolicyEdit = (e) => {
    e.preventDefault();
    if (!editingPolicy) return;
    setTenantsList(prev => prev.map(t => {
      if (t.id === editingPolicy.id) {
        return {
          ...t,
          retentionYears: editingPolicy.retentionYears,
          retentionPolicyType: editingPolicy.retentionPolicyType,
          complianceScore: editingPolicy.complianceScore || t.complianceScore
        };
      }
      return t;
    }));
    setIsEditPolicyModalOpen(false);
    if (showToast) showToast(`Retention policy updated for ${editingPolicy.companyName}`, 'success');
  };

  // Quick Action Handler: Execute Purge
  const handleExecutePurge = () => {
    if (purgeConfirmToken !== 'CONFIRM-PURGE') {
      if (showToast) showToast('Type CONFIRM-PURGE to authorize shredding', 'error');
      return;
    }
    setDeletionQueue(prev => prev.filter(item => item.id !== purgeTargetTenant?.id));
    setIsQueuePurgeModalOpen(false);
    setPurgeConfirmToken('');
    if (showToast) showToast(`Permanent forensic shred complete for ${purgeTargetTenant?.tenantName}`, 'success');
  };

  // Quick Action Handler: Trigger Export
  const handleTriggerExportSubmit = (format) => {
    setIsExportModalOpen(false);
    if (showToast) showToast(`Export initiated for ${exportTargetTenant?.companyName} in ${format} format`, 'success');
  };

  return (
    <div className="tab-pane-content" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* =====================================================================
          1. HEADER & TOP BANNER
          ===================================================================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.35)'
            }}
          >
            <Database size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Data Governance &amp; Retention
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Secure your data. Ensure compliance. Drive trust.
            </p>
          </div>
        </div>

        {/* Top Right Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
          <ShieldCheck size={16} color="#0284c7" />
          <span>Compliant</span>
          <span>•</span>
          <span>Secure</span>
          <span>•</span>
          <span>Auditable</span>
          <span>•</span>
          <span style={{ color: '#0f172a', fontWeight: '700' }}>Future Ready</span>
        </div>
      </div>

      {/* =====================================================================
          2. TOP 4 METRIC CARDS STRIP
          ===================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Metric Card 1: Storage Utilization */}
        <div
          className="card-section"
          style={{
            margin: 0,
            padding: '18px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}
              >
                <Database size={19} />
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600', display: 'block' }}>
                  Storage Utilization
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>12.5%</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>of 2.0 TB used</span>
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              Healthy <ChevronRight size={12} />
            </span>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginBottom: '4px' }}>
              <span>+ 1.75 TB free</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '12.5%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Retention Compliance */}
        <div
          className="card-section"
          style={{
            margin: 0,
            padding: '18px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600', display: 'block' }}>
                  Retention Compliance
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>96%</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>of 18 policies</span>
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              On Track <ChevronRight size={12} />
            </span>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '96%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Pending Deletions */}
        <div
          className="card-section"
          style={{
            margin: 0,
            padding: '18px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#fff1f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f43f5e'
                }}
              >
                <Trash2 size={19} />
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600', display: 'block' }}>
                  Pending Deletions
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>7</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>items queued</span>
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#fffbeb',
                color: '#d97706',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              Needs Review <ChevronRight size={12} />
            </span>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((dot, i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i < 3 ? '#f59e0b' : (i < 5 ? '#fbbf24' : '#cbd5e1')
                }}
              />
            ))}
            {[8, 9, 10].map((dot, i) => (
              <span
                key={`empty-${i}`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#f1f5f9'
                }}
              />
            ))}
          </div>
        </div>

        {/* Metric Card 4: Backup Health */}
        <div
          className="card-section"
          style={{
            margin: 0,
            padding: '18px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7'
                }}
              >
                <Cloud size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600', display: 'block' }}>
                  Backup Health
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>99.8%</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>last successful backup</span>
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              Healthy <ChevronRight size={12} />
            </span>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((dot, i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i === 7 ? '#10b981' : '#059669'
                }}
              />
            ))}
            {[9, 10].map((dot, i) => (
              <span
                key={`empty-${i}`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#cbd5e1'
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* =====================================================================
          3. MAIN SPLIT: LEFT (Lifecycle + Table) vs RIGHT (Health + Activity)
          ===================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* ======================= LEFT COLUMN ======================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card: Data Lifecycle Overview */}
          <div
            className="card-section"
            style={{
              margin: 0,
              padding: '20px 24px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#0284c7" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                    Data Lifecycle Overview
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    From active storage to secure deletion — full visibility, always.
                  </p>
                </div>
              </div>

              {/* Timeframe Dropdown */}
              <div>
                <select
                  value={lifecycleTimeframe}
                  onChange={(e) => {
                    setLifecycleTimeframe(e.target.value);
                    if (showToast) showToast(`Data Lifecycle window set to ${e.target.value}`, 'info');
                  }}
                  className="form-control"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: '600',
                    height: '32px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#334155'
                  }}
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last 1 Year</option>
                </select>
              </div>
            </div>

            {/* 5-Stage Pipeline Flow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 10px' }}>
              
              {/* 1. Active */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <Layers size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: '700' }}>Active</div>
                <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: '800', marginTop: '1px' }}>842.6 GB</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>72.4%</div>
              </div>

              <ChevronRight size={18} color="#94a3b8" style={{ margin: '0 4px 20px' }} />

              {/* 2. Archived */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                    }}
                  >
                    <Archive size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: '700' }}>Archived</div>
                <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: '800', marginTop: '1px' }}>198.3 GB</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>17.0%</div>
              </div>

              <ChevronRight size={18} color="#94a3b8" style={{ margin: '0 4px 20px' }} />

              {/* 3. Retained */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <Clock size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: '700' }}>Retained</div>
                <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: '800', marginTop: '1px' }}>62.7 GB</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>5.4%</div>
              </div>

              <ChevronRight size={18} color="#94a3b8" style={{ margin: '0 4px 20px' }} />

              {/* 4. Eligible for Deletion */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    <Trash2 size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: '700' }}>Eligible for Deletion</div>
                <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: '800', marginTop: '1px' }}>7.4 GB</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>0.6%</div>
              </div>

              <ChevronRight size={18} color="#94a3b8" style={{ margin: '0 4px 20px' }} />

              {/* 5. Purged */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(71, 85, 105, 0.3)'
                    }}
                  >
                    <ShieldCheck size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: '700' }}>Purged</div>
                <div style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: '800', marginTop: '1px' }}>2.9 GB</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>0.3%</div>
              </div>

            </div>

            {/* Continuous Multi-Segment Bottom Progress Bar */}
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden', background: '#e2e8f0' }}>
              <div style={{ width: '72.4%', background: '#3b82f6' }} title="Active: 72.4%"></div>
              <div style={{ width: '17.0%', background: '#9333ea' }} title="Archived: 17.0%"></div>
              <div style={{ width: '5.4%', background: '#059669' }} title="Retained: 5.4%"></div>
              <div style={{ width: '0.6%', background: '#ea580c' }} title="Eligible for Deletion: 0.6%"></div>
              <div style={{ width: '4.6%', background: '#64748b' }} title="Purged & Overhead: 0.3%"></div>
            </div>
          </div>

          {/* Sub-Tabs Bar & Quotas Directory */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px'
              }}
            >
              {/* Pills Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'quotas', label: 'Storage Quotas' },
                  { key: 'retention', label: 'Retention Policies' },
                  { key: 'archival', label: 'Archival' },
                  { key: 'deletions', label: 'Deletion Queue' },
                  { key: 'audit', label: 'Audit Logs' }
                ].map(tab => {
                  const isActive = activeSubTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveSubTab(tab.key)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: 'none',
                        background: isActive ? '#0f172a' : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#64748b',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search & Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by tenant, plan or usage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{
                      paddingLeft: '32px',
                      fontSize: '0.76rem',
                      height: '34px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: isFilterOpen ? '#e2e8f0' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                  title="Filter options"
                >
                  <Filter size={15} />
                </button>
              </div>
            </div>

            {/* Filter Drawer / Bar if open */}
            {isFilterOpen && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.76rem'
                }}
              >
                <span style={{ fontWeight: '700', color: '#475569' }}>Filter Plan Tier:</span>
                {['ALL', 'ENTERPRISE', 'PROFESSIONAL'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierFilter(t)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: tierFilter === t ? '#0284c7' : '#cbd5e1',
                      background: tierFilter === t ? '#0284c7' : '#ffffff',
                      color: tierFilter === t ? '#ffffff' : '#475569'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* =========================================================
                SUB-TAB CONTENT 1: STORAGE QUOTAS TABLE
                ========================================================= */}
            {activeSubTab === 'quotas' && (
              <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'visible', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="saas-table-container">
                  <table className="saas-data-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>TENANT / COMPANY</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>PLAN TIER</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', minWidth: '150px' }}>STORAGE USED</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>RETENTION POLICY</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>COMPLIANCE</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>NEXT REVIEW</th>
                        <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textAlign: 'center' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                            No tenants matched the search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTenants.map(t => {
                          const totalMB = t.storageAllocatedTB * 1024;
                          const pct = Math.min(100, Math.round((t.storageUsedGB / totalMB) * 100));

                          return (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              
                              {/* TENANT / COMPANY */}
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {/* Company Logo Badge */}
                                  <div
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: t.isHex ? '6px' : (t.logoText === 'Pfizer' ? '16px' : '50%'),
                                      background: t.logoBg,
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: '800',
                                      fontSize: '0.66rem',
                                      flexShrink: 0,
                                      fontStyle: t.logoText === 'J&J' ? 'italic' : 'normal'
                                    }}
                                  >
                                    {t.isFlame ? <Flame size={18} color="#ffffff" /> : t.logoText.slice(0, 3)}
                                  </div>

                                  <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>
                                      {t.companyName}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                      {t.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* PLAN TIER */}
                              <td style={{ padding: '12px 14px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.68rem',
                                    fontWeight: '800',
                                    letterSpacing: '0.04em',
                                    background: t.planTier === 'ENTERPRISE' ? '#eff6ff' : '#f3e8ff',
                                    color: t.planTier === 'ENTERPRISE' ? '#1d4ed8' : '#7e22ce',
                                    border: `1px solid ${t.planTier === 'ENTERPRISE' ? '#bfdbfe' : '#e9d5ff'}`
                                  }}
                                >
                                  {t.planTier}
                                </span>
                              </td>

                              {/* STORAGE USED */}
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: '700', marginBottom: '4px' }}>
                                  {t.storageUsedGB} GB <span style={{ color: '#94a3b8', fontWeight: '400' }}>/ {t.storageAllocatedTB.toFixed(1)} TB</span>
                                </div>
                                <div style={{ width: '110px', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${Math.max(6, pct)}%`, height: '100%', background: '#06b6d4', borderRadius: '3px' }}></div>
                                </div>
                              </td>

                              {/* RETENTION POLICY */}
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                                  {t.retentionYears}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                  {t.retentionPolicyType}
                                </div>
                              </td>

                              {/* COMPLIANCE */}
                              <td style={{ padding: '12px 14px' }}>
                                {t.complianceStatus === 'Compliant' ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      background: '#dcfce7',
                                      color: '#15803d'
                                    }}
                                  >
                                    <Check size={12} /> {t.complianceScore}% Compliant
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      background: '#fef3c7',
                                      color: '#b45309'
                                    }}
                                  >
                                    <AlertTriangle size={12} /> {t.complianceScore}% At Risk
                                  </span>
                                )}
                              </td>

                              {/* NEXT REVIEW */}
                              <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: '#475569', whiteSpace: 'nowrap' }}>
                                {t.nextReviewDate}
                              </td>

                              {/* ACTIONS */}
                              <td style={{ padding: '12px 14px', textAlign: 'center', position: 'relative' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedTenantModal(t)}
                                    className="btn btn-secondary btn-sm"
                                    style={{
                                      padding: '3px 10px',
                                      fontSize: '0.74rem',
                                      fontWeight: '600',
                                      background: '#ffffff',
                                      borderColor: '#cbd5e1',
                                      color: '#0f172a'
                                    }}
                                  >
                                    View
                                  </button>

                                  <div style={{ position: 'relative' }}>
                                    <button
                                      type="button"
                                      onClick={() => setActiveMenuTenantId(activeMenuTenantId === t.id ? null : t.id)}
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '4px',
                                        border: '1px solid #cbd5e1',
                                        background: '#ffffff',
                                        color: '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <MoreVertical size={14} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenuTenantId === t.id && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          right: 0,
                                          top: '32px',
                                          zIndex: 50,
                                          width: '180px',
                                          background: '#ffffff',
                                          borderRadius: '8px',
                                          border: '1px solid #e2e8f0',
                                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                          padding: '4px 0',
                                          textAlign: 'left'
                                        }}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMenuTenantId(null);
                                            setSelectedTenantModal(t);
                                          }}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            fontSize: '0.74rem',
                                            color: '#1e293b',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                          }}
                                        >
                                          <Eye size={13} color="#0284c7" /> Inspect Governance
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMenuTenantId(null);
                                            setEditingPolicy(t);
                                            setIsEditPolicyModalOpen(true);
                                          }}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            fontSize: '0.74rem',
                                            color: '#1e293b',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                          }}
                                        >
                                          <Clock size={13} color="#f59e0b" /> Edit Retention Policy
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMenuTenantId(null);
                                            setExportTargetTenant(t);
                                            setIsExportModalOpen(true);
                                          }}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            fontSize: '0.74rem',
                                            color: '#1e293b',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                          }}
                                        >
                                          <Download size={13} color="#10b981" /> Trigger Compliance Export
                                        </button>

                                        <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMenuTenantId(null);
                                            setPurgeTargetTenant(t);
                                            setIsQueuePurgeModalOpen(true);
                                          }}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            fontSize: '0.74rem',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                          }}
                                        >
                                          <Trash2 size={13} color="#dc2626" /> Queue for Deletion
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================
                SUB-TAB CONTENT 2: RETENTION POLICIES
                ========================================================= */}
            {activeSubTab === 'retention' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>5 active enterprise retention schedules enforced globally</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditingPolicy({ id: 'POL-NEW', companyName: 'Global Rule', retentionYears: '5 years', retentionPolicyType: 'Custom Policy', complianceScore: 100 });
                      setIsEditPolicyModalOpen(true);
                    }}
                    style={{ background: '#0284c7' }}
                  >
                    <Plus size={14} /> Add Retention Rule
                  </button>
                </div>

                <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Policy ID</th>
                        <th>Schedule Name</th>
                        <th>Classification</th>
                        <th>Duration</th>
                        <th>Purge Mode</th>
                        <th>Enforcement Scope</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retentionPolicies.map(pol => (
                        <tr key={pol.id}>
                          <td><code>{pol.id}</code></td>
                          <td><strong>{pol.name}</strong></td>
                          <td><span className="status-tag status-trial">{pol.category}</span></td>
                          <td><strong>{pol.retentionDays} days</strong> ({Math.round(pol.retentionDays / 365)} years)</td>
                          <td>
                            <span style={{ color: pol.autoPurge ? '#16a34a' : '#d97706', fontWeight: '700', fontSize: '0.72rem' }}>
                              {pol.autoPurge ? '● Auto-Purge Verified' : 'Manual Sign-off'}
                            </span>
                          </td>
                          <td><span style={{ fontSize: '0.74rem', color: '#475569' }}>{pol.scope}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================
                SUB-TAB CONTENT 3: ARCHIVAL (COLD STORAGE)
                ========================================================= */}
            {activeSubTab === 'archival' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>AWS S3 Glacier Multi-Region Cold Vault</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>Archived data compressed into immutable read-only snapshots with 99.999999999% durability.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (showToast) showToast('Cold vault status synchronized with AWS Frankfurt region', 'success');
                    }}
                  >
                    <RefreshCw size={13} /> Check Sync Status
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="card-section" style={{ margin: 0, padding: '14px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>TOTAL ARCHIVED SNAPSHOTS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>198.3 GB</div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981' }}>24 Encrypted Bundles</div>
                  </div>
                  <div className="card-section" style={{ margin: 0, padding: '14px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>RESTORE AVAILABILITY</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284c7', margin: '4px 0' }}>Expedited (3-5 min)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>SLA 99.9%</div>
                  </div>
                  <div className="card-section" style={{ margin: 0, padding: '14px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>ENCRYPTION STANDARD</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#16a34a', margin: '4px 0' }}>AES-256 GCM</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>KMS Key Rotated</div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SUB-TAB CONTENT 4: DELETION QUEUE
                ========================================================= */}
            {activeSubTab === 'deletions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#d97706" />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#92400e' }}>7 Deletion Tasks Pending Safety Review</div>
                      <div style={{ fontSize: '0.72rem', color: '#b45309' }}>Permanent shredding physically erases records. Verified 2-step token barrier required.</div>
                    </div>
                  </div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Queue ID</th>
                        <th>Tenant</th>
                        <th>Purge Scope</th>
                        <th>Reason</th>
                        <th>Grace Period</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletionQueue.map(item => (
                        <tr key={item.id}>
                          <td><code>{item.id}</code></td>
                          <td><strong>{item.tenantName}</strong></td>
                          <td style={{ fontSize: '0.74rem' }}>{item.scope}</td>
                          <td style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.reason}</td>
                          <td><span style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: '700' }}>{item.gracePeriodDays} days remaining</span></td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700', background: item.status === 'Needs Review' ? '#fffbeb' : '#eff6ff', color: item.status === 'Needs Review' ? '#d97706' : '#2563eb' }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ background: '#dc2626', borderColor: '#dc2626', padding: '3px 8px', fontSize: '0.7rem' }}
                              onClick={() => {
                                setPurgeTargetTenant({ id: item.id, tenantName: item.tenantName, scope: item.scope });
                                setIsQueuePurgeModalOpen(true);
                              }}
                            >
                              Execute Purge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================
                SUB-TAB CONTENT 5: AUDIT LOGS
                ========================================================= */}
            {activeSubTab === 'audit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Cryptographically signed tamper-proof data governance audit trail</span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (showToast) showToast('Data governance ledger exported to CSV format', 'success');
                    }}
                  >
                    <Download size={13} /> Export Ledger (CSV)
                  </button>
                </div>

                <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <table className="saas-data-table" style={{ margin: 0, width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action Performed</th>
                        <th>Organization</th>
                        <th>Operator</th>
                        <th>Integrity Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { time: '27 Sept 2026, 03:40', action: 'RETENTION_POLICY_ENFORCED', org: 'Novartis Pharma Global', user: 'Super Admin', hash: 'sha256:4a8f9c...' },
                        { time: '27 Sept 2026, 01:15', action: 'SCHEDULED_BACKUP_COMPLETED', org: 'All Tenants', user: 'System Cron', hash: 'sha256:7b1e2a...' },
                        { time: '26 Sept 2026, 21:50', action: 'DELETION_ITEM_QUEUED', org: 'Pfizer BioPharma Ltd', user: 'HR Compliance', hash: 'sha256:3d9c81...' },
                        { time: '26 Sept 2026, 17:30', action: 'RESTORE_REQUEST_SUBMITTED', org: 'Novartis Pharma Global', user: 'Priya Patel', hash: 'sha256:9f2d11...' },
                        { time: '26 Sept 2026, 14:00', action: 'GLOBAL_RETENTION_RULE_SYNC', org: 'Platform Wide', user: 'Super Admin', hash: 'sha256:1a5c6e...' }
                      ].map((item, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.time}</td>
                          <td><strong>{item.action}</strong></td>
                          <td style={{ fontSize: '0.76rem' }}>{item.org}</td>
                          <td><span style={{ fontSize: '0.74rem', color: '#0f172a', fontWeight: '600' }}>{item.user}</span></td>
                          <td><code>{item.hash}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ======================= RIGHT COLUMN ======================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Retention Policy Health */}
          <div
            className="card-section"
            style={{
              margin: 0,
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Retention Policy Health
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('retention')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View All &rarr;
              </button>
            </div>

            {/* Donut Chart & Legend Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0' }}>
              
              {/* Radial Indicator / Donut */}
              <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                <svg width="100" height="100" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background ring */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.8"
                  />
                  {/* Green Compliant arc (96%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.8"
                    strokeDasharray="96, 100"
                    strokeLinecap="round"
                  />
                  {/* Small Amber At-Risk tip (4%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.8"
                    strokeDasharray="4, 100"
                    strokeDashoffset="-96"
                    strokeLinecap="round"
                  />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    lineHeight: 1
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>96%</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>Compliant</div>
                </div>
              </div>

              {/* Legend with Counts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: '#475569' }}>Compliant</span>
                  </div>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>17</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ color: '#475569' }}>At Risk</span>
                  </div>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>1</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ color: '#475569' }}>Non-Compliant</span>
                  </div>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>0</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
                    <span style={{ color: '#475569' }}>Not Evaluated</span>
                  </div>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>0</span>
                </div>
              </div>

            </div>

            {/* Bottom Link */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setActiveSubTab('retention')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All Policies <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Card 2: Recent Activity Feed */}
          <div
            className="card-section"
            style={{
              margin: 0,
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Recent Activity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('audit')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View All &rarr;
              </button>
            </div>

            {/* Activity Items Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentActivities.map(act => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: act.bg,
                        color: act.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <IconComponent size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px', lineHeight: 1.3 }}>
                        {act.desc}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
                        {act.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* =====================================================================
          4. FOOTER COMPLIANCE BAR
          ===================================================================== */}
      <div
        style={{
          marginTop: '28px',
          padding: '12px 18px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.74rem',
          color: '#64748b'
        }}
      >
        <div>
          <strong style={{ color: '#0f172a' }}>Data Governance</strong> • Protecting your data, powering your business.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <ShieldCheck size={14} color="#0284c7" /> ISO 27001
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <ShieldCheck size={14} color="#0284c7" /> GDPR
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <ShieldCheck size={14} color="#0284c7" /> SOC 2
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: '700' }}>
            ● Secure
          </span>
        </div>
      </div>

      {/* =====================================================================
          MODAL: VIEW TENANT GOVERNANCE INSPECTOR
          ===================================================================== */}
      {selectedTenantModal && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: selectedTenantModal.logoBg,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.72rem'
                  }}
                >
                  {selectedTenantModal.logoText.slice(0, 3)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>{selectedTenantModal.companyName}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{selectedTenantModal.id} • {selectedTenantModal.planTier}</span>
                </div>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedTenantModal(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '16px 0' }}>
              
              {/* Storage Telemetry Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#1e40af', fontWeight: '700' }}>ACTIVE DATA</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1d4ed8' }}>{selectedTenantModal.activeStorageGB} GB</div>
                </div>
                <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#6b21a8', fontWeight: '700' }}>ARCHIVED VAULT</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#7e22ce' }}>{selectedTenantModal.archivedStorageGB} GB</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#166534', fontWeight: '700' }}>TELEMETRY LOGS</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#15803d' }}>{selectedTenantModal.telemetryLogsGB} GB</div>
                </div>
              </div>

              {/* Policy & Security Checklist */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Assigned Retention Rule:</span>
                  <strong>{selectedTenantModal.retentionYears} ({selectedTenantModal.retentionPolicyType})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Next Compliance Review:</span>
                  <strong>{selectedTenantModal.nextReviewDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Cryptographic Vaulting:</span>
                  <strong style={{ color: '#16a34a' }}>{selectedTenantModal.encryptionStatus}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Snapshot Cadence:</span>
                  <strong>{selectedTenantModal.lastBackupTimestamp}</strong>
                </div>
              </div>

            </div>

            <div className="modal-actions-bar">
              <button type="button" className="cancel-btn" onClick={() => setSelectedTenantModal(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (showToast) showToast(`Compliance check verified for ${selectedTenantModal.companyName}`, 'success');
                  setSelectedTenantModal(null);
                }}
                style={{ background: '#0284c7' }}
              >
                Run Verification Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDIT RETENTION POLICY
          ===================================================================== */}
      {isEditPolicyModalOpen && editingPolicy && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Edit Retention Schedule</h3>
                <p>Modify retention rules for {editingPolicy.companyName}</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsEditPolicyModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSavePolicyEdit}>
              <div className="form-group">
                <label>Retention Duration</label>
                <select
                  className="form-control"
                  value={editingPolicy.retentionYears}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, retentionYears: e.target.value })}
                >
                  <option value="1 year">1 Year (Basic Field Records)</option>
                  <option value="3 years">3 Years (Telemetry &amp; Samples)</option>
                  <option value="5 years">5 Years (Standard Corporate Policy)</option>
                  <option value="7 years">7 Years (Custom High-Compliance)</option>
                  <option value="10 years">10 Years (FDA 21 CFR Master Archive)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Policy Classification Type</label>
                <select
                  className="form-control"
                  value={editingPolicy.retentionPolicyType}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, retentionPolicyType: e.target.value })}
                >
                  <option value="Standard Policy">Standard Policy</option>
                  <option value="Custom Policy">Custom Policy</option>
                  <option value="Regulatory Sovereign Vault">Regulatory Sovereign Vault</option>
                </select>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsEditPolicyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#0284c7' }}>
                  Save Policy Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONFIRM PERMANENT PURGE (2-STEP BARRIER)
          ===================================================================== */}
      {isQueuePurgeModalOpen && purgeTargetTenant && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '480px', borderTop: '4px solid #dc2626' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={22} color="#dc2626" />
                <h3 style={{ margin: 0, color: '#991b1b' }}>Authorize Permanent Shredding</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsQueuePurgeModalOpen(false)}>&times;</button>
            </div>

            <div style={{ margin: '14px 0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 10px' }}>
                You are about to irreversibly purge the following dataset from tenant: <strong>{purgeTargetTenant.tenantName}</strong>.
              </p>
              <div style={{ background: '#fef2f2', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fecaca', color: '#991b1b', marginBottom: '14px' }}>
                Scope: <strong>{purgeTargetTenant.scope}</strong>
              </div>
              <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#0f172a' }}>
                Type <code style={{ color: '#dc2626' }}>CONFIRM-PURGE</code> to proceed:
              </p>
              <input
                type="text"
                className="form-control"
                placeholder="CONFIRM-PURGE"
                value={purgeConfirmToken}
                onChange={(e) => setPurgeConfirmToken(e.target.value)}
              />
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="cancel-btn" onClick={() => setIsQueuePurgeModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExecutePurge}
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
              >
                Permanently Shred Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: TRIGGER COMPLIANCE EXPORT
          ===================================================================== */}
      {isExportModalOpen && exportTargetTenant && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Export Data Archive</h3>
                <p>Generate cryptographic compliance bundle for {exportTargetTenant.companyName}</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsExportModalOpen(false)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0' }}>
              <button
                type="button"
                className="card-section"
                onClick={() => handleTriggerExportSubmit('ZIP (JSON + CSV + Media Manifest)')}
                style={{
                  margin: 0,
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>Full Forensic Package (.ZIP)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>PostgreSQL Dumps, S3 Media Hashes, Audit Ledgers</span>
                </div>
                <Download size={16} color="#0284c7" />
              </button>

              <button
                type="button"
                className="card-section"
                onClick={() => handleTriggerExportSubmit('Tabular CSV Bundle')}
                style={{
                  margin: 0,
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>Tabular CSV Bundle (.CSV)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>DCR logs, Doctor Master records, Order histories</span>
                </div>
                <FileText size={16} color="#10b981" />
              </button>
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="cancel-btn" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
