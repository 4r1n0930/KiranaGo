import React from 'react';
import { EncryptedText } from './ui/encrypted-text';
import './HeroTitleOverlay.css';

/**
 * HeroTitleOverlay Component
 * Persistent top-left title overlay visible across the entire hero scroll sequence.
 * Uses EncryptedText for a one-time decrypt effect on initial mount (takes ~1.8s total).
 */
export default function HeroTitleOverlay() {
  return (
    <div className="hero-title-overlay-container">
      <div className="hero-title-scrim">
        <h1 className="hero-title-heading">
          <EncryptedText
            text="Welcome to KiranaGo"
            revealDelayMs={95}
            flipDelayMs={60}
            encryptedClassName="text-blue-400 font-mono"
            revealedClassName="text-white font-extrabold"
          />
        </h1>
        <p className="hero-title-subtitle">
          <EncryptedText
            text="Turn WhatsApp orders into a running store."
            revealDelayMs={45}
            flipDelayMs={40}
            encryptedClassName="text-gray-400 font-mono"
            revealedClassName="text-gray-200 font-normal"
          />
        </p>
      </div>
    </div>
  );
}
