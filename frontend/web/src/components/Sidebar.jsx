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

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, role } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [logoError, setLogoError] = useState(false);

  // Main App Navigation Tree
  const navSections = [
    {
      group: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Organization',
      items: [
        { id: 'hierarchy', label: 'Hierarchy', icon: Building2 },
        { id: 'zones', label: 'Zones', icon: Globe2 },
        { id: 'regions', label: 'Regions', icon: Globe2 },
        { id: 'areas', label: 'Areas', icon: Globe2 },
        { id: 'territories', label: 'Territories', icon: Globe2 },
        { id: 'headquarters', label: 'Headquarters', icon: Building2 }
      ]
    },
    {
      group: 'People',
      items: [
        { id: 'employees', label: 'Employees', icon: ShieldCheck },
        { id: 'managers', label: 'Managers', icon: ShieldCheck },
        { id: 'mr-supervisors', label: 'MR Supervisors', icon: ShieldCheck },
        { id: 'mrs', label: 'MRs', icon: ShieldCheck }
      ]
    },
    {
      group: 'Customers',
      items: [
        { id: 'doctors', label: 'Doctors', icon: BookOpen },
        { id: 'chemists', label: 'Chemists', icon: BookOpen },
        { id: 'hospitals', label: 'Hospitals', icon: BookOpen }
      ]
    },
    {
      group: 'Products',
      items: [
        { id: 'products', label: 'Products', icon: BookOpen },
        { id: 'divisions', label: 'Divisions', icon: BookOpen },
        { id: 'categories', label: 'Categories', icon: BookOpen },
        { id: 'competitors', label: 'Competitors', icon: BookOpen }
      ]
    },
    {
      group: 'Field Operations',
      items: [
        { id: 'tour-plan', label: 'Tour Plans', icon: CalendarCheck },
        { id: 'visits', label: 'Visits', icon: ClipboardList },
        { id: 'dcr', label: 'DCR', icon: ClipboardList },
        { id: 'tracking', label: 'GPS / Tracking', icon: Radio }
      ]
    },
    {
      group: 'Attendance',
      items: [
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leave', icon: Clock },
        { id: 'holidays', label: 'Holidays', icon: Clock }
      ]
    },
    {
      group: 'Sales',
      items: [
        { id: 'targets', label: 'Targets', icon: TrendingUp },
        { id: 'achievement', label: 'Achievement', icon: TrendingUp },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'sales', label: 'Sales', icon: ShoppingCart }
      ]
    },
    {
      group: 'Expenses',
      items: [
        { id: 'claims', label: 'Claims', icon: Receipt },
        { id: 'expense-approvals', label: 'Approvals', icon: CheckCircle2 },
        { id: 'policies', label: 'Policies', icon: Receipt }
      ]
    },
    {
      group: 'Samples',
      items: [
        { id: 'inventory', label: 'Inventory', icon: BookOpen },
        { id: 'allocation', label: 'Allocation', icon: BookOpen },
        { id: 'distribution', label: 'Distribution', icon: BookOpen }
      ]
    },
    {
      group: 'Reports',
      items: [
        { id: 'standard-reports', label: 'Standard Reports', icon: TrendingUp },
        { id: 'custom-reports', label: 'Custom Reports', icon: TrendingUp },
        { id: 'analytics', label: 'Analytics', icon: Sparkles }
      ]
    },
    {
      group: 'Management',
      items: [
        { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
        { id: 'notifications', label: 'Notifications', icon: ExternalLink },
        { id: 'training', label: 'Training', icon: BookOpen },
        { id: 'masters', label: 'Masters', icon: BookOpen },
        { id: 'settings', label: 'Settings', icon: ShieldCheck },
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck }
      ]
    }
  ];

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

