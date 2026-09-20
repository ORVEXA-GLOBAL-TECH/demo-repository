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
  const [activeTab, setActiveTab] = useState('saas-overview');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      case 'saas-overview': return 'Global SaaS Multi-Tenant Overview // Orvexa Global Tech';
      case 'saas-companies': return 'Multi-Tenant Company Lifecycle & Management';
      case 'saas-countries': return 'Sovereign Country Compliance, Tax & Statutory Registry';
      case 'saas-admins': return 'Company Administrators & Tenant Security Monitoring';
      case 'saas-subscriptions': return 'Global SaaS Subscription Economics & Invoicing';
      case 'saas-features': return 'Per-Company Feature & Module Licensing Matrix';
      case 'saas-tenants': return 'Multi-Tenant Database & Storage Isolation';
      case 'saas-system-health': return 'Infrastructure Health, Security Center & Global Audit Trail';
      default: return 'Orvexa Global Super Admin Command Center';
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
        />
        <main className="content-area">
          <SuperAdminDashboard
            activeSubTab={activeTab}
            setActiveSubTab={setActiveTab}
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
