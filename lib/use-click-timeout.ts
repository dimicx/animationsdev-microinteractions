import { useCallback, useRef } from "react";

interface UseClickTimeoutProps {
  delay: number;
  onClick: () => void;
}

export function useClickTimeout({ delay, onClick }: UseClickTimeoutProps) {
  const lastClickTimeRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // Clear any pending timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // If enough time has passed since last click, execute immediately
    if (timeSinceLastClick >= delay || lastClickTimeRef.current === 0) {
      lastClickTimeRef.current = now;
      onClick();
    } else {
      // Otherwise, debounce: wait for delay period of inactivity
      clickTimeoutRef.current = setTimeout(() => {
        lastClickTimeRef.current = Date.now();
        onClick();
      }, delay);
    }
  }, [delay, onClick]);

  return { handleClick };
}
