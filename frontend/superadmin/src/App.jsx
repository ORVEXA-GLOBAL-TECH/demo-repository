import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthProvider, useAuth } from './context/AuthContext';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminNavbar from './components/SuperAdminNavbar';
import NotificationDrawer from './components/NotificationDrawer';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { getNotifications, SOCKET_URL } from './services/api';
import './styles/theme.css';

function MainSuperAdminApp() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    loadNotifications();

    let socket;
    try {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], autoConnect: true });
      socket.on('connect', () => {
        socket.emit('join_user_session', currentUser.id);
        socket.emit('join_territory', 'Enterprise Global HQ');
      });

      socket.on('FORCE_LOGOUT', (data) => {
        alert(data?.message || '⚠️ Security Alert: Another window was opened. This session has been terminated.');
        logout();
      });

      socket.on('new_dcr_notification', () => {
        loadNotifications();
      });

      socket.on('new_order_notification', () => {
        loadNotifications();
      });
    } catch (err) {
      console.warn('WebSocket connection fallback:', err.message);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  // If user is not authenticated, display Super Admin Login
  if (!currentUser) {
    return <SuperAdminLoginPage />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Platform Dashboard';
      case 'companies': return 'Company & Tenant Governance';
      case 'jurisdictions': return 'Multi-Country, Timezones & Currencies';
      case 'platform-users': return 'Platform Users & Directories';
      case 'subscriptions': return 'Subscriptions & Monetization';
      case 'features': return 'Feature Flags & Rollouts';
      case 'settings': return 'Global Platform Configuration';
      case 'roles': return 'Role Templates & Access Matrices';
      case 'integrations': return 'Enterprise Integrations & APIs';
      case 'app-management': return 'Mobile App Version Control';
      case 'analytics': return 'Usage Analytics & Telemetry';
      case 'security': return 'Security Governance & Audit Logs';
      case 'system-health': return 'System Health & Maintenance';
      case 'support': return 'Support Desk & Tickets';
      case 'communications': return 'Global Announcements';
      case 'emergency': return 'Emergency Platform Controls';
      case 'my-account': return 'Administrator Account';
      default: return 'Super Admin Governance Suite';
    }
  };

  return (
    <div className="app-container">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <SuperAdminNavbar
          title={getPageTitle()}
          unreadCount={unreadCount}
          onToggleNotifications={() => setIsDrawerOpen(true)}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
        />
        <main className="content-area">
          <SuperAdminDashboard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            globalSearchQuery={globalSearchQuery}
            setGlobalSearchQuery={setGlobalSearchQuery}
          />
        </main>
      </div>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onRefresh={loadNotifications}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainSuperAdminApp />
    </AuthProvider>
  );
}
