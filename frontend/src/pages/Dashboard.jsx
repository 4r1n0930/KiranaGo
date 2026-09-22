import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { addProduct, addStock, removeProduct } from '@/lib/api';
import './Pages.css';

export default function Dashboard() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '0',
    reorderThreshold: '10',
    expiryDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const [stockId, setStockId] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockSubmitting, setStockSubmitting] = useState(false);
  const [stockMessage, setStockMessage] = useState(null);

  const [removeId, setRemoveId] = useState('');
  const [removeSubmitting, setRemoveSubmitting] = useState(false);
  const [removeMessage, setRemoveMessage] = useState(null);

  function updateForm(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage(null);
    try {
      const product = await addProduct({
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock || 0),
        reorderThreshold: Number(form.reorderThreshold || 10),
        ...(form.expiryDate ? { expiryDate: form.expiryDate } : {})
      });
      setFormMessage({
        type: 'success',
        text: `Added "${product.name}" with ID ${product.productId}`
      });
      setForm({ name: '', category: '', price: '', stock: '0', reorderThreshold: '10', expiryDate: '' });
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddStock(event) {
    event.preventDefault();
    const productId = stockId.trim();
    const quantity = Number(stockQty);
    if (!productId || !quantity || quantity <= 0) {
      setStockMessage({ type: 'error', text: 'Enter a product ID and a quantity greater than 0.' });
      return;
    }
    setStockSubmitting(true);
    setStockMessage(null);
    try {
      const result = await addStock(productId, quantity);
      setStockMessage({ type: 'success', text: `Added ${result.added} units to ${result.productId}. New stock: ${result.stock}` });
      setStockId('');
      setStockQty('');
    } catch (error) {
      setStockMessage({ type: 'error', text: error.message });
    } finally {
      setStockSubmitting(false);
    }
  }

  async function handleRemoveProduct(event) {
    event.preventDefault();
    const productId = removeId.trim();
    if (!productId) {
      setRemoveMessage({ type: 'error', text: 'Enter a product ID to remove.' });
      return;
    }
    if (!window.confirm(`Remove product ${productId}? This cannot be undone.`)) {
      return;
    }
    setRemoveSubmitting(true);
    setRemoveMessage(null);
    try {
      const result = await removeProduct(productId);
      setRemoveMessage({ type: 'success', text: `Removed ${result.productId}.` });
      setRemoveId('');
    } catch (error) {
      setRemoveMessage({ type: 'error', text: error.message });
    } finally {
      setRemoveSubmitting(false);
    }
  }

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

        {/* Add New Product */}
        <section className="dashboard-section">
          <h2>Add New Product</h2>
          <form className="product-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label htmlFor="product-name">Product Name *</label>
              <input
                id="product-name"
                type="text"
                className="search-input form-input"
                placeholder="e.g., Tata Tea Gold 250g"
                value={form.name}
                onChange={updateForm('name')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-category">Category *</label>
              <input
                id="product-category"
                type="text"
                className="search-input form-input"
                placeholder="e.g., Beverages"
                value={form.category}
                onChange={updateForm('category')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-price">Price (₹) *</label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                className="search-input form-input"
                placeholder="150"
                value={form.price}
                onChange={updateForm('price')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-stock">Stock Quantity</label>
              <input
                id="product-stock"
                type="number"
                min="0"
                className="search-input form-input"
                value={form.stock}
                onChange={updateForm('stock')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-threshold">Reorder Threshold</label>
              <input
                id="product-threshold"
                type="number"
                min="0"
                className="search-input form-input"
                value={form.reorderThreshold}
                onChange={updateForm('reorderThreshold')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-expiry">Expiry Date (optional)</label>
              <input
                id="product-expiry"
                type="date"
                className="search-input form-input"
                value={form.expiryDate}
                onChange={updateForm('expiryDate')}
              />
            </div>
            {formMessage && (
              <p className={`form-message ${formMessage.type}`}>{formMessage.text}</p>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : '+ Add Product'}
            </button>
          </form>
        </section>

        {/* Product Stock & Removal */}
        <section className="dashboard-section">
          <h2>Product Stock & Removal</h2>
          <div className="stock-actions">
            <form className="stock-action" onSubmit={handleAddStock}>
              <h3>Add Stock</h3>
              <div className="form-group">
                <label htmlFor="stock-id">Product ID</label>
                <input
                  id="stock-id"
                  type="text"
                  className="search-input form-input"
                  placeholder="PROD-001"
                  value={stockId}
                  onChange={(event) => setStockId(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock-qty">Quantity to Add</label>
                <input
                  id="stock-qty"
                  type="number"
                  min="1"
                  className="search-input form-input"
                  placeholder="25"
                  value={stockQty}
                  onChange={(event) => setStockQty(event.target.value)}
                />
              </div>
              {stockMessage && (
                <p className={`form-message ${stockMessage.type}`}>{stockMessage.text}</p>
              )}
              <button type="submit" className="btn btn-primary" disabled={stockSubmitting}>
                {stockSubmitting ? 'Updating…' : '+ Add Stock'}
              </button>
            </form>

            <form className="stock-action" onSubmit={handleRemoveProduct}>
              <h3>Remove Product</h3>
              <div className="form-group">
                <label htmlFor="remove-id">Product ID</label>
                <input
                  id="remove-id"
                  type="text"
                  className="search-input form-input"
                  placeholder="PROD-001"
                  value={removeId}
                  onChange={(event) => setRemoveId(event.target.value)}
                />
              </div>
              {removeMessage && (
                <p className={`form-message ${removeMessage.type}`}>{removeMessage.text}</p>
              )}
              <button type="submit" className="btn btn-danger" disabled={removeSubmitting}>
                {removeSubmitting ? 'Removing…' : '🗑 Remove Product'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
