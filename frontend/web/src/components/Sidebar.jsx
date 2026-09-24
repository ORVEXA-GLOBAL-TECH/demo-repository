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

  // Company Admin & Operational Staff Navigation
  const coreNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'dcr', label: 'DCR & Detailing 360°', icon: ClipboardList },
    { id: 'orders', label: 'POB Orders & Stockists', icon: ShoppingCart },
    { id: 'expenses', label: 'TA / DA Smart Expenses', icon: Receipt }
  ];

  const opsNav = [
    { id: 'catalog', label: 'Master Registries 360°', icon: BookOpen },
    { id: 'tour-plan', label: 'Tour Plans & Beats (MTP)', icon: CalendarCheck },
    { id: 'tracking', label: 'Live GPS & Geofence', icon: Radio },
    { id: 'attendance', label: 'Attendance & Leaves', icon: Clock },
    { id: 'analytics', label: 'Quota & Sales Analytics', icon: TrendingUp },
    { id: 'ai-tools', label: 'AI Studio & Route TSP', icon: Sparkles }
  ];

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';
  const logoUrl = activeTenant?.logo_url || activeTenant?.logoUrl;
  const companyName = activeTenant?.name || 'Alleviare SFA';
  const companyCode = (activeTenant?.code || 'HQ').toUpperCase();
  const planTier = activeTenant?.plan || 'ENTERPRISE';

  // Country Flag Emoji helper
  const getCountryFlag = (code) => {
    if (!code) return '🌐';
    const c = code.toUpperCase();
    if (c === 'IN') return '🇮🇳';
    if (c === 'US') return '🇺🇸';
    if (c === 'GB' || c === 'UK') return '🇬🇧';
    if (c === 'CH') return '🇨🇭';
    if (c === 'DE') return '🇩🇪';
    if (c === 'AE') return '🇦🇪';
    if (c === 'SG') return '🇸🇬';
    if (c === 'ZA') return '🇿🇦';
    return '🌐';
  };

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

      {/* Tenant Sovereign Badge Strip */}
      <div
        style={{
          padding: '8px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#94a3b8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '0.95rem' }}>{getCountryFlag(activeTenant?.country_code)}</span>
          <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{activeTenant?.country_code || 'IN'}</span>
          <span>•</span>
          <span style={{ color: '#cbd5e1' }}>{activeTenant?.currency_symbol || '₹'} ({activeTenant?.currency_code || 'INR'})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '700', fontSize: '0.66rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
          <span>Active</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Core Field Operations</div>
        {coreNav.map((item) => {
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
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: '6px' }}>Enterprise Intelligence</div>
        {opsNav.map((item) => {
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
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: '8px' }}>API &amp; Platform Docs</div>
        <a
          href="http://localhost:5000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
          style={{ color: '#38bdf8' }}
        >
          <FileCode2 size={18} />
          <span>Swagger API Docs ↗</span>
        </a>
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

