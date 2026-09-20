import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchInventory } from '@/lib/api';
import './Pages.css';

const SAMPLE_INVENTORY = [
  { id: 1, name: 'Aashirvaad Whole Wheat Atta 10kg', category: 'Staples', stock: 4, unit: 'bags', price: '₹440', status: 'Low Stock' },
  { id: 2, name: 'Fortune Mustard Oil 1L', category: 'Oils & Ghee', stock: 2, unit: 'pouches', price: '₹145', status: 'Low Stock' },
  { id: 3, name: 'Tata Salt 1kg', category: 'Spices & Salt', stock: 35, unit: 'packets', price: '₹28', status: 'In Stock' },
  { id: 4, name: 'Madhur Sugar 5kg', category: 'Staples', stock: 1, unit: 'bag', price: '₹225', status: 'Critical' },
  { id: 5, name: 'Red Label Tea 500g', category: 'Beverages', stock: 18, unit: 'packs', price: '₹310', status: 'In Stock' },
  { id: 6, name: 'Maggi 2-Minute Noodles 12-Pack', category: 'Instant Food', stock: 12, unit: 'boxes', price: '₹168', status: 'In Stock' }
];

export default function Inventory() {
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);

  useEffect(() => {
    let active = true;
    fetchInventory()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setInventory(data);
        }
      })
      .catch(() => {
        // Keep SAMPLE_INVENTORY fallback when API is unreachable
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
            <div className="filter-badge">Total Items: {inventory.length}</div>
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
              {inventory.map((item) => (
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
