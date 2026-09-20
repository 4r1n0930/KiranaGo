/**
 * KiranaGo Router Configuration
 *
 * Route Mapping:
 * - /                   -> src/pages/Landing.jsx (Includes <ScrollHero />)
 * - /dashboard          -> src/pages/Dashboard.jsx
 * - /dashboard/inventory-> src/pages/Inventory.jsx
 * - /dashboard/orders   -> src/pages/Orders.jsx
 * - /dashboard/alerts   -> src/pages/Alerts.jsx
 * - /login              -> src/pages/Login.jsx
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/inventory" element={<Inventory />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
