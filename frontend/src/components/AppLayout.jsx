import React, { useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, MessageSquare, ShoppingBag, ArrowLeft } from 'lucide-react';
import './AppLayout.css';

/**
 * AppLayout Component
 * Shared layout wrapper for all /app routes.
 * Features a persistent floating Pill Navigation Bar with glassmorphism styling.
 */
export default function AppLayout() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="app-layout-wrapper">
      {/* Top Header */}
      <header className="app-top-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Hero Landing</span>
          </Link>
          <div className="app-brand-pill">
            <span className="brand-dot" />
            <span className="brand-name">KiranaGo App</span>
          </div>
        </div>
      </header>

      {/* Main Route Content */}
      <main className="app-content-container">
        <Outlet />
      </main>

      {/* Persistent Floating Glassmorphism Pill Navigation Bar */}
      <nav className="app-pill-navbar glass-panel--dark">
        <NavLink
          to="/app"
          end
          className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/app/chat"
          className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/app/orders"
          className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={18} />
          <span>Orders</span>
        </NavLink>
      </nav>
    </div>
  );
}
