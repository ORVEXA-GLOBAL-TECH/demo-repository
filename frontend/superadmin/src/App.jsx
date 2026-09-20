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
  const { currentUser } = useAuth();
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
        socket.emit('join_territory', 'Enterprise Global HQ');
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
      case 'dashboard': return '1. Platform Dashboard // Master Multi-Tenant Overview';
      case 'companies': return '2. Company / Tenant Governance & Lifecycle';
      case 'jurisdictions': return '3. Multi-Country, Multi-Timezone & Multi-Currency FX Engine';
      case 'platform-users': return '4. Platform Users & Cross-Tenant Directory';
      case 'subscriptions': return '5. Subscriptions, Invoicing & Monetization';
      case 'features': return '6. Feature Governance & Canary Feature Flags';
      case 'settings': return '7. Global Platform Configuration & Defaults';
      case 'roles': return '8. Global Role Templates & Access Matrices';
      case 'integrations': return '9. Enterprise Integrations & API Management';
      case 'app-management': return '10. Mobile App Version Control & Force Updates';
      case 'analytics': return '11. Cross-Company Telemetry & Usage Analytics';
      case 'security': return '12. Security Governance & Immutable Audit Logs';
      case 'system-health': return '13. System Health, Microservices & Maintenance Mode';
      case 'support': return '14. Cross-Company Support Desk & Tickets';
      case 'communications': return '15. Global Announcements & Notifications';
      case 'emergency': return '16. Disaster & Emergency Platform Kill-Switch';
      case 'my-account': return '17. My Master Administrator Account';
      default: return 'Orvexa Super Admin Governance Suite';
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
