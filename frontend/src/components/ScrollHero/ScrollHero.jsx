import React, { useEffect, useCallback } from 'react';
import { useScrollSequence } from './useScrollSequence';
import './ScrollHero.css';

/**
 * ScrollHero Component
 * 
 * Scroll-triggered image sequence hero section for KiranaGo.
 * Renders a full-viewport responsive canvas with object-fit: cover frame drawing,
 * retina devicePixelRatio support, and debounced window resize adjustments.
 *
 * @param {Object} props
 * @param {number} [props.scrollLengthMultiplier=3.5] - Multiplier for viewport scroll length (e.g. 3.5x 100dvh)
 * @param {number} [props.totalFrames=179] - Total frame count in sequence
 * @param {React.ReactNode|Function} [props.children] - Children or render prop function receiving ({ scrollProgress })
 */
export default function ScrollHero({
  scrollLengthMultiplier = 3.5,
  totalFrames = 179,
  children
}) {
  const {
    containerRef,
    canvasRef,
    isLoading,
    loadProgress,
    currentFrameIndex,
    scrollProgress,
    images,
    calculateFrameIndex
  } = useScrollSequence({ totalFrames });

  /**
   * Draws an image onto the canvas using object-fit: cover math with High-DPI / Retina scale support.
   */
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    if (displayWidth === 0 || displayHeight === 0) return;

    // Buffer dimensions scaled by devicePixelRatio for crisp rendering
    const bufferWidth = Math.floor(displayWidth * dpr);
    const bufferHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Object-fit: cover calculations
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = displayWidth / displayHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgRatio;
      offsetX = 0;
      offsetY = (displayHeight - drawHeight) / 2;
    } else {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgRatio;
      offsetX = (displayWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, [canvasRef]);

  // Redraw canvas whenever current frame or preloaded image array updates
  useEffect(() => {
    if (isLoading || !images || images.length === 0) return;
    const currentImg = images[currentFrameIndex - 1];
    if (currentImg) {
      drawFrame(currentImg);
    }
  }, [currentFrameIndex, images, isLoading, drawFrame]);

  // Debounced window resize listener to resize canvas & update scroll progress cleanly
  useEffect(() => {
    let debounceTimer = null;

    const handleResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const frameIdx = calculateFrameIndex();
        if (images && images[frameIdx - 1]) {
          drawFrame(images[frameIdx - 1]);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateFrameIndex, drawFrame, images]);

  return (
    <div
      ref={containerRef}
      className="scroll-hero-wrapper"
      style={{ height: `${scrollLengthMultiplier * 100}dvh` }}
    >
      <div className="scroll-hero-sticky">
        <canvas
          ref={canvasRef}
          className="scroll-hero-canvas"
          role="img"
          aria-label="KiranaGo shopkeeper scroll sequence hero animation"
        />

        {isLoading && (
          <div className="scroll-hero-loader-overlay">
            <div className="scroll-hero-loader-card">
              <div className="scroll-hero-spinner" />
              <div className="scroll-hero-loader-text">
                <span className="scroll-hero-loader-title">KiranaGo</span>
                <span className="scroll-hero-loader-percentage">{loadProgress}%</span>
              </div>
              <div className="scroll-hero-progress-track">
                <div
                  className="scroll-hero-progress-fill"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {typeof children === 'function' ? children({ scrollProgress, currentFrameIndex }) : children}
      </div>
    </div>
  );
}
