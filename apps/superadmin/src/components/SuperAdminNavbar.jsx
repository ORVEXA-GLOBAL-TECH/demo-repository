import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Search, ChevronDown, CheckCircle2, Shield, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrvexaLogoIcon } from './OrvexaLogo';

export default function SuperAdminNavbar({
  title = 'Command Centre',
  unreadCount = 3,
  onToggleNotifications,
  globalSearchQuery = '',
  setGlobalSearchQuery,
  onOpenGlobalSearch,
  isSidebarCollapsed = false,
  setIsSidebarCollapsed,
  onLogoClick
}) {
  const { currentUser, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Live formatted time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      setCurrentTimeStr(`IST (UTC+5:30) • ${datePart}, ${timePart}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-navbar" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0',
      minHeight: '62px', gap: '16px'
    }}>
      {/* ── Left: Sidebar Toggle, Brand Logo & Breadcrumb ────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
        {setIsSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px',
              padding: '6px', color: '#475569', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginRight: '4px'
            }}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={16} />
          </button>
        )}

        {/* Orvexa Brand Logo Badge */}
        <div
          onClick={onLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: onLogoClick ? 'pointer' : 'default',
            paddingRight: '12px',
            marginRight: '4px',
            borderRight: '1px solid #e2e8f0',
            userSelect: 'none'
          }}
          title="Orvexa Global - Click to return to Command Centre Dashboard"
        >
          <OrvexaLogoIcon size={28} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.94rem', letterSpacing: '-0.02em' }}>
              Orvexa
            </span>
            <span style={{
              fontSize: '0.64rem',
              fontWeight: '800',
              color: '#b45309',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              padding: '1px 5px',
              borderRadius: '4px',
              letterSpacing: '0.04em'
            }}>
              HQ
            </span>
          </div>
        </div>

        <span style={{ color: '#64748b', fontWeight: '500' }}>Platform</span>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <strong style={{ color: '#0f172a', fontWeight: '700' }}>
          {title.includes('Command Centre') || title.includes('Platform Dashboard') ? 'Command Centre' : title}
        </strong>
      </div>

      {/* ── Center: Search Bar ───────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search companies, users, tenants, tickets, or anything..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery && setGlobalSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '7px 46px 7px 36px', borderRadius: '8px',
            border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.82rem',
            outline: 'none', color: '#1e293b'
          }}
        />
        <div style={{
          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
          background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px',
          padding: '1px 5px', fontSize: '0.68rem', color: '#64748b', fontWeight: '700',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}>
          ⌘K
        </div>
      </div>

      {/* ── Right Cluster: Production Badge, Bell, Timezone, Profile ──────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Production Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px',
          background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px',
          fontSize: '0.72rem', fontWeight: '800', color: '#059669', letterSpacing: '0.04em'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>PRODUCTION</span>
        </div>

        {/* Notification Bell Button */}
        <button
          type="button"
          onClick={onToggleNotifications}
          style={{
            position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', borderRadius: '8px', color: '#475569', display: 'flex', alignItems: 'center'
          }}
          title="Notifications & Alerts"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '2px', right: '2px', background: '#ef4444',
              color: '#ffffff', borderRadius: '50%', width: '15px', height: '15px',
              fontSize: '0.62rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #ffffff'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Live IST Time */}
        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '500', whiteSpace: 'nowrap' }}>
          {currentTimeStr || 'IST (UTC+5:30) • 25 Sep 2026, 14:32'}
        </div>

        {/* Profile Cluster with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '9px', background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px', textAlign: 'left'
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}>
              👑
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                {currentUser?.name || 'Super Admin'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                {currentUser?.designation || 'Global Platform Admin'}
              </div>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '115%', width: '210px',
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '6px', zIndex: 1000
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.74rem', color: '#64748b' }}>
                Signed in as <strong style={{ color: '#0f172a', display: 'block' }}>{currentUser?.email || 'superadmin@alleviare.com'}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', border: 'none', background: 'none', cursor: 'pointer',
                  color: '#dc2626', fontSize: '0.78rem', fontWeight: '700', borderRadius: '6px',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={14} />
                <span>Sign Out of Console</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
