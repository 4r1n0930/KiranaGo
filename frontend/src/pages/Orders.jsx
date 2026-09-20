import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Pages.css';

export default function Orders() {
  const sampleOrders = [
    { id: 'KG-8041', customer: 'Ramesh Verma', items: 'Atta 10kg, Mustard Oil 1L', total: '₹585', channel: 'WhatsApp', status: 'Pending Delivery', time: '10 mins ago' },
    { id: 'KG-8040', customer: 'Priya Sharma', items: 'Tata Salt, Maggi 12-pack', total: '₹196', channel: 'WhatsApp', status: 'Ready for Pickup', time: '25 mins ago' },
    { id: 'KG-8039', customer: 'Anand Kumar', items: 'Red Label Tea 500g, Sugar 5kg', total: '₹535', channel: 'Counter Order', status: 'Completed', time: '1 hr ago' },
    { id: 'KG-8038', customer: 'Sunita Gupta', items: 'Fortune Oil 2L, Spices Pack', total: '₹340', channel: 'WhatsApp', status: 'Completed', time: '2 hrs ago' }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Link to="/">🏬 KiranaGo</Link>
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
          <Link to="/" className="sidebar-link">← Back to Home</Link>
        </div>
      </aside>

      {/* Main Orders Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Customer Orders</h1>
            <p className="subtext">Manage incoming WhatsApp and walk-in counter orders</p>
          </div>
        </header>

        {/* Orders List */}
        <div className="orders-grid">
          {sampleOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">{order.id}</span>
                  <span className="order-channel">{order.channel}</span>
                </div>
                <span className="order-time">{order.time}</span>
              </div>
              <div className="order-customer">{order.customer}</div>
              <div className="order-items">{order.items}</div>
              <div className="order-card-footer">
                <span className="order-total">{order.total}</span>
                <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
