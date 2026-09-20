import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pages.css';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo login action navigating directly to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/app" className="login-logo">KiranaGo 🏬</Link>
          <h2>Shopkeeper Login</h2>
          <p>Enter your registered mobile number to manage your digital store</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <div className="input-prefix-wrapper">
              <span className="prefix">+91</span>
              <input
                id="mobile"
                type="tel"
                placeholder="98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Send OTP & Login →
          </button>
        </form>

        <div className="login-footer">
          <p>Want to test the app without logging in?</p>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/dashboard')}
          >
            Explore Demo Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
