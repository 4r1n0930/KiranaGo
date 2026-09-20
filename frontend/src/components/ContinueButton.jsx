import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import './ContinueButton.css';

/**
 * ContinueButton Component
 * End-of-sequence button that slides up from below viewport into view at bottom-center when scroll progress reaches ~1.
 * On click, navigates to /app.
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function ContinueButton({ scrollProgress }) {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  
  // Appears near final frame (scrollProgress >= 0.88)
  const isVisible = scrollProgress >= 0.88;

  useEffect(() => {
    if (!buttonRef.current) return;

    if (isVisible) {
      gsap.to(buttonRef.current, {
        xPercent: -50,
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        pointerEvents: 'auto',
      });
    } else {
      gsap.to(buttonRef.current, {
        xPercent: -50,
        y: 80,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        pointerEvents: 'none',
      });
    }
  }, [isVisible]);

  const handleContinueClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/app');
  };

  return (
    <div
      ref={buttonRef}
      className="continue-button-wrapper"
      style={{ transform: 'translateX(-50%) translateY(80px)', opacity: 0, pointerEvents: 'none' }}
    >
      <button
        type="button"
        className="continue-button"
        onClick={handleContinueClick}
        aria-label="Continue to KiranaGo App"
      >
        <span>Continue</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
