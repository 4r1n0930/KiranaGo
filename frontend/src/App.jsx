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

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* /app shell with shared AppLayout */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="orders" element={<AppOrders />} />
        </Route>

        {/* Legacy / Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/inventory" element={<Inventory />} />
        <Route path="/dashboard/orders" element={<DashboardOrders />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
