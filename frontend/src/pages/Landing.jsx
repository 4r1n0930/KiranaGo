import React from 'react';
import { Link } from 'react-router-dom';
import ScrollHero from '../components/ScrollHero/ScrollHero';
import './Pages.css';

export default function Landing() {
  return (
    <div className="page-container landing-page">
      {/* Top Navbar */}
      <nav className="kiranago-nav">
        <div className="nav-brand">
          <span className="brand-badge">KiranaGo</span>
          <span className="brand-tagline">Digitizing Neighborhood Stores</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Shopkeeper Login</Link>
          <Link to="/dashboard" className="nav-button">Open Dashboard →</Link>
        </div>
      </nav>

      {/* Hero Section (Scroll Sequence) */}
      <section className="hero-section-wrapper">
        <ScrollHero scrollLengthMultiplier={3.5} />
      </section>

      {/* Landing Details & Features below the hero animation */}
      <section className="landing-content">
        <div className="content-container">
          <h2 className="section-title">Empowering Local Kiranas with Smart Tech</h2>
          <p className="section-subtitle">
            Transform your neighborhood store into a digital powerhouse with automated inventory, instant WhatsApp orders, and voice-assisted management.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Digital Storefront</h3>
              <p>Launch your online store in under 2 minutes. Let neighborhood customers order directly from WhatsApp.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Smart Inventory Tracking</h3>
              <p>Automated stock alerts before items run out. Sync offline counter sales with your digital inventory.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎙️</div>
              <h3>Voice & Regional Commands</h3>
              <p>Speak in Hindi, Hinglish, or local languages to update stock, add prices, or create customer tabs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Real-Time Restock Alerts</h3>
              <p>Predictive reordering suggestions for fast-moving staples like Atta, Milk, and Oil.</p>
            </div>
          </div>

          <div className="cta-banner">
            <h2>Ready to take your Kirana digital?</h2>
            <div className="cta-actions">
              <Link to="/login" className="btn btn-primary">Start Free Trial</Link>
              <Link to="/dashboard" className="btn btn-secondary">Explore Demo Dashboard</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
