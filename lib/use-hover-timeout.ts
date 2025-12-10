import { useCallback, useRef } from "react";

interface UseHoverTimeoutProps {
  delay: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  disabledRef?: React.RefObject<boolean>;
}

export function useHoverTimeout({
  delay,
  onHoverStart,
  onHoverEnd,
  disabledRef,
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

  return { handleMouseEnter, handleMouseLeave };
}
