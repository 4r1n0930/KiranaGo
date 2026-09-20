import React from 'react';
import { Sparkles } from 'lucide-react';
import './ScrollInfoBox.css';

/**
 * ScrollInfoBox Component
 * Translucent glass pill explaining the scroll-driven interactive hero sequence.
 * Visible at scrollProgress = 0, fades out smoothly by scrollProgress = 0.05.
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function ScrollInfoBox({ scrollProgress }) {
  // Visible near scroll progress 0, fades out completely by progress 0.05
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.05));

  if (opacity <= 0) return null;

  return (
    <div
      className="scroll-info-box-container glass-panel--dark"
      style={{
        opacity,
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
      }}
      aria-live="polite"
    >
      <Sparkles size={14} className="info-box-icon text-blue-400" />
      <span>Scroll to watch the story unfold</span>
    </div>
  );
}
