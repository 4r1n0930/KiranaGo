import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchAlerts } from '@/lib/api';
import './Pages.css';

const FALLBACK_ALERTS = [
  { id: 1, type: 'Restock Warning', severity: 'high', title: 'Aashirvaad Atta Running Out', desc: 'Stock reached 4 bags. Average daily sale is 6 bags. Restock recommended today.', time: '10 mins ago' },
  { id: 2, type: 'Price Fluctuation', severity: 'medium', title: 'Mustard Oil Wholesale Price Up 4%', desc: 'Wholesale distributor updated rate to ₹142/L. Consider updating retail price.', time: '1 hr ago' },
  { id: 3, type: 'Customer Reminder', severity: 'info', title: 'Udhar Payment Due: Verma Ji', desc: 'Pending tab balance: ₹850. Last reminder sent 3 days ago.', time: '3 hrs ago' },
  { id: 4, type: 'Expiry Notice', severity: 'medium', title: 'Bread & Dairy Expiry Alert', desc: '5 milk pouches expiring tomorrow morning. Flash sale recommended.', time: '5 hrs ago' }
];

export default function Alerts() {
  const [alertsList, setAlertsList] = useState(FALLBACK_ALERTS);

  useEffect(() => {
    let active = true;
    fetchAlerts()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setAlertsList(data);
        }
      })
      .catch(() => {
        // Keep FALLBACK_ALERTS when API is unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Link to="/app">🏬 KiranaGo</Link>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            📊 Overview
          </NavLink>
          <NavLink to="/dashboard/inventory" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            📦 Inventory
          </NavLink>
          <NavLink to="/dashboard/orders" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            🛍️ Orders
          </NavLink>
          <NavLink to="/dashboard/alerts" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            🔔 Smart Alerts
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <Link to="/app" className="sidebar-link">← Back to Home</Link>
        </div>
      </aside>

      {/* Main Alerts Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Kirana Smart Alerts</h1>
            <p className="subtext">AI & rule-based notifications for inventory, pricing, and customer tabs</p>
          </div>
        </header>

        {/* Alerts List */}
        <div className="alerts-container">
          {alertsList.map((alert) => (
            <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
              <div className="alert-header">
                <span className="alert-type">{alert.type}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <h3 className="alert-title">{alert.title}</h3>
              <p className="alert-desc">{alert.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
