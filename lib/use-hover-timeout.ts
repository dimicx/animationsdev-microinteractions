import { useCallback, useRef } from "react";

interface UseHoverTimeoutProps {
  delay: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function useHoverTimeout({
  delay,
  onHoverStart,
  onHoverEnd,
}: UseHoverTimeoutProps) {
  const mouseEnterTimeRef = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    mouseEnterTimeRef.current = Date.now();

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Delay starting hover animation until we're sure it's not a quick pass-through
    hoverTimeoutRef.current = setTimeout(() => {
      onHoverStart();
    }, delay);
  }, [delay, onHoverStart]);

  const handleMouseLeave = useCallback(() => {
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
  }, [delay, onHoverEnd]);

  return { handleMouseEnter, handleMouseLeave };
}
