import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DcrPage from './pages/DcrPage';
import OrdersPage from './pages/OrdersPage';
import ExpensesPage from './pages/ExpensesPage';
import CatalogPage from './pages/CatalogPage';
import TourPlanPage from './pages/TourPlanPage';
import TrackingPage from './pages/TrackingPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-wrapper">
          <Navbar title={getPageTitle()} />
          <main className="content-area">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
