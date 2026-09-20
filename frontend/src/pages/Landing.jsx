import React from 'react';
import ScrollHero from '../components/ScrollHero/ScrollHero';
import HeroTitleOverlay from '../components/HeroTitleOverlay';
import ScrollHint from '../components/ScrollHint';
import ScrollInfoBox from '../components/ScrollInfoBox';
import ContinueButton from '../components/ContinueButton';

/**
 * Landing Page Component
 * Renders the scroll sequence hero experience along with:
 * - HeroTitleOverlay (Persistent top-left corner title)
 * - ScrollInfoBox (Floating translucent explanation pill at progress ~0)
 * - ScrollHint (Floating scroll-down prompt at progress ~0)
 * - ContinueButton (End-of-scroll action button navigating to /app)
 */
export default function Landing() {
  return (
    <main className="landing-page-hero-only">
      <HeroTitleOverlay />
      <ScrollHero scrollLengthMultiplier={3.5}>
        {({ scrollProgress }) => (
          <>
            <ScrollInfoBox scrollProgress={scrollProgress} />
            <ScrollHint scrollProgress={scrollProgress} />
            <ContinueButton scrollProgress={scrollProgress} />
          </>
        )}
      </ScrollHero>
    </main>
  );
}
