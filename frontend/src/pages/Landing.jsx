import React from 'react';
import ScrollHero from '../components/ScrollHero/ScrollHero';
import ScrollHint from '../components/ScrollHint';

/**
 * Landing Page Component
 * Renders only the scroll sequence hero experience and floating scroll-down hint.
 */
export default function Landing() {
  return (
    <main className="landing-page-hero-only">
      <ScrollHero scrollLengthMultiplier={3.5}>
        {({ scrollProgress }) => (
          <ScrollHint scrollProgress={scrollProgress} />
        )}
      </ScrollHero>
    </main>
  );
}
