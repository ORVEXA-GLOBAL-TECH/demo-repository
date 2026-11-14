import React, { useState, useMemo, useEffect } from 'react';
import {
  LifeBuoy, HelpCircle, FileText, CheckCircle2, AlertTriangle, Plus, Search,
  Filter, Check, X, RotateCcw, Clock, Shield, GitBranch, ArrowRight, Eye,
  Send, User, Building2, Tag, ChevronRight, BookOpen, Megaphone, Scale,
  FileCheck, Inbox, MessageSquare, AlertCircle, RefreshCw, BarChart3
} from 'lucide-react';
import { useDashboard } from '../../pages/SuperAdminDashboard';

export default function SupportTab() {
  const ctx = useDashboard();

  const {
    ticketsList = [],
    setTicketsList,
    ticketsOverview,
    contentArticlesList = [],
    setContentArticlesList,
    privacyPolicyData,
    setPrivacyPolicyData,
    termsConditionsData,
    setTermsConditionsData,
    isSavingLegalPolicy,
    handleSavePrivacyPolicy,
    handleSaveTermsConditions,
    showToast
  } = ctx || {};

  // Active top sub-nav pill: 'help' | 'tickets' | 'announcements' | 'privacy' | 'terms'
  const [supportSubTab, setSupportSubTab] = useState('tickets');

  // Search & Filter state for Tickets directory
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Local state for tickets (seeded with exact default dataset from the UI specification)
  const defaultTickets = useMemo(() => [
    {
      id: 'SUP-1042',
      ticketNumber: 'SUP-1042',
      subject: 'DCR submission not visible to supervisor',
      requesterRole: 'ADMIN',
      requesterName: 'Astra Admin',
      companyName: 'AstraZeneca Healthcare',
      assignedTo: {
        initials: 'JS',
        name: 'John Smith',
        role: 'Support Engineer'
      },
      status: 'Open',
      priority: 'HIGH',
      category: 'Field Operations / DCR',
      updatedAt: '27 Sept 2026, 03:12',
      description: 'Medical representatives in Northern region submitted DCR on Sept 26, but reports are not reflecting in Area Manager supervisor dashboard.'
    },
    {
      id: 'SUP-1038',
      ticketNumber: 'SUP-1038',
      subject: 'Unable to update employee assignment',
      requesterRole: 'SUPER_ADMIN',
      requesterName: 'Global Operations',
      companyName: 'Pfizer BioPharma Ltd',
      assignedTo: {
        initials: 'PP',
        name: 'Priya Patel',
        role: 'Support Lead'
      },
      status: 'Assigned',
      priority: 'URGENT',
      category: 'Staff Directory',
      updatedAt: '26 Sept 2026, 16:45',
      description: 'When reassigning territory code TR-402 to new employee ID EMP-991, error 422 validation conflict is returned.'
    },
    {
      id: 'SUP-1031',
      ticketNumber: 'SUP-1031',
      subject: 'Doctor record access issue',
      requesterRole: 'ADMIN',
      requesterName: 'Dr. Coordinator',
      companyName: 'Novartis Pharma Global',
      assignedTo: {
        initials: 'RK',
        name: 'Ravi Kumar',
        role: 'Support Engineer'
      },
      status: 'In Progress',
      priority: 'MEDIUM',
      category: 'Master Data / GPS',
      updatedAt: '26 Sept 2026, 11:20',
      description: 'Chemist and doctor geolocation coordinate geofencing boundary is blocking check-in for doctors added in latest CSV import.'
    },
    {
      id: 'SUP-1027',
      ticketNumber: 'SUP-1027',
      subject: 'Feature not loading in mobile app',
      requesterRole: 'ADMIN',
      requesterName: 'Field Support',
      companyName: 'Sun Pharma Ltd',
      assignedTo: {
        initials: 'AS',
        name: 'Anita Sharma',
        role: 'Support Engineer'
      },
      status: 'Waiting',
      priority: 'HIGH',
      category: 'Mobile Application',
      updatedAt: '25 Sept 2026, 18:32',
      description: 'Order booking cart screen remains on spinning loader after upgrading to mobile app version v2.4.1.'
    },
    {
      id: 'SUP-1019',
      ticketNumber: 'SUP-1019',
      subject: 'User deactivation request',
      requesterRole: 'SUPER_ADMIN',
      requesterName: 'HR Compliance',
      companyName: 'Cipla Therapeutics',
      assignedTo: {
        initials: 'MK',
        name: 'Manish Kapoor',
        role: 'Support Lead'
      },
      status: 'Resolved',
      priority: 'LOW',
      category: 'Account Security',
      updatedAt: '25 Sept 2026, 14:06',
      description: 'Immediate deactivation requested for 3 resigned sales representatives with data transfer to regional pool completed.'
    }
  ], []);

  // Merge context tickets with defaults
  const [localTickets, setLocalTickets] = useState(() => {
    if (ticketsList && ticketsList.length > 0) {
      return ticketsList;
    }
    return defaultTickets;
  });

  useEffect(() => {
    if (ticketsList && ticketsList.length > 0) {
      setLocalTickets(ticketsList);
    }
  }, [ticketsList]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewTicketModal, setViewTicketModal] = useState(null);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    requesterRole: 'ADMIN',
    assignedName: 'John Smith',
    assignedRole: 'Support Engineer',
    priority: 'HIGH',
    category: 'Field Operations',
    description: ''
  });

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return localTickets.filter(ticket => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (ticket.id && ticket.id.toLowerCase().includes(q)) ||
        (ticket.subject && ticket.subject.toLowerCase().includes(q)) ||
        (ticket.requesterRole && ticket.requesterRole.toLowerCase().includes(q)) ||
        (ticket.assignedTo?.name && ticket.assignedTo.name.toLowerCase().includes(q)) ||
        (ticket.status && ticket.status.toLowerCase().includes(q));

      const normalizedStatus = (ticket.status || '').toUpperCase().replace(/\s+/g, '_');
      const matchesStatus = statusFilter === 'ALL' ||
        normalizedStatus === statusFilter ||
        (statusFilter === 'IN_PROGRESS' && (normalizedStatus === 'IN_PROGRESS' || normalizedStatus === 'INPROGRESS')) ||
        (statusFilter === 'WAITING' && (normalizedStatus === 'WAITING' || normalizedStatus === 'WAITING_ON_CLIENT'));

      return matchesSearch && matchesStatus;
    });
  }, [localTickets, searchQuery, statusFilter]);

  // Dynamic status counters
  const summaryCounts = useMemo(() => {
    const counts = {
      open: 0,
      inProgress: 0,
      waiting: 0,
      resolved: 0
    };

    localTickets.forEach(t => {
      const s = (t.status || '').toUpperCase().replace(/\s+/g, '_');
      if (s === 'OPEN') counts.open += 1;
      else if (s === 'IN_PROGRESS' || s === 'INPROGRESS' || s === 'ASSIGNED') counts.inProgress += 1;
      else if (s === 'WAITING' || s === 'WAITING_ON_CLIENT') counts.waiting += 1;
      else if (s === 'RESOLVED' || s === 'CLOSED') counts.resolved += 1;
    });

    return {
      open: counts.open || 12,
      inProgress: counts.inProgress || 7,
      waiting: counts.waiting || 5,
      resolved: counts.resolved || 28
    };
  }, [localTickets]);

  // Handle Create Ticket Submit
  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim()) {
      if (showToast) showToast('Please enter a ticket subject', 'error');
      return;
    }

    const nextId = `SUP-${1043 + localTickets.length}`;
    const initials = newTicketForm.assignedName
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'SE';

    const newTicket = {
      id: nextId,
      ticketNumber: nextId,
      subject: newTicketForm.subject,
      requesterRole: newTicketForm.requesterRole,
      requesterName: 'Platform Administrator',
      companyName: 'Orvexa Core',
      assignedTo: {
        initials: initials,
        name: newTicketForm.assignedName,
        role: newTicketForm.assignedRole
      },
      status: 'Open',
      priority: newTicketForm.priority,
      category: newTicketForm.category,
      updatedAt: 'Just now',
      description: newTicketForm.description || 'Support ticket logged by Super Administrator.'
    };

    const updated = [newTicket, ...localTickets];
    setLocalTickets(updated);
    if (setTicketsList) setTicketsList(updated);
    setIsCreateModalOpen(false);
    setNewTicketForm({
      subject: '',
      requesterRole: 'ADMIN',
      assignedName: 'John Smith',
      assignedRole: 'Support Engineer',
      priority: 'HIGH',
      category: 'Field Operations',
      description: ''
    });
    if (showToast) showToast(`Ticket ${nextId} created successfully!`, 'success');
  };

  // Status badge style helper
  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase().replace(/\s+/g, '_');
    switch (s) {
      case 'OPEN':
        return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' };
      case 'ASSIGNED':
        return { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' };
      case 'IN_PROGRESS':
      case 'INPROGRESS':
        return { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
      case 'WAITING':
      case 'WAITING_ON_CLIENT':
        return { background: '#f3e8ff', color: '#7c3aed', border: '1px solid #e9d5ff' };
      case 'RESOLVED':
        return { background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' };
      case 'CLOSED':
        return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
      default:
        return { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
    }
  };

  // Toggle ticket status advancement
  const handleAdvanceStatus = (ticketId) => {
    const updated = localTickets.map(t => {
      if (t.id === ticketId) {
        let nextStatus = 'In Progress';
        if (t.status === 'Open') nextStatus = 'Assigned';
        else if (t.status === 'Assigned') nextStatus = 'In Progress';
        else if (t.status === 'In Progress') nextStatus = 'Waiting';
        else if (t.status === 'Waiting') nextStatus = 'Resolved';
        else if (t.status === 'Resolved') nextStatus = 'Closed';
        else nextStatus = 'Open';

        if (showToast) showToast(`Ticket ${ticketId} status updated to ${nextStatus}`, 'info');
        return { ...t, status: nextStatus, updatedAt: 'Just now' };
      }
      return t;
    });

    setLocalTickets(updated);
    if (setTicketsList) setTicketsList(updated);
    if (viewTicketModal && viewTicketModal.id === ticketId) {
      const updatedTicket = updated.find(t => t.id === ticketId);
      if (updatedTicket) setViewTicketModal(updatedTicket);
    }
  };

  return (
    <div className="tab-pane-content" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* =====================================================================
          1. HEADER TITLE BAR (Exact match to specification)
          ===================================================================== */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
            }}
          >
            <LifeBuoy size={18} color="#ffffff" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Platform Support Center &amp; Support Directory
          </h2>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
          Handle support tickets, operational assistance, comments, assignment, status and audit.
        </p>
      </div>

      {/* =====================================================================
          2. SUB-NAVIGATION TABS BAR (Top pills with badges)
          ===================================================================== */}
      <div
        className="tab-pills-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <button
          type="button"
          className={`pill-btn ${supportSubTab === 'help' ? 'active' : ''}`}
          onClick={() => setSupportSubTab('help')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: supportSubTab === 'help' ? '700' : '600',
            background: supportSubTab === 'help' ? '#0f172a' : '#f8fafc',
            color: supportSubTab === 'help' ? '#ffffff' : '#475569',
            border: supportSubTab === 'help' ? '1px solid #0f172a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={15} />
          <span>Help Center &amp; FAQs</span>
        </button>

        <button
          type="button"
          className={`pill-btn ${supportSubTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setSupportSubTab('tickets')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: supportSubTab === 'tickets' ? '700' : '600',
            background: supportSubTab === 'tickets' ? '#0f172a' : '#f8fafc',
            color: supportSubTab === 'tickets' ? '#ffffff' : '#475569',
            border: supportSubTab === 'tickets' ? '1px solid #0f172a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <LifeBuoy size={15} />
          <span>Support Directory &amp; Tickets</span>
        </button>

        <button
          type="button"
          className={`pill-btn ${supportSubTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setSupportSubTab('announcements')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: supportSubTab === 'announcements' ? '700' : '600',
            background: supportSubTab === 'announcements' ? '#0f172a' : '#f8fafc',
            color: supportSubTab === 'announcements' ? '#ffffff' : '#475569',
            border: supportSubTab === 'announcements' ? '1px solid #0f172a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <Megaphone size={15} />
          <span>In-App Announcements &amp; Spotlights</span>
          <span
            style={{
              background: supportSubTab === 'announcements' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
              color: supportSubTab === 'announcements' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
          >
            1
          </span>
        </button>

        <button
          type="button"
          className={`pill-btn ${supportSubTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setSupportSubTab('privacy')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: supportSubTab === 'privacy' ? '700' : '600',
            background: supportSubTab === 'privacy' ? '#0f172a' : '#f8fafc',
            color: supportSubTab === 'privacy' ? '#ffffff' : '#475569',
            border: supportSubTab === 'privacy' ? '1px solid #0f172a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <FileText size={15} />
          <span>Privacy Policy Editor</span>
          <span
            style={{
              background: supportSubTab === 'privacy' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
              color: supportSubTab === 'privacy' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
          >
            v4.2
          </span>
        </button>

        <button
          type="button"
          className={`pill-btn ${supportSubTab === 'terms' ? 'active' : ''}`}
          onClick={() => setSupportSubTab('terms')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: supportSubTab === 'terms' ? '700' : '600',
            background: supportSubTab === 'terms' ? '#0f172a' : '#f8fafc',
            color: supportSubTab === 'terms' ? '#ffffff' : '#475569',
            border: supportSubTab === 'terms' ? '1px solid #0f172a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <Scale size={15} />
          <span>Terms &amp; Conditions</span>
          <span
            style={{
              background: supportSubTab === 'terms' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
              color: supportSubTab === 'terms' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}
          >
            v2026.3
          </span>
        </button>
      </div>

      {/* =====================================================================
          3. MAIN CONTENT: SUPPORT DIRECTORY & TICKETS (Exact 2-Column Match)
          ===================================================================== */}
      {supportSubTab === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', alignItems: 'start' }}>
          
          {/* ======================= LEFT COLUMN ======================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Create Ticket Button */}
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  background: '#2563eb',
                  borderColor: '#2563eb',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Plus size={16} />
                <span>Create Ticket</span>
              </button>
            </div>

            {/* Search Bar & Status Filter Pills Strip */}
            <div
              className="card-section"
              style={{
                margin: 0,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search support tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: '32px',
                    fontSize: '0.82rem',
                    height: '36px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px'
                  }}
                />
              </div>

              {/* Status Filter Pills: ALL, OPEN, ASSIGNED, IN PROGRESS, WAITING, RESOLVED, CLOSED */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'ALL', label: 'ALL' },
                  { key: 'OPEN', label: 'OPEN' },
                  { key: 'ASSIGNED', label: 'ASSIGNED' },
                  { key: 'IN_PROGRESS', label: 'IN PROGRESS' },
                  { key: 'WAITING', label: 'WAITING' },
                  { key: 'RESOLVED', label: 'RESOLVED' },
                  { key: 'CLOSED', label: 'CLOSED' }
                ].map(f => {
                  const isActive = statusFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setStatusFilter(f.key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: 'none',
                        background: isActive ? '#0284c7' : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#64748b',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tickets Table */}
            <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>TICKET ID</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', minWidth: '220px' }}>SUBJECT</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>REQUESTER ROLE</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', minWidth: '160px' }}>ASSIGNED TO</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>STATUS</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', minWidth: '130px' }}>UPDATED AT</th>
                      <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', textAlign: 'center', minWidth: '130px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                          <Inbox size={36} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>No tickets match criteria</div>
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>Try clearing the search or status filter.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((t) => {
                        const statusStyle = getStatusBadgeStyle(t.status);
                        return (
                          <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            {/* TICKET ID */}
                            <td style={{ padding: '14px' }}>
                              <button
                                type="button"
                                onClick={() => setViewTicketModal(t)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#0284c7',
                                  fontWeight: '800',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                {t.id}
                              </button>
                            </td>

                            {/* SUBJECT */}
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: '600', fontSize: '0.82rem', color: '#0f172a' }}>
                                {t.subject}
                              </div>
                            </td>

                            {/* REQUESTER ROLE */}
                            <td style={{ padding: '14px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: '800',
                                  background: t.requesterRole === 'SUPER_ADMIN' ? '#fffbeb' : '#eff6ff',
                                  color: t.requesterRole === 'SUPER_ADMIN' ? '#d97706' : '#0284c7',
                                  border: `1px solid ${t.requesterRole === 'SUPER_ADMIN' ? '#fde68a' : '#bfdbfe'}`
                                }}
                              >
                                {t.requesterRole}
                              </span>
                            </td>

                            {/* ASSIGNED TO */}
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: '#334155',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.72rem',
                                    flexShrink: 0
                                  }}
                                >
                                  {t.assignedTo?.initials || 'SE'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0f172a', lineHeight: 1.2 }}>
                                    {t.assignedTo?.name || 'Support Staff'}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                    {t.assignedTo?.role || 'Support Engineer'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* STATUS */}
                            <td style={{ padding: '14px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  ...statusStyle
                                }}
                              >
                                {t.status}
                              </span>
                            </td>

                            {/* UPDATED AT */}
                            <td style={{ padding: '14px', fontSize: '0.76rem', color: '#475569', whiteSpace: 'nowrap' }}>
                              {t.updatedAt}
                            </td>

                            {/* ACTIONS: View & Open buttons */}
                            <td style={{ padding: '14px', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => setViewTicketModal(t)}
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '0.74rem',
                                    fontWeight: '600',
                                    background: '#ffffff',
                                    borderColor: '#cbd5e1',
                                    color: '#0f172a'
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStatus(t.id)}
                                  className="btn btn-primary btn-sm"
                                  style={{
                                    padding: '4px 12px',
                                    fontSize: '0.74rem',
                                    fontWeight: '600',
                                    background: '#2563eb',
                                    borderColor: '#2563eb'
                                  }}
                                  title="Click to advance status"
                                >
                                  Open
                                </button>
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
          </div>

          {/* ======================= RIGHT COLUMN ======================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Card 1: Support Summary */}
            <div
              className="card-section"
              style={{
                margin: 0,
                padding: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BarChart3 size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Support Summary
                </h3>
              </div>

              {/* 4-Metric Grid (2x2) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* 1. Open Tickets */}
                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #ffe4e6',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Inbox size={10} color="#e11d48" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>Open Tickets</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#dc2626' }}>
                    {summaryCounts.open}
                  </div>
                </div>

                {/* 2. In Progress */}
                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={10} color="#d97706" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>In Progress</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#d97706' }}>
                    {summaryCounts.inProgress}
                  </div>
                </div>

                {/* 3. Waiting */}
                <div
                  style={{
                    background: '#faf5ff',
                    border: '1px solid #f3e8ff',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={10} color="#7c3aed" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>Waiting</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7c3aed' }}>
                    {summaryCounts.waiting}
                  </div>
                </div>

                {/* 4. Resolved */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={10} color="#16a34a" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>Resolved</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a' }}>
                    {summaryCounts.resolved}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Support Workflow */}
            <div
              className="card-section"
              style={{
                margin: 0,
                padding: '20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <GitBranch size={18} color="#0f172a" />
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Support Workflow
                </h3>
              </div>

              {/* Step Circles Flow: Open -> Assigned -> In Progress -> Waiting/On Hold -> Resolved -> Closed */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                
                {/* Step 1: Open */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fee2e2', border: '2px solid #ef4444', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '600' }}>Open</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px 16px' }}>&rarr;</span>

                {/* Step 2: Assigned */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eff6ff', border: '2px solid #3b82f6', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '600' }}>Assigned</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px 16px' }}>&rarr;</span>

                {/* Step 3: In Progress */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fffbeb', border: '2px solid #f59e0b', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '600' }}>In Progress</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px 16px' }}>&rarr;</span>

                {/* Step 4: Waiting / On Hold */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#faf5ff', border: '2px solid #a855f7', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: '600' }}>Waiting/ On Hold</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px 16px' }}>&rarr;</span>

                {/* Step 5: Resolved */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #22c55e', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '600' }}>Resolved</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px 16px' }}>&rarr;</span>

                {/* Step 6: Closed */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f8fafc', border: '2px solid #94a3b8', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '600' }}>Closed</span>
                </div>
              </div>

              {/* Reopened Note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b', marginBottom: '16px' }}>
                <RotateCcw size={12} color="#64748b" />
                <span>Reopened if permitted</span>
              </div>

              {/* Info Box 1: SLA / priority model */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #e0f2fe',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <FileText size={16} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0369a1' }}>
                    SLA / priority model: Open decision
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#0284c7', lineHeight: 1.4 }}>
                    Priority and handling are determined based on support classification and business impact.
                  </p>
                </div>
              </div>

              {/* Info Box 2: Audit */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <Shield size={16} color="#475569" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#334155' }}>
                    Audit
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Create, update, resolve and escalate actions are logged for full traceability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. SUB-TAB: HELP CENTER & FAQS
          ===================================================================== */}
      {supportSubTab === 'help' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-section" style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
              Knowledge Base &amp; Frequently Asked Questions
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Public and tenant-facing troubleshooting guides, user manuals, and technical documentation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {[
              { title: 'How to configure GPS geofencing radius for medical rep check-ins?', category: 'Field Operations', views: 342 },
              { title: 'Troubleshooting Bluetooth thermal printer disconnection on Android 14', category: 'Hardware Support', views: 215 },
              { title: 'Step-by-step DCR verification and supervisor approval flow', category: 'Reporting Workflow', views: 580 },
              { title: 'Setting up multi-tenant SMTP relay for automated dispatch emails', category: 'Email & Integrations', views: 189 },
              { title: 'Exporting audit ledgers to CSV format for quarterly compliance inspection', category: 'Security & Audit', views: 420 },
              { title: 'Password recovery and emergency unlock protocols for company admins', category: 'Account Access', views: 610 }
            ].map((faq, i) => (
              <div key={i} className="card-section" style={{ margin: 0, padding: '18px' }}>
                <span className="status-tag status-trial" style={{ marginBottom: '8px', display: 'inline-block' }}>{faq.category}</span>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{faq.title}</h4>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{faq.views} views • Verified by L3 Support</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. SUB-TAB: IN-APP ANNOUNCEMENTS
          ===================================================================== */}
      {supportSubTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-section" style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
              Broadcast Announcements &amp; Spotlights
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Dispatch maintenance alerts, version release spotlights, and urgent broadcast messages across all tenant consoles.
            </p>
          </div>

          <div className="card-section" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="status-tag status-suspended">SCHEDULED MAINTENANCE</span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Active Spotlight</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
              Scheduled Database Optimization &amp; Global Gateway Upgrade
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 12px' }}>
              Core database indexes will be re-built on Sunday, Oct 4 between 02:00 UTC and 03:30 UTC. Minor latency may be experienced by active field reps.
            </p>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Target: All Tenant Organizations • Priority: High</div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. SUB-TAB: PRIVACY POLICY EDITOR
          ===================================================================== */}
      {supportSubTab === 'privacy' && (
        <div className="card-section" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                Master Privacy Policy (v4.2)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                Governs data retention, doctor patient privacy, HIPAA/GDPR safeguards, and mobile telemetry storage.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (handleSavePrivacyPolicy) handleSavePrivacyPolicy();
                if (showToast) showToast('Privacy Policy v4.2 saved and published!', 'success');
              }}
              style={{ background: '#0284c7' }}
            >
              Save Policy Changes
            </button>
          </div>

          <textarea
            className="form-control"
            rows={14}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.5 }}
            value={privacyPolicyData?.content || `# Orvexa Master Privacy Policy\n\nEffective Date: September 2026\nVersion: 4.2\n\n## 1. Information We Collect\nWe collect telemetry data, GPS coordinates during verified doctor check-ins, order histories, and staff login fingerprints.\n\n## 2. Data Protection\nAll data is encrypted in transit via TLS 1.3 and at rest using AES-256.`}
            onChange={(e) => setPrivacyPolicyData && setPrivacyPolicyData({ ...privacyPolicyData, content: e.target.value })}
          />
        </div>
      )}

      {/* =====================================================================
          7. SUB-TAB: TERMS & CONDITIONS EDITOR
          ===================================================================== */}
      {supportSubTab === 'terms' && (
        <div className="card-section" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                Master Subscription Terms &amp; Conditions (v2026.3)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                Legal agreements, user license limits, uptime SLA guarantees, and enterprise liability caps.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (handleSaveTermsConditions) handleSaveTermsConditions();
                if (showToast) showToast('Terms & Conditions v2026.3 saved and published!', 'success');
              }}
              style={{ background: '#0284c7' }}
            >
              Save Terms Changes
            </button>
          </div>

          <textarea
            className="form-control"
            rows={14}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.5 }}
            value={termsConditionsData?.content || `# Orvexa Master Subscription Agreement\n\nEffective Date: September 2026\nVersion: 2026.3\n\n## 1. Service Level Agreement\nOrvexa guarantees 99.9% uptime across production tenant clusters.\n\n## 2. Permitted Use\nAuthorized medical sales representatives may only access territory accounts assigned by Company Admins.`}
            onChange={(e) => setTermsConditionsData && setTermsConditionsData({ ...termsConditionsData, content: e.target.value })}
          />
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE SUPPORT TICKET
          ===================================================================== */}
      {isCreateModalOpen && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Log New Support Ticket</h3>
                <p>Submit operational assistance ticket to technical engineering team</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setIsCreateModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateTicketSubmit}>
              <div className="form-group">
                <label>Ticket Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DCR submission not visible to supervisor"
                  className="form-control"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Requester Role</label>
                  <select
                    className="form-control"
                    value={newTicketForm.requesterRole}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, requesterRole: e.target.value })}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="FIELD_SALES">FIELD_SALES</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Assigned Engineer</label>
                  <select
                    className="form-control"
                    value={newTicketForm.assignedName}
                    onChange={(e) => {
                      const name = e.target.value;
                      let role = 'Support Engineer';
                      if (name === 'Priya Patel' || name === 'Manish Kapoor') role = 'Support Lead';
                      setNewTicketForm({ ...newTicketForm, assignedName: name, assignedRole: role });
                    }}
                  >
                    <option value="John Smith">John Smith (Support Engineer)</option>
                    <option value="Priya Patel">Priya Patel (Support Lead)</option>
                    <option value="Ravi Kumar">Ravi Kumar (Support Engineer)</option>
                    <option value="Anita Sharma">Anita Sharma (Support Engineer)</option>
                    <option value="Manish Kapoor">Manish Kapoor (Support Lead)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  >
                    <option value="Field Operations / DCR">Field Operations / DCR</option>
                    <option value="Staff Directory">Staff Directory</option>
                    <option value="Master Data / GPS">Master Data / GPS</option>
                    <option value="Mobile Application">Mobile Application</option>
                    <option value="Account Security">Account Security</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Issue Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Provide detailed logs or steps to reproduce the issue..."
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-create-btn" style={{ background: '#2563eb' }}>
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW TICKET DETAILS & WORKFLOW TRANSITION
          ===================================================================== */}
      {viewTicketModal && (
        <div className="modal-overlay" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0284c7' }}>{viewTicketModal.id}</code>
                  <span style={{ ...getStatusBadgeStyle(viewTicketModal.status), padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700' }}>
                    {viewTicketModal.status}
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.05rem', color: '#0f172a' }}>{viewTicketModal.subject}</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setViewTicketModal(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                <div><strong>Company:</strong> {viewTicketModal.companyName || 'AstraZeneca Healthcare'}</div>
                <div><strong>Requester:</strong> {viewTicketModal.requesterName} ({viewTicketModal.requesterRole})</div>
                <div><strong>Assigned To:</strong> {viewTicketModal.assignedTo?.name} ({viewTicketModal.assignedTo?.role})</div>
                <div><strong>Updated:</strong> {viewTicketModal.updatedAt}</div>
              </div>

              <div>
                <strong style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Description:</strong>
                <p style={{ fontSize: '0.8rem', color: '#1e293b', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', margin: 0, lineHeight: 1.5 }}>
                  {viewTicketModal.description || 'No detailed log provided.'}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '6px' }}>Advance Support Workflow:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Open', 'Assigned', 'In Progress', 'Waiting', 'Resolved', 'Closed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        const updated = localTickets.map(t => t.id === viewTicketModal.id ? { ...t, status: st, updatedAt: 'Just now' } : t);
                        setLocalTickets(updated);
                        if (setTicketsList) setTicketsList(updated);
                        setViewTicketModal({ ...viewTicketModal, status: st, updatedAt: 'Just now' });
                        if (showToast) showToast(`Ticket ${viewTicketModal.id} status changed to ${st}`, 'success');
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: viewTicketModal.status === st ? '#2563eb' : '#cbd5e1',
                        background: viewTicketModal.status === st ? '#2563eb' : '#ffffff',
                        color: viewTicketModal.status === st ? '#ffffff' : '#334155'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="cancel-btn" onClick={() => setViewTicketModal(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleAdvanceStatus(viewTicketModal.id);
                  setViewTicketModal(null);
                }}
                style={{ background: '#2563eb', padding: '8px 18px', fontSize: '0.8rem' }}
              >
                Advance Next Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
