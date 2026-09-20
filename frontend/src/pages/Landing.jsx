import React from 'react';
import ScrollHero from '../components/ScrollHero/ScrollHero';
import ScrollHint from '../components/ScrollHint';
import SequenceCaption from '../components/SequenceCaption';
import ContinueButton from '../components/ContinueButton';

/**
 * Landing Page Component
 * Renders the scroll sequence hero experience with scroll progress overlays:
 * - ScrollHint: Floating scroll-down prompt at progress 0
 * - SequenceCaption: Decrypting EncryptedText captions at sequence checkpoints
 * - ContinueButton: Animated end-of-sequence action button near progress 1
 */
export default function Landing() {
  return (
    <main className="landing-page-hero-only">
      <ScrollHero scrollLengthMultiplier={3.5}>
        {({ scrollProgress }) => (
          <>
            <ScrollHint scrollProgress={scrollProgress} />
            <SequenceCaption scrollProgress={scrollProgress} />
            <ContinueButton scrollProgress={scrollProgress} />
          </>
        )}
      </ScrollHero>
    </main>
  );
}
