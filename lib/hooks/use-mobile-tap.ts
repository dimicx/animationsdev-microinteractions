import { useCallback, useEffect, useRef } from "react";

interface UseMobileTapOptions {
  /** Whether the device is mobile */
  isMobile: boolean;
}

interface UseMobileTapReturn {
  /** Whether ready for click action (always true on desktop) */
  isReady: boolean;
  /** Mark first tap complete, enabling click action */
  markTapped: () => void;
  /** Reset ready state */
  reset: () => void;
  /** Ref for checking ready state in callbacks */
  isReadyRef: React.RefObject<boolean>;
}

/**
 * Hook for handling mobile double-tap pattern.
 * On mobile: first tap triggers hover, second tap triggers click action.
 * On desktop: isReady is always true, allowing immediate clicks.
 *
 * @param isMobile - Whether the device is mobile
 * @returns Object with isReady state, markTapped, reset functions, and isReadyRef
 *
 * @example
 * ```tsx
 * const { isReady, markTapped, reset, isReadyRef } = useMobileTap({ isMobile });
 *
 * const handleClick = () => {
 *   if (!isReady) {
 *     markTapped(); // First tap on mobile
 *     return;
 *   }
 *   // Proceed with action
 * };
 * ```
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
    reset,
    isReadyRef,
  };
}
