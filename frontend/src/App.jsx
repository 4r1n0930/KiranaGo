/**
 * KiranaGo Router Configuration
 *
 * Route Mapping:
 * - /                    -> src/pages/Landing.jsx (ScrollHero + Overlays)
 * - /app                 -> src/components/AppLayout.jsx
 *   - /app               -> src/pages/app/Home.jsx
 *   - /app/chat          -> src/pages/app/Chat.jsx
 *   - /app/orders        -> src/pages/app/Orders.jsx
 * - /dashboard           -> src/pages/Dashboard.jsx
 * - /dashboard/inventory -> src/pages/Inventory.jsx
 * - /dashboard/orders    -> src/pages/Orders.jsx
 * - /dashboard/alerts    -> src/pages/Alerts.jsx
 * - /login               -> src/pages/Login.jsx
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import AppLayout from './components/AppLayout';
import Home from './pages/app/Home';
import Chat from './pages/app/Chat';
import AppOrders from './pages/app/Orders';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import DashboardOrders from './pages/Orders';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import './App.css';

/**
 * ScrollToTop Component
 * Resets window scroll position to (0, 0) whenever the route path changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* / redirects to /app (which is the Landing Page) */}
        <Route path="/" element={<Home/>} />
        <Route path="/app" element={<Home/>} />

        {/* /app shell with shared AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/chat" element={<Chat />} />
          <Route path="/app/orders" element={<AppOrders />} />
        </Route>

        {/* Legacy / Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/inventory" element={<Inventory />} />
        <Route path="/dashboard/orders" element={<DashboardOrders />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />

        {/* Shortcut / Direct path redirects */}
        <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
        <Route path="/inventory" element={<Navigate to="/dashboard/inventory" replace />} />
        <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
        <Route path="/alerts" element={<Navigate to="/dashboard/alerts" replace />} />

        {/* Catch-all 404 fallback route */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
