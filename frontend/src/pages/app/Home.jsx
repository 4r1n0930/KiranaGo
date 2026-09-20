import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShoppingBag, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import './AppPages.css';

export default function Home() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Ensure ScrollTrigger recalculates layout dimensions on mount/route transition
      ScrollTrigger.refresh();

      gsap.from('.gsap-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="app-page home-page">
      {/* Intro Hero Band */}
      <section className="home-hero-band gsap-reveal glass-panel--dark">
        <div className="hero-band-content">
          <span className="welcome-tag">KiranaGo Operating System</span>
          <h1>Digitize Your Store with Voice & WhatsApp</h1>
          <p>
            Welcome back! KiranaGo converts unstructured customer chats and voice notes into clean inventory updates and automated order fulfillments in seconds.
          </p>
        </div>
      </section>

      {/* Quick Access Glass-Panel Cards */}
      <section className="home-cards-grid">
        <Link to="/app/chat" className="quick-card glass-panel--dark gsap-reveal">
          <div className="card-icon-badge">
            <MessageSquare size={24} className="text-blue-400" />
          </div>
          <div className="card-body">
            <h3>AI Conversation Agent</h3>
            <p>Simulate customer WhatsApp messages, test natural language ordering, and verify structured item extraction.</p>
          </div>
          <div className="card-arrow">
            <span>Open Chat</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        <Link to="/app/orders" className="quick-card glass-panel--dark gsap-reveal">
          <div className="card-icon-badge">
            <ShoppingBag size={24} className="text-lime-400" />
          </div>
          <div className="card-body">
            <h3>Order History & Ledger</h3>
            <p>Inspect past customer orders, item breakdowns, total values, and payment status updates.</p>
          </div>
          <div className="card-arrow">
            <span>View Orders</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      </section>

      {/* Highlights */}
      <section className="home-highlights gsap-reveal">
        <div className="highlight-pill glass-panel--dark">
          <Zap size={18} className="text-yellow-400" />
          <span>Real-time stock deduction</span>
        </div>
        <div className="highlight-pill glass-panel--dark">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Zero manual entry required</span>
        </div>
      </section>
    </div>
  );
}
