import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Pages.css';

export default function Inventory() {
  const sampleInventory = [
    { id: 1, name: 'Aashirvaad Whole Wheat Atta 10kg', category: 'Staples', stock: 4, unit: 'bags', price: '₹440', status: 'Low Stock' },
    { id: 2, name: 'Fortune Mustard Oil 1L', category: 'Oils & Ghee', stock: 2, unit: 'pouches', price: '₹145', status: 'Low Stock' },
    { id: 3, name: 'Tata Salt 1kg', category: 'Spices & Salt', stock: 35, unit: 'packets', price: '₹28', status: 'In Stock' },
    { id: 4, name: 'Madhur Sugar 5kg', category: 'Staples', stock: 1, unit: 'bag', price: '₹225', status: 'Critical' },
    { id: 5, name: 'Red Label Tea 500g', category: 'Beverages', stock: 18, unit: 'packs', price: '₹310', status: 'In Stock' },
    { id: 6, name: 'Maggi 2-Minute Noodles 12-Pack', category: 'Instant Food', stock: 12, unit: 'boxes', price: '₹168', status: 'In Stock' }
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

      {/* Main Inventory Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Kirana Inventory Management</h1>
            <p className="subtext">Track stock levels, prices, and automated restock suggestions</p>
          </div>
          <button type="button" className="btn btn-primary">+ Add New Product</button>
        </header>

        {/* Inventory Table */}
        <div className="table-card">
          <div className="table-header">
            <input type="text" placeholder="Search inventory (e.g., Atta, Oil)..." className="search-input" />
            <div className="filter-badge">Total Items: {sampleInventory.length}</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock Quantity</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleInventory.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.stock} {item.unit}</td>
                  <td>{item.price}</td>
                  <td>
                    <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
