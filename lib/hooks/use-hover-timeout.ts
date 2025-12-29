import { useCallback, useRef } from "react";

interface UseHoverTimeoutProps {
  /** Delay in milliseconds before hover animation starts */
  delay: number;
  /** Callback fired when hover state starts (after delay) */
  onHoverStart: () => void;
  /** Callback fired when hover state ends */
  onHoverEnd: () => void;
  /** Optional ref to check if hover is disabled */
  disabledRef?: React.RefObject<boolean>;
  /** Optional ref to check if reduce motion is enabled */
  shouldReduceMotion?: boolean | null;
}

/**
 * Hook for handling hover interactions with a delay threshold.
 * Prevents quick mouse pass-throughs from triggering hover animations by requiring
 * the mouse to stay hovered for a minimum duration before starting the animation.
 *
 * @param delay - Delay in milliseconds before hover animation starts
 * @param onHoverStart - Callback fired when hover state starts (after delay)
 * @param onHoverEnd - Callback fired when hover state ends
 * @param disabledRef - Optional ref to check if hover is disabled
 * @returns Object with handleMouseEnter and handleMouseLeave event handlers
 */
export function useHoverTimeout({
  delay,
  onHoverStart,
  onHoverEnd,
  disabledRef,
  shouldReduceMotion = false,
}: UseHoverTimeoutProps) {
  const mouseEnterTimeRef = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (disabledRef?.current) return;

    mouseEnterTimeRef.current = Date.now();

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Delay starting hover animation until we're sure it's not a quick pass-through
    hoverTimeoutRef.current = setTimeout(() => {
      if (disabledRef?.current) return;
      onHoverStart();
    }, delay);
  }, [delay, onHoverStart, disabledRef]);

  const handleMouseLeave = useCallback(() => {
    if (disabledRef?.current) return;

    const hoverDuration = Date.now() - mouseEnterTimeRef.current;

    // Clear the pending hover animation if mouse left before timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Only process if hover was long enough (animation actually started)
    if (hoverDuration >= delay) {
      onHoverEnd();
    }
  }, [delay, onHoverEnd, disabledRef]);

  if (shouldReduceMotion) {
    return { handleMouseEnter: () => {}, handleMouseLeave: () => {} };
  }

  return { handleMouseEnter, handleMouseLeave };
}
