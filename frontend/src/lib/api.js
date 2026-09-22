export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let message = `API request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body && (body.error || body.message)) {
        message = body.error || body.message;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
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

export function addProduct(payload) {
  return request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function addStock(productId, quantity) {
  return request(`/products/${encodeURIComponent(productId)}/stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

export function removeProduct(productId) {
  return request(`/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });
}