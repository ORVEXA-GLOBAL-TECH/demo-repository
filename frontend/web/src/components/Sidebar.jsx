import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Receipt,
  BookOpen,
  CalendarCheck,
  Radio,
  Clock,
  TrendingUp,
  Sparkles,
  FileCode2,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

// Role-Specific Navigation Architecture per Enterprise Master Specification
export const getNavSections = (role) => {
    switch (role) {
      case 'DIRECTOR':
        return [
          {
            group: 'Strategic Oversight',
            items: [
              { id: 'dashboard', label: 'Executive Intelligence', icon: LayoutDashboard },
              { id: 'zones', label: 'Zonal Performance', icon: Globe2 }
            ]
          },
          {
            group: 'Sales & Revenue',
            items: [
              { id: 'sales', label: 'Company Sales', icon: ShoppingCart },
              { id: 'achievement', label: 'Quota Leaderboard', icon: TrendingUp },
              { id: 'targets', label: 'Target Quotas', icon: TrendingUp }
            ]
          },
          {
            group: 'Portfolio & Market',
            items: [
              { id: 'products', label: 'Product Portfolio', icon: BookOpen },
              { id: 'divisions', label: 'Therapeutic Divisions', icon: BookOpen },
              { id: 'competitors', label: 'Competitor Intelligence', icon: Sparkles }
            ]
          },
          {
            group: 'Healthcare Coverage',
            items: [
              { id: 'doctors', label: 'Doctor Coverage', icon: BookOpen },
              { id: 'hospitals', label: 'Institutions & Hospitals', icon: Building2 }
            ]
          },
          {
            group: 'Governance & Insights',
            items: [
              { id: 'approvals', label: 'Strategic Approvals', icon: CheckCircle2 },
              { id: 'standard-reports', label: 'Executive Reports', icon: TrendingUp },
              { id: 'analytics', label: 'Business Analytics', icon: Sparkles },
              { id: 'training', label: 'LMS Academy', icon: BookOpen }
            ]
          }
        ];

      case 'ACCOUNTANT':
        return [
          {
            group: 'Financial Core',
            items: [
              { id: 'dashboard', label: 'Finance & Claims', icon: LayoutDashboard }
            ]
          },
          {
            group: 'Expense Claims',
            items: [
              { id: 'claims', label: 'Expense Claims', icon: Receipt },
              { id: 'expense-approvals', label: 'Verification Queue', icon: CheckCircle2 },
              { id: 'policies', label: 'Allowance Policies', icon: Receipt }
            ]
          },
          {
            group: 'Commercial Visibility',
            items: [
              { id: 'orders', label: 'Chemist Orders', icon: ShoppingCart },
              { id: 'sales', label: 'Sales Invoicing', icon: ShoppingCart }
            ]
          },
          {
            group: 'Reporting & Audit',
            items: [
              { id: 'standard-reports', label: 'Financial Reports', icon: TrendingUp },
              { id: 'custom-reports', label: 'Custom Export Builder', icon: TrendingUp },
              { id: 'audit-logs', label: 'Financial Audit Trail', icon: ShieldCheck }
            ]
          }
        ];

      case 'MANAGER':
        return [
          {
            group: 'Team Command',
            items: [
              { id: 'dashboard', label: 'Team Command Center', icon: LayoutDashboard }
            ]
          },
          {
            group: 'My Team',
            items: [
              { id: 'employees', label: 'Team Workforce', icon: ShieldCheck },
              { id: 'mr-supervisors', label: 'Area Supervisors', icon: ShieldCheck },
              { id: 'mrs', label: 'Medical Reps (MRs)', icon: ShieldCheck }
            ]
          },
          {
            group: 'Team Field Operations',
            items: [
              { id: 'tour-plan', label: 'Team Tour Plans', icon: CalendarCheck },
              { id: 'visits', label: 'Field Visits Log', icon: ClipboardList },
              { id: 'dcr', label: 'Team DCR Review', icon: ClipboardList },
              { id: 'tracking', label: 'Live GPS Tracking', icon: Radio }
            ]
          },
          {
            group: 'Team Attendance & HR',
            items: [
              { id: 'attendance', label: 'Daily Attendance', icon: Clock },
              { id: 'leave', label: 'Leave Requests', icon: Clock }
            ]
          },
          {
            group: 'Sales & Quota',
            items: [
              { id: 'targets', label: 'Team Quotas', icon: TrendingUp },
              { id: 'sales', label: 'Team Sales', icon: ShoppingCart },
              { id: 'orders', label: 'POB Orders', icon: ShoppingCart }
            ]
          },
          {
            group: 'Team Approvals & Reports',
            items: [
              { id: 'approvals', label: 'Team Approvals', icon: CheckCircle2 },
              { id: 'expense-approvals', label: 'Expense Queue', icon: Receipt },
              { id: 'standard-reports', label: 'Team Reports', icon: TrendingUp }
            ]
          }
        ];

      case 'SALES_MANAGER':
        return [
          {
            group: 'Commercial Cockpit',
            items: [
              { id: 'dashboard', label: 'Commercial Cockpit', icon: LayoutDashboard }
            ]
          },
          {
            group: 'Sales & Orders',
            items: [
              { id: 'sales', label: 'Sales Performance', icon: ShoppingCart },
              { id: 'orders', label: 'Chemist POB Orders', icon: ShoppingCart },
              { id: 'achievement', label: 'Rep Leaderboard', icon: TrendingUp }
            ]
          },
          {
            group: 'Commercial Quotas',
            items: [
              { id: 'targets', label: 'Target Quotas', icon: TrendingUp }
            ]
          },
          {
            group: 'Product Portfolio',
            items: [
              { id: 'products', label: 'Products Master', icon: BookOpen },
              { id: 'divisions', label: 'Therapeutic Divisions', icon: BookOpen },
              { id: 'categories', label: 'Categories', icon: BookOpen },
              { id: 'competitors', label: 'Competitor Intelligence', icon: Sparkles }
            ]
          },
          {
            group: 'Approvals & Analytics',
            items: [
              { id: 'approvals', label: 'Commercial Approvals', icon: CheckCircle2 },
              { id: 'standard-reports', label: 'Sales Reports', icon: TrendingUp },
              { id: 'analytics', label: 'Commercial Analytics', icon: Sparkles }
            ]
          }
        ];

      case 'MR_SUPERVISOR':
      case 'SALES_SUPERVISOR':
        return [
          {
            group: 'Field Supervision',
            items: [
              { id: 'dashboard', label: 'Supervision Center', icon: LayoutDashboard }
            ]
          },
          {
            group: 'Supervised Team',
            items: [
              { id: 'mrs', label: 'Assigned MRs', icon: ShieldCheck },
              { id: 'attendance', label: 'Rep Attendance Logs', icon: Clock },
              { id: 'tracking', label: 'Live Rep GPS', icon: Radio }
            ]
          },
          {
            group: 'Field Call Verification',
            items: [
              { id: 'dcr', label: 'DCR Review Queue', icon: ClipboardList },
              { id: 'visits', label: 'Field Visits Log', icon: ClipboardList },
              { id: 'tour-plan', label: 'Beat Tour Plans', icon: CalendarCheck }
            ]
          },
          {
            group: 'Field Customer Base',
            items: [
              { id: 'doctors', label: 'Doctor Directory', icon: BookOpen },
              { id: 'chemists', label: 'Chemist Network', icon: BookOpen },
              { id: 'hospitals', label: 'Hospitals', icon: Building2 }
            ]
          },
          {
            group: 'Field Assets & Approvals',
            items: [
              { id: 'approvals', label: 'Field Approvals', icon: CheckCircle2 },
              { id: 'expense-approvals', label: 'Expense Review', icon: Receipt },
              { id: 'inventory', label: 'Sample Ledger', icon: BookOpen },
              { id: 'distribution', label: 'Sample Distribution', icon: BookOpen }
            ]
          },
          {
            group: 'Supervision Reports',
            items: [
              { id: 'standard-reports', label: 'Field Reports', icon: TrendingUp }
            ]
          }
        ];

      case 'MR':
        return [
          {
            group: 'Field Execution',
            items: [
              { id: 'dashboard', label: "Today's Call Plan", icon: LayoutDashboard }
            ]
          },
          {
            group: "Today's Field Work",
            items: [
              { id: 'visits', label: 'In-Clinic Visits', icon: ClipboardList },
              { id: 'dcr', label: 'Daily Call Report (DCR)', icon: ClipboardList },
              { id: 'tour-plan', label: 'My Tour Beat Plan', icon: CalendarCheck }
            ]
          },
          {
            group: 'Assigned Customers',
            items: [
              { id: 'doctors', label: 'My Doctors', icon: BookOpen },
              { id: 'chemists', label: 'My Chemists', icon: BookOpen },
              { id: 'hospitals', label: 'My Hospitals', icon: Building2 }
            ]
          },
          {
            group: 'Orders & Targets',
            items: [
              { id: 'orders', label: 'Book POB Order', icon: ShoppingCart },
              { id: 'targets', label: 'My Target & Quota', icon: TrendingUp }
            ]
          },
          {
            group: 'Expenses & Assets',
            items: [
              { id: 'claims', label: 'Daily Expense (TA/DA)', icon: Receipt },
              { id: 'inventory', label: 'My Sample Bag', icon: BookOpen },
              { id: 'distribution', label: 'Physician Samples Given', icon: BookOpen }
            ]
          },
          {
            group: 'Attendance & Leave',
            items: [
              { id: 'attendance', label: 'Daily Check-In/Out', icon: Clock },
              { id: 'leave', label: 'My Leave Requests', icon: Clock }
            ]
          }
        ];

      case 'ADMIN':
      default:
        return [
          {
            group: 'Core',
            items: [
              { id: 'dashboard', label: 'Operational Dashboard', icon: LayoutDashboard }
            ]
          },
          {
            group: 'Organization',
            items: [
              { id: 'hierarchy', label: 'Hierarchy Tree', icon: Building2 },
              { id: 'zones', label: 'Zones', icon: Globe2 },
              { id: 'regions', label: 'Regions', icon: Globe2 },
              { id: 'areas', label: 'Areas', icon: Globe2 },
              { id: 'territories', label: 'Territories', icon: Globe2 },
              { id: 'headquarters', label: 'Headquarters', icon: Building2 }
            ]
          },
          {
            group: 'Workforce',
            items: [
              { id: 'employees', label: 'All Employees', icon: ShieldCheck },
              { id: 'managers', label: 'Managers', icon: ShieldCheck },
              { id: 'mr-supervisors', label: 'MR Supervisors', icon: ShieldCheck },
              { id: 'mrs', label: 'Medical Reps (MRs)', icon: ShieldCheck }
            ]
          },
          {
            group: 'Masters',
            items: [
              { id: 'doctors', label: 'Doctors Master', icon: BookOpen },
              { id: 'chemists', label: 'Chemists Network', icon: BookOpen },
              { id: 'hospitals', label: 'Hospitals Directory', icon: Building2 },
              { id: 'products', label: 'Products & Pricing', icon: BookOpen },
              { id: 'divisions', label: 'Product Divisions', icon: BookOpen },
              { id: 'competitors', label: 'Competitors', icon: BookOpen }
            ]
          },
          {
            group: 'Field Operations',
            items: [
              { id: 'tour-plan', label: 'Tour Plans', icon: CalendarCheck },
              { id: 'visits', label: 'Visits 360°', icon: ClipboardList },
              { id: 'dcr', label: 'DCR Review', icon: ClipboardList },
              { id: 'tracking', label: 'GPS Tracking', icon: Radio }
            ]
          },
          {
            group: 'HR & Attendance',
            items: [
              { id: 'attendance', label: 'Attendance', icon: Clock },
              { id: 'leave', label: 'Leave Requests', icon: Clock },
              { id: 'holidays', label: 'Holidays Calendar', icon: Clock }
            ]
          },
          {
            group: 'Commercial',
            items: [
              { id: 'targets', label: 'Targets & Quotas', icon: TrendingUp },
              { id: 'achievement', label: 'Leaderboard', icon: TrendingUp },
              { id: 'orders', label: 'Orders (POB)', icon: ShoppingCart },
              { id: 'sales', label: 'Sales Performance', icon: ShoppingCart }
            ]
          },
          {
            group: 'Expenses',
            items: [
              { id: 'claims', label: 'Claims Ledger', icon: Receipt },
              { id: 'expense-approvals', label: 'Approvals Queue', icon: CheckCircle2 },
              { id: 'policies', label: 'Expense Policies', icon: Receipt }
            ]
          },
          {
            group: 'Samples & Visual Aids',
            items: [
              { id: 'inventory', label: 'Sample Ledger', icon: BookOpen },
              { id: 'allocation', label: 'Sample Allocation', icon: BookOpen },
              { id: 'distribution', label: 'Distribution Log', icon: BookOpen }
            ]
          },
          {
            group: 'Reports & Governance',
            items: [
              { id: 'standard-reports', label: 'Standard Reports', icon: TrendingUp },
              { id: 'custom-reports', label: 'Custom Reports', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics Studio', icon: Sparkles },
              { id: 'approvals', label: 'Unified Approvals', icon: CheckCircle2 },
              { id: 'settings', label: 'Company Settings', icon: ShieldCheck },
              { id: 'audit-logs', label: 'Enterprise Audit Trail', icon: ShieldCheck },
              { id: 'training', label: 'MR LMS Training', icon: BookOpen },
              { id: 'ai-tools', label: 'AI Studio', icon: Sparkles }
            ]
          }
        ];
    }
  };

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [logoError, setLogoError] = useState(false);

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const logoUrl = activeTenant?.logo_url || activeTenant?.logoUrl;
  const companyName = activeTenant?.name || 'Alleviare Health Sciences';
  const companyCode = (activeTenant?.code || 'HQ').toUpperCase();
  const planTier = activeTenant?.plan || 'ENTERPRISE';

  const navSections = getNavSections(role);

  return (
    <aside className="sidebar">
      {/* Dynamic Company Branding Header */}
      <div className="sidebar-header" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        {logoUrl && !logoError ? (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 14px ${brandColor}55`,
              border: `1.5px solid ${brandColor}40`,
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            <img
              src={logoUrl}
              alt={companyName}
              onError={() => setLogoError(true)}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div
            className="brand-badge"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, #090d16)`,
              boxShadow: `0 4px 14px ${brandColor}60`,
              border: `1.5px solid ${brandColor}60`,
              flexShrink: 0
            }}
          >
            {companyName.charAt(0)}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            className="brand-title"
            style={{
              fontSize: '0.98rem',
              fontWeight: '800',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={companyName}
          >
            {companyName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span
              style={{
                fontSize: '0.64rem',
                color: brandColor,
                backgroundColor: `${brandColor}22`,
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: '800',
                letterSpacing: '0.04em',
                border: `1px solid ${brandColor}44`
              }}
            >
              {companyCode}
            </span>
            <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '600' }}>
              {planTier}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '6px' }}>
            <div className="nav-section-label">{sec.group}</div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={isActive ? {
                    background: `linear-gradient(90deg, ${brandColor}, ${brandColor}dd)`,
                    boxShadow: `0 4px 14px ${brandColor}40`
                  } : {}}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Branding Bar */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color={brandColor} />
          <span>Tenant Isolated DB</span>
        </div>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: brandColor,
            boxShadow: `0 0 8px ${brandColor}`
          }}
          title={`Active Brand Color: ${brandColor}`}
        />
      </div>
    </aside>
  );
}

