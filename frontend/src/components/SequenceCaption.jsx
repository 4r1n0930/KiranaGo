import React from 'react';
import { EncryptedText } from '@/components/ui/encrypted-text';
import './SequenceCaption.css';

const CAPTIONS = [
  { id: 'c1', start: 0.18, end: 0.36, text: 'AI understands your customer' },
  { id: 'c2', start: 0.48, end: 0.66, text: 'Inventory checked in real time' },
  { id: 'c3', start: 0.78, end: 0.92, text: 'Order confirmed automatically' },
];

/**
 * SequenceCaption Component
 * Displays decrypting/encrypted text overlays at specific scroll-progress checkpoints over the ScrollHero sequence.
 *
 * @param {Object} props
 * @param {number} props.scrollProgress - Current scroll progress (0 to 1)
 */
export default function SequenceCaption({ scrollProgress }) {
  // Find which caption checkpoint is active for the current scroll progress
  const activeCaption = CAPTIONS.find(
    (cap) => scrollProgress >= cap.start && scrollProgress <= cap.end
  );

  if (!activeCaption) return null;

  return (
    <div className="sequence-caption-wrapper" key={activeCaption.id}>
      <div className="sequence-caption-scrim">
        <EncryptedText
          text={activeCaption.text}
          className="sequence-caption-text"
          encryptedClassName="text-blue-400/80 font-mono"
          revealedClassName="text-white font-bold"
          revealDelayMs={35}
          flipDelayMs={40}
        />
      </div>
    </div>
  );
}
