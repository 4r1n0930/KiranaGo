import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ContinueButton.css';

/**
 * ContinueButton Component
 * End-of-sequence button that slides up into view when scroll progress reaches the final frames.
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function ContinueButton({ scrollProgress }) {
  // Visible near final frame (e.g. progress >= 0.95)
  const isVisible = scrollProgress >= 0.95;

  return (
    <div className={`continue-button-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
      <Link to="/dashboard" className="continue-button">
        <span>Continue</span>
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
