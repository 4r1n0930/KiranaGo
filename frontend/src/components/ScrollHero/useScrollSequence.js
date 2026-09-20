import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to handle image preloading and scroll-driven frame selection.
 *
 * @param {Object} options
 * @param {number} options.totalFrames - Total number of sequence frames (default 179)
 * @param {Function} options.getFramePath - Function returning image path for a 1-indexed frame
 * @returns {Object} { containerRef, canvasRef, isLoading, loadProgress, currentFrameIndex, images, calculateFrameIndex }
 */
export function useScrollSequence({
  totalFrames = 179,
  getFramePath = (index) => `/sequences/shopkeeper-hero/ezgif-frame-${String(index).padStart(3, '0')}.jpg`
} = {}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);

  const rafIdRef = useRef(null);

  // Preload all frames on mount
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const loadedImages = new Array(totalFrames);

    const handleImageCompletion = () => {
      if (!isMounted) return;
      loadedCount += 1;
      const progress = Math.min(100, Math.round((loadedCount / totalFrames) * 100));
      setLoadProgress(progress);

      if (loadedCount === totalFrames) {
        setImages(loadedImages);
        setIsLoading(false);
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      if (img.complete) {
        loadedImages[i - 1] = img;
        handleImageCompletion();
      } else {
        img.onload = () => {
          loadedImages[i - 1] = img;
          handleImageCompletion();
        };
        img.onerror = () => {
          // Fallback if an image fails to load so state progression never halts
          loadedImages[i - 1] = img;
          handleImageCompletion();
        };
      }
    }

    return () => {
      isMounted = false;
    };
  }, [totalFrames, getFramePath]);

  // Calculate the target frame index based on container scroll progress within viewport
  const calculateFrameIndex = useCallback(() => {
    if (!containerRef.current) return 1;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const totalScrollableDistance = rect.height - viewportHeight;

    if (totalScrollableDistance <= 0) return 1;

    // Scrolled distance inside container (0 when top is at top of viewport)
    const scrolledDistance = -rect.top;
    const rawProgress = scrolledDistance / totalScrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    // Map clamped 0..1 scroll ratio to 1..totalFrames (rounded to nearest integer)
    const frameIndex = Math.min(
      totalFrames,
      Math.max(1, Math.round(1 + clampedProgress * (totalFrames - 1)))
    );

    return frameIndex;
  }, [totalFrames]);

  // Scroll handler throttled via requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const nextFrame = calculateFrameIndex();
      setCurrentFrameIndex((prevIndex) => (prevIndex !== nextFrame ? nextFrame : prevIndex));
    });
  }, [calculateFrameIndex]);

  // Use IntersectionObserver to attach/detach scroll listener when hero is near/in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isListening = false;

    const attachScrollListener = () => {
      if (!isListening) {
        window.addEventListener('scroll', handleScroll, { passive: true });
        isListening = true;
        // Compute frame immediately on attachment
        handleScroll();
      }
    };

    const detachScrollListener = () => {
      if (isListening) {
        window.removeEventListener('scroll', handleScroll);
        isListening = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attachScrollListener();
          } else {
            detachScrollListener();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px 0px 100px 0px', // Attach listener slightly before entering viewport
        threshold: 0
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      detachScrollListener();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleScroll]);

  return {
    containerRef,
    canvasRef,
    isLoading,
    loadProgress,
    currentFrameIndex,
    images,
    calculateFrameIndex
  };
}

export default useScrollSequence;
