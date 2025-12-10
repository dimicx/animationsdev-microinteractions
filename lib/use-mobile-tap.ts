import { useCallback, useEffect, useRef } from "react";

interface UseMobileTapOptions {
  /** Whether the device is mobile */
  isMobile: boolean;
}

interface UseMobileTapReturn {
  /** Whether the component is ready for click action (always true on desktop) */
  isReady: boolean;
  /** Call this to mark the first tap as complete (for immediate mode) */
  markTapped: () => void;
  /** Call this when hover/animation completes (for delayed mode) */
  markReady: () => void;
  /** Reset state (call on hover end) */
  reset: () => void;
  /** Ref for checking ready state in callbacks */
  isReadyRef: React.RefObject<boolean>;
}

/**
 * Hook for handling mobile "double-tap" pattern where:
 * - First tap triggers hover state
 * - Second tap triggers the actual click action
 *
 * On desktop, isReady is always true.
 *
 * Two modes:
 * 1. Immediate: Call markTapped() on first click, isReady becomes true immediately
 * 2. Delayed: Call markReady() after animation/timeout, isReady becomes true then
 */
export function useMobileTap({
  isMobile,
}: UseMobileTapOptions): UseMobileTapReturn {
  // Start as true (desktop default), will be corrected by effect on mobile
  const isReadyRef = useRef(true);

  // Sync ref when isMobile changes (handles SSR hydration where isMobile starts false)
  useEffect(() => {
    if (isMobile) {
      isReadyRef.current = false;
    }
  }, [isMobile]);

  const markTapped = useCallback(() => {
    if (isMobile) {
      isReadyRef.current = true;
    }
  }, [isMobile]);

  const markReady = useCallback(() => {
    if (isMobile) {
      isReadyRef.current = true;
    }
  }, [isMobile]);

  const reset = useCallback(() => {
    if (isMobile) {
      isReadyRef.current = false;
    }
  }, [isMobile]);

  return {
    get isReady() {
      return isReadyRef.current;
    },
    markTapped,
    markReady,
    reset,
    isReadyRef,
  };
}
