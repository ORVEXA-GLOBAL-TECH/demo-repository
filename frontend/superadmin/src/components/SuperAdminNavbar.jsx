import React, { useState } from 'react';
import { Bell, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminNavbar({
  title,
  unreadCount = 0,
  onToggleNotifications,
  globalSearchQuery,
  setGlobalSearchQuery,
  onOpenGlobalSearch
}) {
  const { currentUser, logout } = useAuth();
  const [isEmergencyActive] = useState(false);

  return (
    <header className="top-navbar">
      <div className="navbar-left-cluster">
        <div className="page-title">
          <span>{title}</span>
        </div>
      </div>

      <div className="top-actions">
        {isEmergencyActive && (
          <div className="emergency-alert-pill">
            <AlertTriangle size={14} />
            <span>EMERGENCY LOCK ACTIVE</span>
          </div>
        )}

        {/* Notification Bell Button */}
        <button
          onClick={onToggleNotifications}
          className="nav-icon-btn"
          title="Notifications & Alerts"
        >
          <Bell size={18} color="#475569" />
          {unreadCount > 0 && (
            <span className="unread-count-dot">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Cluster */}
        <div className="user-profile-cluster">
          <div className="admin-avatar-crown">
            👑
          </div>
          <div>
            <div className="user-name-text">{currentUser?.name || 'Super Administrator'}</div>
            <div className="user-role-text">{currentUser?.designation || 'Master Governance'}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="logout-btn-nav"
          title="Sign out of Super Admin session"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
