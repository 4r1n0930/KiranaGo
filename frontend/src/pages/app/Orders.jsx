import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag, Clock, User, Phone, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { MOCK_ORDERS } from '@/data/mockData';
import './AppPages.css';

/**
 * Orders Component
 * Renders past order history with expandable detail breakdowns.
 */
export default function Orders() {
  const containerRef = useRef(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // TODO(api): replace with real GET /orders and GET /orders/:id — see API_REQUIREMENTS.md
  const orders = MOCK_ORDERS;

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      gsap.from('.gsap-orders-reveal', {
        y: 25,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      });
    },
    { scope: containerRef }
  );

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div ref={containerRef} className="app-page orders-page">
      <header className="page-header gsap-orders-reveal">
        <h2>Past Orders & Fulfilled Ledger</h2>
        <p className="page-sub">View recent WhatsApp & counter orders with itemized breakdowns</p>
      </header>

      <div className="orders-list">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.orderId;

          return (
            <div
              key={order.orderId}
              className="order-history-card glass-panel--dark gsap-orders-reveal"
            >
              <div
                className="order-card-summary"
                onClick={() => toggleExpand(order.orderId)}
                role="button"
                tabIndex={0}
              >
                <div className="summary-left">
                  <div className="order-icon-badge">
                    <ShoppingBag size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="order-title-row">
                      <span className="order-id">{order.orderId}</span>
                      <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="customer-row">
                      <User size={14} />
                      <span>{order.customerName}</span>
                      <Clock size={14} className="ml-2" />
                      <span>{order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="summary-right">
                  <span className="order-total-price">₹{order.total}</span>
                  <div className="expand-trigger">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expandable Order Detail View */}
              {isExpanded && (
                <div className="order-card-details glass-panel">
                  <div className="details-header">
                    <h4>Order Breakdown</h4>
                    <div className="phone-tag">
                      <Phone size={14} />
                      <span>{order.phone}</span>
                    </div>
                  </div>

                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td className="font-semibold">₹{item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="details-footer">
                    <div className="fulfillment-status">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>Stock deducted automatically from inventory</span>
                    </div>
                    <div className="grand-total">
                      <span>Total Amount:</span>
                      <strong>₹{order.total}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
