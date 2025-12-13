"use client";

import { useState, useEffect } from "react";

interface UseIsMobileReturn {
  /** Whether the device is mobile */
  isMobile: boolean;
  /** Whether the initial detection is still loading */
  isLoading: boolean;
}

/**
 * Hook for detecting if the user is on a mobile device.
 * Uses media query to check if the viewport width is below 768px,
 * combined with user agent detection for more accurate results.
 *
 * @returns Object with isMobile boolean and isLoading state
 * @see https://www.usehooks.io/docs/use-is-mobile
 */
export const useIsMobile = (): UseIsMobileReturn => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check using media query
      const mediaQuery = window.matchMedia("(max-width: 768px)");

      // Check using user agent (additional detection)
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "android",
        "webos",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
        "mobile",
      ];

      const isMobileUA = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword)
      );

      // Combine both checks - prioritize media query but consider user agent
      const isMobileDevice =
        mediaQuery.matches || (isMobileUA && window.innerWidth <= 768);

      setIsMobile(isMobileDevice);
      setIsLoading(false);
    };

    // Initial check
    checkIsMobile();

    // Listen for media query changes
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => checkIsMobile();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Listen for window resize
    window.addEventListener("resize", checkIsMobile);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return {
    isMobile,
    isLoading,
  };
};

export default useIsMobile;
