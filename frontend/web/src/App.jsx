import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantThemeProvider, useTenantTheme } from './context/TenantThemeContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';

// Core Pages
import Dashboard from './pages/Dashboard';
import DcrPage from './pages/DcrPage';
import OrdersPage from './pages/OrdersPage';
import ExpensesPage from './pages/ExpensesPage';
import CatalogPage from './pages/CatalogPage';
import TourPlanPage from './pages/TourPlanPage';
import TrackingPage from './pages/TrackingPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AiToolsPage from './pages/AiToolsPage';
import StaffLoginPage from './pages/StaffLoginPage';

// Enterprise Specification Module Pages
import OrganizationPage from './pages/OrganizationPage';
import EmployeesPage from './pages/EmployeesPage';
import VisitsPage from './pages/VisitsPage';
import SalesTargetsPage from './pages/SalesTargetsPage';
import SamplesPage from './pages/SamplesPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ReportsPage from './pages/ReportsPage';
import TrainingPage from './pages/TrainingPage';
import AuditLogsPage from './pages/AuditLogsPage';
import CompanySettingsPage from './pages/CompanySettingsPage';

import { getNotifications, SOCKET_URL } from './services/api';
import './styles/theme.css';

function MainStaffApp() {
  const { currentUser, role } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  useEffect(() => {
    if (!currentUser) return;

    loadNotifications();

    // Connect to Backend Real-Time WebSockets
    let socket;
    try {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], autoConnect: true });
      socket.on('connect', () => {
        socket.emit('join_territory', currentUser.territory || 'North Zone India');
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

  // If user is not authenticated, display Staff Login
  if (!currentUser) {
    return <StaffLoginPage />;
  }

  const getPageTitle = () => {
    const brand = activeTenant?.name || 'Alleviare';
    switch (activeTab) {
      case 'dashboard': return `${brand} • Executive SFA Dashboard`;
      case 'hierarchy': return 'Organization Structure & Hierarchy Tree';
      case 'zones': return 'Zonal Management & Regional Boundaries';
      case 'regions': return 'Sales Regions & Divisional Oversight';
      case 'areas': return 'District Areas & Supervisor Sectors';
      case 'territories': return 'Field Rep Territories & Geofence Boundaries';
      case 'headquarters': return 'Headquarter Stations & Depot Hubs';
      case 'employees': return 'Workforce Directory & Active Field Force';
      case 'managers': return 'Commercial & Regional Operations Managers';
      case 'mr-supervisors': return 'Field Area Sales Supervisors';
      case 'mrs': return 'Medical Representatives (MR Roster)';
      case 'doctors': return 'Doctors Master Healthcare 360° Directory';
      case 'chemists': return 'Chemists & Retail Pharmacy Network';
      case 'hospitals': return 'Hospitals & Healthcare Institutions Directory';
      case 'products': return 'Pharmaceutical Product Master & Pricing Catalog';
      case 'divisions': return 'Product Divisions & Portfolio Groupings';
      case 'categories': return 'Therapeutic Categories & Formulation Classes';
      case 'competitors': return 'Competitor Intelligence & Market Share Analytics';
      case 'tour-plan': return 'Monthly Tour Plans (MTP) & Beat Routing';
      case 'visits': return 'Field Visits 360° & Live In-Clinic Capturing';
      case 'dcr': return 'Daily Call Reporting (DCR 360°) Management';
      case 'tracking': return 'Live GPS Satellite Telemetry & Geofence Status';
      case 'attendance': return 'Field Rep Daily Attendance & GPS Logs';
      case 'leave': return 'Leave Management & Balances';
      case 'holidays': return 'Corporate Holiday & Gazetted Calendar';
      case 'targets': return 'Quota Targets & Commercial Milestone Board';
      case 'achievement': return 'Rep Quota Leaderboard & Achievement Ranks';
      case 'orders': return 'POB Chemist Order Bookings & Stockists';
      case 'sales': return 'Primary & Secondary Sales Performance';
      case 'claims':
      case 'expenses': return 'Field Travel & Smart Expense Claims (TA/DA)';
      case 'expense-approvals': return 'Expense Claims Approval Review Queue';
      case 'policies': return 'Travel Allowance & Daily Expense Policies';
      case 'inventory': return 'Pharmaceutical Samples Stock Ledger';
      case 'allocation': return 'MR Sample Stock Allocation';
      case 'distribution': return 'Physician Sample Handover & Visual Aids';
      case 'standard-reports': return 'Standard Operational SFA Reports';
      case 'custom-reports': return 'Custom Multi-Attribute Reports Builder';
      case 'analytics': return 'Quota Achievement & Sales Velocity Analytics';
      case 'approvals': return 'Unified Approvals Command Center';
      case 'notifications': return 'System Notifications & Operational Alerts';
      case 'training': return 'MR Academy & Detailing LMS Modules';
      case 'masters': return 'Core Master Registries';
      case 'settings': return 'Company Field Governance Settings';
      case 'audit-logs': return 'Immutable Enterprise Audit Trail';
      case 'ai-tools': return 'AI Studio (Smart Route Optimizer & Prescription OCR)';
      default: return `${brand} SFA Enterprise`;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      // 1. Core
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;

      // 2. Organization
      case 'hierarchy':
      case 'zones':
      case 'regions':
      case 'areas':
      case 'territories':
      case 'headquarters':
        return <OrganizationPage initialSubTab={activeTab} />;

      // 3. People
      case 'employees':
        return <EmployeesPage initialFilter="ALL" />;
      case 'managers':
        return <EmployeesPage initialFilter="MANAGER" />;
      case 'mr-supervisors':
        return <EmployeesPage initialFilter="MR_SUPERVISOR" />;
      case 'mrs':
        return <EmployeesPage initialFilter="MR" />;

      // 4. Customers & Products
      case 'doctors':
        return <CatalogPage initialTab="doctors" />;
      case 'chemists':
        return <CatalogPage initialTab="chemists" />;
      case 'hospitals':
        return <CatalogPage initialTab="hospitals" />;
      case 'products':
        return <CatalogPage initialTab="products" />;
      case 'divisions':
        return <CatalogPage initialTab="divisions" />;
      case 'categories':
        return <CatalogPage initialTab="products" />;
      case 'competitors':
        return <CatalogPage initialTab="competitors" />;
      case 'catalog':
        return <CatalogPage initialTab="doctors" />;

      // 5. Field Operations
      case 'tour-plan':
        return <TourPlanPage />;
      case 'visits':
        return <VisitsPage />;
      case 'dcr':
        return <DcrPage />;
      case 'tracking':
        return <TrackingPage />;

      // 6. Attendance & Leave
      case 'attendance':
        return <AttendancePage initialSubTab="attendance" />;
      case 'leave':
        return <AttendancePage initialSubTab="leave" />;
      case 'holidays':
        return <AttendancePage initialSubTab="holidays" />;

      // 7. Sales & Commercial
      case 'targets':
        return <SalesTargetsPage initialSubTab="targets" />;
      case 'achievement':
        return <SalesTargetsPage initialSubTab="leaderboard" />;
      case 'sales':
        return <SalesTargetsPage initialSubTab="brands" />;
      case 'orders':
        return <OrdersPage />;

      // 8. Expenses
      case 'claims':
      case 'expenses':
        return <ExpensesPage />;
      case 'expense-approvals':
        return <ApprovalsPage initialType="EXPENSE" />;
      case 'policies':
        return <CompanySettingsPage initialSubTab="expense-policies" />;

      // 9. Samples & Promotional Materials
      case 'inventory':
      case 'allocation':
        return <SamplesPage initialSubTab="inventory" />;
      case 'distribution':
        return <SamplesPage initialSubTab="promotions" />;

      // 10. Reports & Analytics
      case 'standard-reports':
      case 'custom-reports':
        return <ReportsPage initialSubTab={activeTab} />;
      case 'analytics':
        return <AnalyticsPage />;

      // 11. Management & Compliance
      case 'approvals':
        return <ApprovalsPage initialType="ALL" />;
      case 'notifications':
        return <ApprovalsPage initialType="ALL" />;
      case 'training':
        return <TrainingPage />;
      case 'masters':
        return <OrganizationPage initialSubTab="territories" />;
      case 'settings':
        return <CompanySettingsPage initialSubTab="settings" />;
      case 'audit-logs':
        return <AuditLogsPage />;

      // 12. AI Tools
      case 'ai-tools':
        return <AiToolsPage />;

      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <Navbar
          title={getPageTitle()}
          unreadCount={unreadCount}
          onToggleNotifications={() => setIsDrawerOpen(true)}
        />
        <main className="content-area">
          {renderContent()}
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
    <TenantThemeProvider>
      <AuthProvider>
        <MainStaffApp />
      </AuthProvider>
    </TenantThemeProvider>
  );
}
