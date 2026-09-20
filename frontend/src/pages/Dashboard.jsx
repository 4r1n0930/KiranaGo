import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Pages.css';

export default function Dashboard() {
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

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Kirana Dashboard</h1>
            <p className="subtext">Welcome back, Sharma General Store</p>
          </div>
          <div className="header-badge">Online Store Active</div>
        </header>

        {/* Quick Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Today's Sales</span>
            <span className="stat-value">₹14,850</span>
            <span className="stat-trend positive">+18% vs yesterday</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Orders</span>
            <span className="stat-value">8</span>
            <span className="stat-sub">3 ready for delivery</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Low Stock Warnings</span>
            <span className="stat-value warning">4 items</span>
            <span className="stat-sub">Atta, Mustard Oil, Sugar</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Customer Udhar (Credit)</span>
            <span className="stat-value">₹3,420</span>
            <span className="stat-sub">12 active customer tabs</span>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <h2>Quick Navigation</h2>
          <div className="quick-nav-cards">
            <Link to="/dashboard/inventory" className="nav-card">
              <h3>📦 Manage Inventory</h3>
              <p>View stock levels, update prices, and scan barcodes.</p>
            </Link>
            <Link to="/dashboard/orders" className="nav-card">
              <h3>🛍️ Live WhatsApp Orders</h3>
              <p>Manage customer orders and dispatch local deliveries.</p>
            </Link>
            <Link to="/dashboard/alerts" className="nav-card">
              <h3>🔔 Restock & Smart Alerts</h3>
              <p>Automated alerts for expiring items and low inventory.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
