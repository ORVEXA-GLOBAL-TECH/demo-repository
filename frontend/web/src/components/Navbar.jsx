import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Building2,
  Shield,
  Monitor,
  Smartphone,
  LogOut,
  ChevronDown,
  Check,
  Search,
  Sparkles,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function Navbar({ title, unreadCount = 0, onToggleNotifications }) {
  const { currentUser, role, logout } = useAuth();
  const { activeTenant, setActiveTenant, tenants, refreshTenants, isLoading } = useTenantTheme();
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'SUPER_ADMIN': return 'badge-approved';
      case 'ADMIN': return 'badge-approved';
      case 'DIRECTOR': return 'badge-approved';
      case 'MANAGER': return 'badge-pending';
      case 'SALES_MANAGER': return 'badge-pending';
      case 'SALES_SUPERVISOR': return 'badge-invoiced';
      case 'ACCOUNTANT': return 'badge-approved';
      default: return 'badge-submitted';
    }
  };

  const isWebOnly = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const isAppOnly = role === 'MR';

  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';

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

  const filteredTenants = (tenants || []).filter(t => {
    const q = searchTerm.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.code && t.code.toLowerCase().includes(q)) ||
      (t.country_name && t.country_name.toLowerCase().includes(q))
    );
  });

  return (
    <header className="top-navbar">
      <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{title}</span>
      </div>

      <div className="top-actions">
        {/* Dynamic Company Switcher Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#f8fafc',
              border: `1.5px solid ${isCompanyDropdownOpen ? brandColor : '#cbd5e1'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: '#0f172a',
              transition: 'all 0.15s',
              boxShadow: isCompanyDropdownOpen ? `0 0 0 3px ${brandColor}22` : 'none'
            }}
            title="Switch Tenant Company"
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: brandColor,
                boxShadow: `0 0 6px ${brandColor}`
              }}
            />
            <span style={{ fontSize: '1rem' }}>{getCountryFlag(activeTenant?.country_code)}</span>
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeTenant?.name || 'Alleviare'}
            </span>
            <ChevronDown size={14} color="#64748b" style={{ transform: isCompanyDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {isCompanyDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                padding: '12px',
                zIndex: 100,
                animation: 'cardFadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Layers size={14} color={brandColor} />
                  <span>Tenant Companies ({tenants?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); refreshTenants(); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}
                  title="Refresh company list"
                >
                  <RefreshCw size={12} className={isLoading ? 'spin-anim' : ''} />
                  <span>Sync</span>
                </button>
              </div>

              {/* Company Search Filter */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company or country..."
                  style={{
                    width: '100%',
                    padding: '6px 8px 6px 28px',
                    fontSize: '0.78rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  autoFocus
                />
              </div>

              {/* Company List */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredTenants.map((t) => {
                  const isSelected = (activeTenant?.id === t.id) || (activeTenant?.code && t.code && activeTenant.code.toLowerCase() === t.code.toLowerCase());
                  const cColor = t.brand_primary_color || t.brandPrimaryColor || '#2563eb';
                  return (
                    <button
                      key={t.id || t.code}
                      type="button"
                      onClick={() => {
                        setActiveTenant(t);
                        setIsCompanyDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: isSelected ? `1.5px solid ${cColor}` : '1px solid transparent',
                        backgroundColor: isSelected ? `${cColor}12` : '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.1s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: cColor,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.72rem',
                            flexShrink: 0
                          }}
                        >
                          {t.name ? t.name.charAt(0) : 'C'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                            {getCountryFlag(t.country_code)} {t.country_code || 'IN'} • {t.currency_symbol || '₹'} • {t.plan || 'ENTERPRISE'}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} color={cColor} style={{ flexShrink: 0, marginLeft: '6px' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.68rem', color: '#64748b', textAlign: 'center' }}>
                Managed via Super Admin Console
              </div>
            </div>
          )}
        </div>

        {/* HQ Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem' }}>
          <Building2 size={16} />
          <span>HQ: <strong>{currentUser?.territory || 'Enterprise HQ'}</strong></span>
        </div>

        {/* Platform Entitlement Chip */}
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          fontWeight: '700',
          backgroundColor: isWebOnly ? '#fef3c7' : isAppOnly ? '#fee2e2' : '#dcfce7',
          color: isWebOnly ? '#92400e' : isAppOnly ? '#991b1b' : '#166534',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isWebOnly ? (
            <><Monitor size={12} /> Web Only</>
          ) : isAppOnly ? (
            <><Smartphone size={12} /> Mobile App Only</>
          ) : (
            <><Monitor size={12} /> + <Smartphone size={12} /> Web & App</>
          )}
        </span>

        <span className={`status-badge ${getRoleBadgeClass()}`}>
          <Shield size={13} /> {role}
        </span>

        {/* Notification Bell Button */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: 'relative',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Notifications & Alerts"
        >
          <Bell size={18} color="#475569" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: '800',
              borderRadius: '9999px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid #ffffff'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px', borderLeft: '1px solid #e2e8f0' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandColor}, #090d16)`,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: `0 2px 8px ${brandColor}40`
          }}>
            {currentUser?.avatar || (currentUser?.name ? currentUser.name.charAt(0) : 'U')}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>{currentUser?.name || 'User'}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser?.designation || role}</div>
          </div>
        </div>

        {/* Explicit Sign Out Button */}
        <button
          onClick={logout}
          className="logout-btn-nav"
          title="Sign out of current session"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

