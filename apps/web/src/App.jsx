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
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Pharma SFA Dashboard';
      case 'dcr': return 'Daily Call Reporting (DCR)';
      case 'orders': return 'POB Chemist Order Bookings';
      case 'expenses': return 'Field Travel & Expense Claims (TA/DA)';
      case 'catalog': return 'Master Healthcare Directory';
      case 'tour-plan': return 'Tour Plans & Route Operations';
      default: return 'Alleviare SFA System';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'dcr': return <DcrPage />;
      case 'orders': return <OrdersPage />;
      case 'expenses': return <ExpensesPage />;
      case 'catalog': return <CatalogPage />;
      case 'tour-plan': return <TourPlanPage />;
      default: return <Dashboard />;
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
