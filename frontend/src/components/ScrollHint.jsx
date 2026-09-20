import React from 'react';
import { ChevronDown } from 'lucide-react';
import './ScrollHint.css';

/**
 * ScrollHint Component
 * Floating scroll-down indicator that fades out as the user begins scrolling (0 -> 0.05 progress).
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function ScrollHint({ scrollProgress }) {
  // Fade out completely by progress 0.05
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.05));

  if (opacity <= 0) return null;

  return (
    <div
      className="scroll-hint-container"
      style={{
        opacity,
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
      }}
      aria-hidden="true"
    >
      <span className="scroll-hint-text">Scroll to explore</span>
      <ChevronDown className="scroll-hint-icon" size={16} />
    </div>
  );
}
