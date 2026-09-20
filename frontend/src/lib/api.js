export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function sendChat(message, customerId) {
  return request('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, customerId, channel: 'web_chat' }),
  });
}

export function fetchOrders() {
  return request('/orders?limit=50');
}

export function fetchInventory() {
  return request('/inventory');
}

export function fetchAlerts() {
  return request('/alerts');
}