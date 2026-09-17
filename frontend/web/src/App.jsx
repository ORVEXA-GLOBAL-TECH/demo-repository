import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';
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
import { getNotifications, SOCKET_URL } from './services/api';
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadNotifications();

    // Connect to Backend Real-Time WebSockets
    let socket;
    try {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], autoConnect: true });
      socket.on('connect', () => {
        socket.emit('join_territory', 'North Zone India');
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
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Pharma SFA Dashboard';
      case 'dcr': return 'Daily Call Reporting (DCR 360°)';
      case 'orders': return 'POB Chemist Order Bookings & Stockists';
      case 'expenses': return 'Field Travel & Smart Expense Claims (TA/DA)';
      case 'catalog': return 'Master Healthcare 360° Directory';
      case 'tour-plan': return 'Monthly Tour Plans (MTP) & Beat Routing';
      case 'tracking': return 'Live GPS Satellite Telemetry & Geofence';
      case 'attendance': return 'Field Rep Attendance & Leave Management';
      case 'analytics': return 'Quota Achievement & Sales Velocity Analytics';
      case 'ai-tools': return 'AI Studio (Smart Route Optimizer & Prescription OCR)';
      default: return 'Alleviare SFA Enterprise';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'dcr': return <DcrPage />;
      case 'orders': return <OrdersPage />;
      case 'expenses': return <ExpensesPage />;
      case 'catalog': return <CatalogPage />;
      case 'tour-plan': return <TourPlanPage />;
      case 'tracking': return <TrackingPage />;
      case 'attendance': return <AttendancePage />;
      case 'analytics': return <AnalyticsPage />;
      case 'ai-tools': return <AiToolsPage />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
