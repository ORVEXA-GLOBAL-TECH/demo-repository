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

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('🔴 [ErrorBoundary] Caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f172a', color: '#f1f5f9', fontFamily: 'Inter, sans-serif',
          padding: '40px', gap: '16px'
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '600px', textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <details style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
            padding: '16px', maxWidth: '700px', width: '100%', color: '#94a3b8',
            fontSize: '0.78rem', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto'
          }}>
            <summary style={{ cursor: 'pointer', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>
              Stack Trace
            </summary>
            {this.state.error?.stack}
            {'\n\n'}
            {this.state.info?.componentStack}
          </details>
          <button
            onClick={() => { this.setState({ hasError: false, error: null, info: null }); window.location.reload(); }}
            style={{
              background: '#f59e0b', color: '#0f172a', border: 'none',
              padding: '10px 24px', borderRadius: '8px', fontWeight: 800,
              cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainSuperAdminApp() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      case 'dashboard': return 'Command Centre';
      case 'companies': return 'Company & Tenant Governance';
      case 'company-admins': return 'Company Administrators Governance';
      case 'jurisdictions':
      case 'global-masters': return 'Multi-Country, Timezones & Currencies';
      case 'platform-users': return 'Platform Users & Directories';
      case 'user-sessions': return 'Active User Sessions';
      case 'subscriptions': return 'Subscriptions & Monetization';
      case 'billing': return 'Enterprise Billing, Invoices & Receivables';
      case 'plans': return 'Subscription Plans & Pricing Tiers';
      case 'features':
      case 'feature-flags': return 'Feature Flags & Canary Rollouts';
      case 'settings': return 'Global Platform Configuration';
      case 'roles': return 'Role Templates & Access Matrices';
      case 'integrations':
      case 'api-management': return 'Integrations & API Management';
      case 'app-management':
      case 'app-versions': return 'Mobile App Version Control';
      case 'analytics': return 'Usage Analytics & Telemetry';
      case 'security':
      case 'audit-logs': return 'Security Governance & Audit Logs';
      case 'system-health': return 'System Health & Maintenance';
      case 'support': return 'Support Desk & Tickets';
      case 'communications':
      case 'notifications': return 'Global Announcements';
      case 'data-management':
      case 'data-governance': return 'Data Retention & Archival';
      case 'emergency': return 'Emergency Platform Controls';
      case 'my-account': return 'Administrator Account';
      default: return 'Super Admin Governance Suite';
    }
  };

  return (
    <div className="app-container">
      <SuperAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="main-wrapper">
        <SuperAdminNavbar
          title={getPageTitle()}
          unreadCount={unreadCount}
          onToggleNotifications={() => setIsDrawerOpen(true)}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          onLogoClick={() => setActiveTab('dashboard')}
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
    <ErrorBoundary>
      <AuthProvider>
        <ErrorBoundary>
          <MainSuperAdminApp />
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  );
}
