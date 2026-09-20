import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ContinueButton.css';

/**
 * ContinueButton Component
 * End-of-sequence button that slides up from below viewport into view at bottom-center when scroll progress reaches ~1.
 * On click, navigates to /app/chat with guaranteed routing fallback.
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function ContinueButton({ scrollProgress }) {
  const navigate = useNavigate();

  // Appears near final frame (scrollProgress >= 0.88)
  const isVisible = scrollProgress >= 0.88;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Trigger SPA React Router navigation
    navigate('/app/chat');

    // 2. Fallback check: Ensure route transitions reliably across all browser contexts
    setTimeout(() => {
      if (!window.location.pathname.startsWith('/app')) {
        window.location.href = '/app/chat';
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 50);
  };

  return (
    <div className={`continue-button-wrapper ${isVisible ? 'is-visible' : ''}`}>
      <button
        type="button"
        className="continue-button"
        onClick={handleClick}
        aria-label="Continue to KiranaGo App"
      >
        <span>Continue</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
